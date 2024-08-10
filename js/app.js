import NotesAPI from "./notesApi.js";
import NotesView from "./notesView.js";

export default class App {
    constructor(root){
        this.notes = [];
        this.activeNotes = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes(){
        const notes = NotesAPI.getAllNotes();

        this._setNotes(notes);

        if(notes.length > 0){
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes){
        this.notes = notes;
        this.view.updateNotesList(notes)
        this.view.updateNotePreviewVisibility(notes.length > 0)
    }

    _setActiveNote(note){
        this.activeNotes = note;
        this.view.updateActiveNote(note)
    }

    _handlers(){
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNotes = {
                    title: "New entry",
                    body: "Add an entry...."
                }

                NotesAPI.saveNotes(newNotes);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                NotesAPI.saveNotes({
                    id:this.activeNotes.id,
                    title,
                    body
                });
                this._refreshNotes();
            },
            onNoteDelete: noteId => {
               NotesAPI.deleteNotes(noteId);
                this._refreshNotes();
               
            }
        }
    }
}