class NotePad{
    constructor(textAreaElement){
        this.textAreaElement = textAreaElement;
        this.currentNoteIndex = 0;
        this.notes = [''];
    }

    saveNote(){
        this.notes[this.currentNoteIndex] = this.textAreaElement.value;
        console.log(this.notes[this.currentNoteIndex]);
    }

    newNote(){
        this.saveNote();
        this.notes.push('');
        this.currentNoteIndex++;
        this.updateDisplay();
    }

    navigate(buttonText){
        if(buttonText === "<<")
            if(this.currentNoteIndex > 0)
                this.currentNoteIndex--;
        else if(buttonText === ">>")
            if(this.notes.length - 1 > this.currentNoteIndex)
                this.currentNoteIndex++;

        this.updateDisplay();
    }
    updateDisplay(){
        this.textAreaElement.value = this.notes[this.currentNoteIndex];
    }
}

const textAreaElement = document.querySelector('[data-note]');
const navigationButtons = document.querySelectorAll('[data-nav]');
const saveButton = document.querySelector('[data-save]');
const newButton = document.querySelector('[data-new]');

const notePad = new NotePad(textAreaElement);

navigationButtons.forEach(navButton => {
    navButton.addEventListener("click", () => {
        notePad.navigate(navButton.innerText);
    });
})

saveButton.addEventListener("click", () => {
    notePad.saveNote();
})

newButton.addEventListener("click", () => {
    notePad.newNote();
})