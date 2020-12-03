import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoIosClose } from "react-icons/io";
import "./Modal.styles.scss";

const modalRoot = document.getElementById("modal");

function Modal({ isOpen, children, title, onClose }) {
    const el = document.createElement("div");

    useEffect(() => {
        modalRoot.appendChild(el);

        return () => {
            modalRoot.removeChild(el);
        };
    }, [el]);

    if (!isOpen) return null;

    const ModalWrapper = (
        <div className="Modal">
            <div className="Modal__wrapper">
                <div className="Modal__header">
                    <div className="Modal__header-title">{title}</div>
                    <div className="Modal__header-actions">
                        <div className="Modal__header-action" onClick={onClose}>
                            <IoIosClose className="Modal__close" />
                        </div>
                    </div>
                </div>
                <div className="Modal__content">{children}</div>
            </div>
        </div>
    );

    return isOpen && createPortal(ModalWrapper, el);
}

export default Modal;
