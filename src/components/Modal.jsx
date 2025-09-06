import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  name = null,
  theme = null,
  setTheme = null,
  bg = null,
  setBg = null,
}) {
  const [editName, setEditName] = useState(editInfo !== null ? shortcuts[editInfo].name : "");
  const [editUrl, setEditUrl] = useState(editInfo !== null ? shortcuts[editInfo].url : "");
  const [editUser, setEditUser] = useState(name ? name : "");
  const [bgName, setBgName] = useState(localStorage.getItem("lightning-bgname") ? localStorage.getItem("lightning-bgname") : "");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef();
  const shortcutNameRef = useRef();
  const shortcutURLRef = useRef();
  const themeRef = useRef();
  const bgRef = useRef();

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

  function handleSave() {
    let bg = bgRef.current.files[0];
    if (bg) {
      localStorage.setItem("lightning-bgname", bg.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBg(e.target.result);
      };
      reader.readAsDataURL(bg);
    }
    setName(editUser);
    setTheme(themeRef.current.value);
    setModal(false);
  }

  function handleClear() {
    if (confirm("Are you sure you want to clear all data on Lightning? This action cannot be undone.")) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("lightning-")) {
          localStorage.removeItem(key);
          window.location.reload();
        }
      });
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
        {!welcome && !shortcuts && content && (
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
        {name && (
          <div className="settings">
            <div className="setting-item">
              <label className="setting-label">Name</label>
              <input
                placeholder="Your name"
                autoComplete="off"
                value={editUser}
                onChange={(e) => setEditUser(e.target.value)}
                className="welcome-input"
              />
            </div>
            <div className="setting-item">
              <label className="setting-label">Theme</label>
              <select className="setting-dropdown" value={theme} onChange={(e) => setTheme(e.target.value)} ref={themeRef}>
                <option value="blue">Lightning</option>
                <option value="yellow">Sunrise</option>
                <option value="green">Forest</option>
                <option value="dark">Ocean</option>
                <option value="red">Lava</option>
                <option value="purple">Midnight</option>
              </select>
            </div>
            <div className="setting-item">
              <label className="setting-label">Background</label>
              <input id="bg-input" type="file" ref={bgRef} className="setting-file" />
              {loading && <div className="message">Please wait about 5 seconds for the file to upload!</div>}
              <label htmlFor="bg-input" className="file-btn" onClick={()=>setLoading(true)}>
                {bgRef.current?.files[0] ? bgRef.current.files[0].name.slice(0, 30) : bgName ? bgName : "Choose File"}
              </label>
            </div>
            <div className="setting-item warning" onClick={handleClear}>
              Clear data
            </div>
            <button className="welcome-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </motion.div>
      {welcome && <div className="welcome-warning">← Click allow so Lightning can access weather data!</div>}
    </div>
  );
}

export default Modal;
