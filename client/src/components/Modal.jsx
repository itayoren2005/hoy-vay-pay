import React from "react";
import "../styles/Modal.css";

export const Modal = ({ isOpen, onClose, topRight, children }) => {
  if (!isOpen) return;

  return (
    <div
      className={topRight ? "top-right-model-overlay" : "modal-overlay"}
      onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">
          X
        </button>
        {children}
      </div>
    </div>
  );
};
