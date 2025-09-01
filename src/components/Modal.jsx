import { motion } from "framer-motion";
import { useRef } from "react";

function Modal({ title, description, content = null, setModal = null, welcome = false, setName = null, setNewUser = null }) {
  const nameRef = useRef();

  function handleSetup() {
    if (nameRef.current.value.trim().length > 0) {
      setName(nameRef.current.value.trim());
      setNewUser(false);
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
        <p className="modal-description">{description}</p>
        {!welcome && (
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
      </motion.div>
      {welcome && <div className="welcome-warning">← Click allow so Lightning can access weather data!</div>}
    </div>
  );
}

export default Modal;
