import { Component, HostListener, QueryList, ViewChildren, ɵɵqueryRefresh } from "@angular/core";
import { WORDS } from "./words";
import { ElementRef } from '@angular/core';

//Tamanho da palavra
const WORD_LENGTH = 5;

//Numero de tentativas
const NUM_TRIES = 6;

// Mapa de letras
const LETTERS = (()=>{
    // letra -> true
    const ret: {[key:string]:boolean} = {};
    for (let charCode = 97; charCode < 97 + 26; charCode++){
        ret[String.fromCharCode(charCode)] = true;
    }
    return ret;
})();

interface Try{
    letters: Letter[];
}

//Uma letra em uma tentativa
interface Letter{
    text: string;
    state: LetterState;
}

enum LetterState{
    //Errada
    WRONG,
    //Letra correta mas na posicao incorreta
    PARTIAL_MATCH,
    //Letra e posicao correta
    FULL_MATCH,
    //Antes da tentativa ser enviada
    PENDING,
}

@Component({
    selector: 'wordle' ,
    templateUrl: './wordle.component.html' ,
    styleUrls: ['./wordle.component.scss']
})

export class Wordle{
    @ViewChildren('tryContainer') tryContainers!: QueryList<ElementRef>;

    //Armazena todas tentativas
    //Uma tentativa é uma linha
    readonly tries: Try[]= []; 
    //Faz o enum LetterState acessivel globalmente
    readonly LetterState = LetterState;
    
