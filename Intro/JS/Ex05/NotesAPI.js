export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(window.localStorage.getItem("notesapp-notes") || "[]");

    }

    static saveNote(noteToSave) {

    }

    static deleteNote(id) {

    }
}