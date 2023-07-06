// REACT-FORM-BUILDER/frontend/src/components/Leads/LeadCaptureForm.tsx
import React, { useState } from 'react';
import { FormWrapper } from './FormWrapper';
import SuccessScreen from './SuccessScreen';
import axios from 'axios';

interface ContactData {
	leadName: string;
	leadPhoneNumber: string;
	leadEmail: string;
}

const LeadCaptureForm = () => {
	const [contactData, setContactData] = useState<ContactData>({
		leadName: '',
		leadPhoneNumber: '',
		leadEmail: '',
	});

	const [showSuccessScreen, setShowSuccessScreen] = useState(false);

	const updateContactFields = (updatedFields: Partial<ContactData>) => {
		setContactData({ ...contactData, ...updatedFields });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await axios.post('http://localhost:8000/api/leads', contactData);
		} catch (error) {
			console.error('Error submitting form data:', error);
		}

		// Show the success screen
		setShowSuccessScreen(true);
	};

	const { leadName, leadPhoneNumber, leadEmail } = contactData;

	return (
		<>
			{showSuccessScreen ? (
				<SuccessScreen formData={contactData} />
			) : (
				<form onSubmit={handleSubmit}>
					<FormWrapper title="Contact Details">
						<label>Nombre/Compañía</label>
						<input
							autoFocus
							required
							type="text"
							value={leadName}
							onChange={(e) =>
								updateContactFields({ leadName: e.target.value })
							}
						/>
						<label>Telefono</label>
						<input
							required
							min={1}
							type="number"
							value={leadPhoneNumber}
							onChange={(e) =>
								updateContactFields({ leadPhoneNumber: e.target.value })
							}
						/>
						<label>Email</label>
						<input
							min={1}
							type="email"
							value={leadEmail}
							onChange={(e) =>
								updateContactFields({ leadEmail: e.target.value })
							}
						/>
					</FormWrapper>
					<button type="submit">Submit</button>
				</form>
			)}
		</>
	);
};

export default LeadCaptureForm;