    //Teclado on-display
    // Linhas do teclado
    readonly keyboardRows = [
        ['Q', 'W', 'E', 'R', 'T' , 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D' , 'F', 'G' , 'H ', 'J', 'K', 'L'],
        ['Enter', 'Z' , 'X', 'C', 'V', 'B' , 'N' , 'M', 'Backspace'],
    ];

    //Armazena o estado das teclas por index
    readonly curLetterStates: {[key: string]: LetterState} = {};

    //Mensagem no painel de notificacao
    infoMsg = '';
    //Controla o desaparecimento da notificacao
    fadeOutInfoMessage = false;

    //Mostrar a tela de fim de jogo
    showShareDialogContainer = false;
    showShareDialog = false;

    //Index da letra atual
    private curLetterIndex= 0;

    //Quantas tentativas ja foram usadas
    private numSubmittedTries = 0;

    //Armazena a palavra desejada
    private targetWord = '';

    //Vitoria
    private won = false;

    //Armazena a quantidade de cada letra da palavra resposta

    //Se a palavra for "swiss", o mapa vai ficar assim:
    //{ 's':3, 'w': 1 , 'i': 1}
    private targetWordLetterCounts: {[letter: string]: number} = {};

    constructor(){
        //Popular o estado inicial das tentativas
        for (let i = 0; i < NUM_TRIES; i ++) {
            const letters: Letter[] = [];

            for (let j = 0; j < WORD_LENGTH; j ++) {
                letters.push({text: '', state: LetterState.PENDING});
            }

            this.tries.push({letters});
        }

        //Obtem uma palavra da lista de palavras
        const numWords = WORDS.length;
        while(true){
            //Excolhe uma palavra aleatoria da list de palavras
            const index = Math.floor(Math.random() * numWords);
            const word = WORDS[index];
            if(word.length == WORD_LENGTH){
                this.targetWord =  word.toLowerCase();
                break;
            }
        }
        console.log('target word: ', this.targetWord);

        //Gera contagem de letras para a palavra resposta
        for (const letter of this.targetWord) {
            const count = this.targetWordLetterCounts[letter];

            if(count == null) {
                this.targetWordLetterCounts[letter] = 0;
            }

            this.targetWordLetterCounts[letter]++;
        }
        console.log(this.targetWordLetterCounts);
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent){
        this.handleClickKey(event.key);
    }

    //Retorna a classe da uma tecla de acordo com seu estado
    getKeyClass(key: string): string {
        const state = this.curLetterStates[key.toLowerCase()];

        switch(state){
            case LetterState.FULL_MATCH:
                return 'match key';
            case LetterState.PARTIAL_MATCH:
                return 'partial key';
            case LetterState.WRONG:
                return 'wrong key';
            default:
                return 'key';
        }
    }


    handleClickKey(key: string){
        //Se venceu nenhum procesos ocorre
        if(this.won)
            return;

        //Se a tecla for uma letra, atualizar o texto no objeto da letra correspondente 
        if(LETTERS[key.toLocaleLowerCase()]) {
            //Apenas permite digitar na tentativa atual
            //Nao vai alem se a tentativa nao foi enviada
            if(this.curLetterIndex < (this.numSubmittedTries + 1) * WORD_LENGTH){
                this.setLetter(key);
                this.curLetterIndex++;
            } 
        }
        else if(key === 'Backspace'){
            //Nao deletar tentativa anterior
            if(this.curLetterIndex > this.numSubmittedTries * WORD_LENGTH){
                this.curLetterIndex--;
                this.setLetter('');
            }
                
        }
        //Enviar tentativa atual
        else if(key === 'Enter'){
            this.checkCurrentTry();
        }
    }

    handleClickShare(){
        //🟩 🟨 🟥 ⬜
        //Copiar os resultados para o ctrl + c
        let clipboardContent = '';
        for(let i = 0; i < this.numSubmittedTries; i++){
            for (let j = 0; j < WORD_LENGTH; j++){
                const letter = this.tries[i].letters[j];

                switch(letter.state){
                    case LetterState.FULL_MATCH:
                        clipboardContent += '🟩';
                        break;
                    case LetterState.PARTIAL_MATCH:
                        clipboardContent += '🟨';
                        break;
                    case LetterState.FULL_MATCH:
                        clipboardContent += '⬜';
                        break;
                    default:
                        break;
                }
            }
            clipboardContent += '\n';
        }
        
        console.log(clipboardContent);
        navigator.clipboard.writeText(clipboardContent);
        this.showShareDialogContainer = false;
        this.showShareDialog = false;
        this.showInfoMessage("Copied results to clipboard");

        setTimeout(()=>{
            window.location.reload();
        }, 1000)
    }

    private setLetter(letter: string){
        const tryIndex = Math.floor(this.curLetterIndex / WORD_LENGTH);
        const letterIndex = this.curLetterIndex - tryIndex * WORD_LENGTH;
        this.tries[tryIndex].letters[letterIndex].text = letter;
    }

    private async checkCurrentTry(){
        //Verificar se o usuario digitou todas letras
        const curTry = this.tries[this.numSubmittedTries];
        if(curTry.letters.some(letter => letter.text === '')){
            this.showInfoMessage('Not enough letters');
            return;
        }
        
        //Verifica se a tentativa atual faz parte da lista de palavras
        const wordFromCurTry = curTry.letters.map(letter => letter.text).join('').toLowerCase();
        if (!WORDS.includes(wordFromCurTry)) {
            this.showInfoMessage('Not in word list');
            //Animacao de palavra invalida
            const tryContainer = this.tryContainers.get(this.numSubmittedTries)?.nativeElement as HTMLElement;
            tryContainer.classList.add('shake');
            setTimeout(()=>{
                tryContainer.classList.remove('shake');
            }, 500);
            return;
        }

        //Verifica se a tentativa é a resposta correta

        //Armazena os resultados da checagem

        //Clonar o map de contagem. Usado em toda checagem inicial de valores
        const targetWordLetterCounts = {...this.targetWordLetterCounts};
        const states: LetterState[] = [];
        for (let i = 0; i < WORD_LENGTH; i ++) {
            const expected = this.targetWord[i];
            const curLetter = curTry.letters[i];
            const got = curLetter.text.toLowerCase();
            let state = LetterState.WRONG;

            //Garantir que a verificacao só ocorra uma vez em cada letra
            //Se todas ocorrencias de uma letra ja foram encontradas nao deve ser verificada novamente
            if (expected === got && targetWordLetterCounts[got] > 0){
                this.targetWordLetterCounts[expected]--;
                state = LetterState.FULL_MATCH;
            }
            else if(this.targetWord.includes(got) && targetWordLetterCounts[got] > 0) {
                targetWordLetterCounts[got]--
                state = LetterState.PARTIAL_MATCH;
            }
            states.push(state);
        }
        console.log(states);

        //Animacao

        //Obter a tentativa atual
        const tryContainer = this.tryContainers.get(this.numSubmittedTries)?.nativeElement as HTMLElement;
        //Obter os elementos das letras
        const letterElements = tryContainer.querySelectorAll('.letter-container');
        for(let i = 0; i < letterElements.length; i++) {
            const curLetterElement = letterElements[i];
            curLetterElement.classList.add('fold');
            //Espera a animacao acabar
            await this.wait(180);
            //Atualiza o estado (tambem vai atualizar o visual)
            curTry.letters[i].state = states[i];
            curLetterElement.classList.remove('fold');
            await this.wait(180);
        } 

        //Armazenar o estado das teclas
        //Fazer isso depois da tentativa ter sido enviada e a animacao encerrar
        for (let i= 0; i < WORD_LENGTH; i ++) {
            const curLetter = curTry.letters[i];
            const got = curLetter.text.toLowerCase();
            const curStoredState = this.curLetterStates[got];
            const targetState = states[i];
            // This allows override state with better result.
            //Isso permite sobrescrever o estado da tecla
            //Se por exemplo a tecla tinha um acerto parcial antes e agora esta correta vai ser atualizada
            if(curStoredState == null || targetState > curStoredState) {
                this.curLetterStates[got] = targetState;
            }
        }


        this.numSubmittedTries++;

        //Verifica se todas letras na tentativa atual estao corretas
        if (states.every(state=>state === LetterState.FULL_MATCH)) {
            this.showInfoMessage('RESPOSTA CORRETA! ');
            this.won = true;
            // Animacao
            for (let i = 0; i < letterElements.length; i ++) {
                const curLetterElement = letterElements[i];
                curLetterElement.classList.add('bounce');

                await this.wait(160);
            }
            //Mostrar painel de fim de jogo
            this.showShare();
            return;
        }

        //Mostrar a resposta correta quando o jogador gastar todas tentativas
        if(this.numSubmittedTries === NUM_TRIES){
            //Nao esconder esta mensagem
            this.showInfoMessage(this.targetWord.toLocaleUpperCase(), false);
            //Mostrar painel de fim de jogo
            this.showShare();
        }
    }

    private showInfoMessage(msg:string, hide = true){
        this.infoMsg = msg;
        
        if(hide){
            //Sumir depos de 2s
            setTimeout(() => {
                this.fadeOutInfoMessage = true;
                //Resetar quando animacao encerrar
                setTimeout(()=>{
                    this.infoMsg = '';
                    this.fadeOutInfoMessage = false;
                }, 500)
            }, 2000);
        }
    }

    private async wait(ms: number){
        await new Promise<void>((resolve)=> {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }

    private showShare(){
        setTimeout(()=>{
            this.showShareDialogContainer = true;
            setTimeout(() => {
                this.showShareDialog = true;
            });
        }, 1500);
    }
}