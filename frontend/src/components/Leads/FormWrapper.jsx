// REACT-FORM-BUILDER/frontend/src/components/Leads/FormWrapper.jsx
import React from 'react';
import styles from './FormWrapper.module.css';

const FormWrapper = ({ title, children }) => {
	return (
		<div className={styles.wrapper}>
			<h2 className={styles.title}>{title}</h2>
			<div className={styles.content}>{children}</div>
		</div>
	);
};

export { FormWrapper };
