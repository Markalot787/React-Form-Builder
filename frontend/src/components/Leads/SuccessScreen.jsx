// REACT-FORM-BUILDER/frontend/src/components/Leads/SuccessScreen.jsx
import React from 'react';

interface SuccessScreenProps {
	formData: any;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ formData }) => {
	return (
		<div>
			<h2>Thank you for your submission!</h2>
			<p>
				Your entry was successful. We'll contact you shortly at{' '}
				<strong>{formData.leadEmail}</strong>.
			</p>
		</div>
	);
};

export default SuccessScreen;
