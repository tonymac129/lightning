import { motion } from "framer-motion";

function Modal({ title, description, content, setModal }) {
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
      </motion.div>
    </div>
  );
}

export default Modal;
