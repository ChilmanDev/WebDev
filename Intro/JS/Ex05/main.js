class NotePad{
    constructor(textAreaElement){
        this.textAreaElement = textAreaElement;
        this.currentNoteIndex = 0;
        this.notes = [''];
    }

    saveNote(){
        this.notes[this.currentNoteIndex] = this.textAreaElement.value;
    }

    deleteNote(){
        if(this.notes.length <= 1)//Array of notes only has the note that is being deleted
        {
            this.notes[this.currentNoteIndex] = '';
        }
        else
        {
            this.notes.splice(this.currentNoteIndex, 1);

            if(this.currentNoteIndex > 0)//Current note is NOT the first
                this.currentNoteIndex--;
            else                         //Current note is the first
                this.currentNoteIndex++;
        }

        this.updateDisplay();
    }

    newNote(){
        this.saveNote();

        if(this.textAreaElement.value !== '')
        {
            if(this.currentNoteIndex === this.notes.length - 1)
                this.notes.push('');
            else
                this.notes.splice(this.currentNoteIndex + 1, 0, '');
            
            this.currentNoteIndex++;
            this.updateDisplay();
        }
    }

    navigate(buttonText){
        this.saveNote();

        if(buttonText === "<<")
        {
            if(this.currentNoteIndex > 0)
                this.currentNoteIndex--;
        }
            
        else if(buttonText === ">>")
        {
            if(this.currentNoteIndex < this.notes.length - 1)
                this.currentNoteIndex++;
        }  
        
        this.updateDisplay();
        console.log(this.currentNoteIndex);
    }

    updateDisplay(){
        this.textAreaElement.value = this.notes[this.currentNoteIndex];
    }
}

const textAreaElement = document.querySelector('[data-note]');
const navigationButtons = document.querySelectorAll('[data-nav]');
const saveButton = document.querySelector('[data-save]');
const deleteButton = document.querySelector('[data-delete]');
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

deleteButton.addEventListener("click", () => {
    notePad.deleteNote();
})

newButton.addEventListener("click", () => {
    notePad.newNote();
})