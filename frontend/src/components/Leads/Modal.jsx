// Modal.jsx
import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ showModal, closeModal, children }) => {
	if (!showModal) {
		return null;
	}

	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modal}>
				<button onClick={closeModal} className={styles.closeButton}>
					Close
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
