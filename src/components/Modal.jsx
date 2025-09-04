import { motion } from "framer-motion";
import { useRef, useState } from "react";

function Modal({
  title,
  description = null,
  content = null,
  setModal = null,
  welcome = false,
  setName = null,
  setNewUser = null,
  shortcuts = null,
  setShortcuts = null,
  editInfo = null,
}) {
  const [editName, setEditName] = useState(editInfo !== null ? shortcuts[editInfo].name : "");
  const [editUrl, setEditUrl] = useState(editInfo !== null ? shortcuts[editInfo].url : "");
  const nameRef = useRef();
  const shortcutNameRef = useRef();
  const shortcutURLRef = useRef();

  function handleSetup() {
    if (nameRef.current.value.trim().length > 0) {
      setName(nameRef.current.value.trim());
      setNewUser(false);
    }
  }

  function handleShortcut() {
    let name = shortcutNameRef.current.value.trim();
    let url = shortcutURLRef.current.value.trim();
    url = url.includes("https://") || url.includes("http://") ? url : "https://" + url;
    if (name.length > 0 && url.length > 0) {
      setShortcuts([...shortcuts, { name: name, url: url }]);
      setModal(false);
    }
  }

  function handleEdit() {
    let name = editName.trim();
    let url = editUrl.trim();
    url = url.includes("https://") || url.includes("http://") ? url : "https://" + url;
    if (name.length > 0 && url.length > 0) {
      setShortcuts([...shortcuts.slice(0, editInfo), { name: name, url: url }, ...shortcuts.slice(editInfo + 1)]);
      setModal(false);
    }
  }

  return (
    <div
      className="modal-bg"
      onClick={(e) => {
        if (e.target.className == "modal-bg") setModal(false);
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="modal"
      >
        <h2 className="modal-title">{title}</h2>
        {description && <p className="modal-description">{description}</p>}
        {!welcome && !shortcuts && (
          <>
            <ul className="modal-list">
              {content.map((item) => {
                return (
                  <li className="modal-item">
                    {item.c && (
                      <>
                        <code>{item.c}</code>:{" "}
                      </>
                    )}
                    {item.a}
                  </li>
                );
              })}
            </ul>
            <img src="/lightning/icons/close.svg" onClick={() => setModal(false)} className="modal-close" />
          </>
        )}
        {welcome && (
          <div className="welcome">
            <input placeholder="What's your name?" autoComplete="off" ref={nameRef} className="welcome-input" />
            <button className="welcome-btn" onClick={handleSetup}>
              Let's go!
            </button>
          </div>
        )}
        {setShortcuts && (
          <div className="welcome">
            <input
              placeholder="Shortcut name"
              autoComplete="off"
              ref={shortcutNameRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="welcome-input"
            />
            <input
              placeholder="Shortcut URL"
              autoComplete="off"
              ref={shortcutURLRef}
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="welcome-input"
            />
            <button className="welcome-btn" onClick={editInfo !== null ? handleEdit : handleShortcut}>
              {editInfo ? "Edit" : "Add"} shortcut
            </button>
          </div>
        )}
      </motion.div>
      {welcome && <div className="welcome-warning">← Click allow so Lightning can access weather data!</div>}
    </div>
  );
}

export default Modal;
