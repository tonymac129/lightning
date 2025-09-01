import { useEffect, useRef, useState } from "react";

function Note({ newNote, setNewNote }) {
  const noteRef = useRef();
  const [showNote, setShowNote] = useState(newNote.length > 0);

  useEffect(() => {
    if (newNote.length > 0) setShowNote(true);
  }, [newNote]);

  function handleNoteBlur() {
    if (newNote.trim().length == 0) setShowNote(false);
  }

  return (
    <div className="widget note-widget">
      {showNote ? (
        <textarea
          className="note"
          ref={noteRef}
          value={newNote}
          onInput={(e) => setNewNote(e.target.value)}
          onBlur={handleNoteBlur}
        ></textarea>
      ) : (
        <div
          className="message"
          onClick={() => {
            setShowNote(true);
            setTimeout(() => {
              noteRef.current.focus();
            }, 100);
          }}
        >
          There isn't a note
        </div>
      )}
    </div>
  );
}

export default Note;
