import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // --- STATE DEFINITIONS ---
  // Stores the list of notes. Each note is an object: { id, title, content, createdAt }
  const [notes, setNotes] = useState([]);
  
  // Stores the current input value of the note title field
  const [title, setTitle] = useState("");
  
  // Stores the current input value of the note content text area
  const [content, setContent] = useState("");
  
  // Stores the ID of the note being edited. If null, we are in "Create" mode; otherwise, "Edit" mode.
  const [editingId, setEditingId] = useState(null);

  // --- SIDE EFFECTS (LIFECYCLE) ---
  // Hook to load saved notes from LocalStorage once when the component initially mounts
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  // Hook to automatically synchronize the notes list to LocalStorage whenever the 'notes' state changes
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // --- EVENT HANDLERS ---
  // Handles both creating a new note and updating an existing one
  const handleSubmit = () => {
    // Validation: Prevent submitting empty notes
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      // EDIT MODE: Update the existing note in the list by mapping over notes
      setNotes(
        notes.map((note) =>
          note.id === editingId
            ? { ...note, title, content } // Return updated note details
            : note // Leave other notes unchanged
        )
      );
      // Reset the editing flag back to null after update is complete
      setEditingId(null);
    } else {
      // CREATE MODE: Create a new note object
      const newNote = {
        id: Date.now(), // Generate a unique ID using current timestamp
        title,
        content,
        createdAt: new Date().toLocaleString(), // Format date/time string
      };

      // Add the new note to the top of the notes array
      setNotes([newNote, ...notes]);
    }

    // Reset input fields to empty strings
    setTitle("");
    setContent("");
  };

  // Deletes a note by filtering out the item matching the clicked note ID
  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Populates the input form fields with the selected note's data and sets the editing state
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  // --- JSX RENDER ---
  return (
    <div className="app">
      <div className="container">
        <h1>📝 Notes App</h1>

        {/* Form Card for Creating / Editing Notes */}
        <div className="form-card">
          <input
            type="text"
            placeholder="Enter note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Bind title input to state
          />

          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)} // Bind content textarea to state
          />

          <button onClick={handleSubmit}>
            {/* Dynamic button text based on editing mode state */}
            {editingId ? "Update Note" : "Add Note"}
          </button>
        </div>

        {/* Display Grid of Notes */}
        <div className="notes-grid">
          {notes.length === 0 ? (
            // Show empty state if there are no notes
            <div className="empty-state">
              <h2>No Notes Yet</h2>
              <p>Create your first note above.</p>
            </div>
          ) : (
            // Map through the notes array and render a card for each note
            notes.map((note) => (
              <div className="note-card" key={note.id}>
                <h3>{note.title}</h3>

                <p>{note.content}</p>

                <small>{note.createdAt}</small>

                {/* Actions: Edit and Delete buttons */}
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => editNote(note)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;