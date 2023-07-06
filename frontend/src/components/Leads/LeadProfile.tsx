// REACT-FORM-BUILDER/frontend/src/components/Leads/LeadProfile.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './LeadProfile.module.css';

import { FormControl, Select, MenuItem, Button } from '@mui/material';
import { Send } from '@mui/icons-material';

interface Lead {
	id?: string;
	leadName?: string;
	leadEmail?: string;
	leadPhoneNumber?: string;
}

interface LeadProfileProps {
	lead: Lead | null;
	email: string;
	onClose: () => void;
}

const API_URL = process.env.REACT_APP_API || '';

const LeadProfile = ({ lead, email, onClose }: LeadProfileProps) => {
	const [leadData, setLeadData] = useState<Lead | null>({ ...lead });
	const [editedData, setEditedData] = useState<Lead | null>({ ...lead });
	const [editing, setEditing] = useState(false);
	const [selectedFormId, setSelectedFormId] = useState<string>('');
	const [forms, setForms] = useState<any[]>([]);

	useEffect(() => {
		const fetchForms = async () => {
			try {
				const response = await axios.post(`${API_URL}getUser/`, {
					email: email,
				});
				if (response.data.success) {
					setForms(response.data.data.forms);
				} else {
					console.error('Error fetching forms:', response.data.msg);
				}
			} catch (error) {
				console.error('Error fetching forms:', error);
			}
		};

		fetchForms();
	}, [email]);

	const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (editedData && name in editedData) {
			setEditedData((prevData) => ({
				...prevData,
				[name]: value ?? '',
			}));
		}
	};

	const handleSendForm = async () => {
		try {
			await axios.post(`/api/sendForm/${selectedFormId}`, {
				leadEmail: leadData?.leadEmail,
			});
			console.log('Form link sent successfully');
		} catch (error) {
			console.error('Error sending form link:', error);
		}
	};

	const handleSave = async () => {
		console.log('handleSave called');
		console.log('editedData:', editedData);
		console.log('editedData.id:', editedData?.id);
		try {
			if (editedData && editedData.id !== undefined && editedData.id !== '') {
				const updatedLeadData = {
					...editedData,
					id: leadData?.id,
				};
				await axios.put(`/api/leads/${updatedLeadData.id}`, updatedLeadData);
				setLeadData(updatedLeadData);
				setEditing(false);
			} else {
				console.log('editedData or editedData.id is null or undefined');
			}
		} catch (error) {
			console.error('Error updating lead data:', error);
		}
	};

	const handleDelete = async () => {
		try {
			await axios.delete(`/api/leads/${lead?.id}`);
			onClose();
		} catch (error) {
			console.error('Error deleting lead data:', error);
		}
	};

	return (
		<div>
			<h2>Lead Name: {leadData?.leadName}</h2>
			<h2>Lead Email: {leadData?.leadEmail}</h2>
			<h2>Lead Phone Number: {leadData?.leadPhoneNumber}</h2>

			<FormControl>
				<div>
					<label>Select Form:</label>
					<Select
						value={selectedFormId}
						onChange={(event) =>
							setSelectedFormId(event.target.value as string)
						}
					>
						{forms.map((form) => (
							<MenuItem key={form.id} value={form.id}>
								{form.title}
							</MenuItem>
						))}
					</Select>
				</div>
			</FormControl>

			<Button
				variant="contained"
				color="primary"
				startIcon={<Send />}
				onClick={handleSendForm}
				disabled={!selectedFormId}
			>
				Send Form
			</Button>

			{editing ? (
				<div>
					<div>
						<label>Name:</label>
						<input
							type="text"
							name="leadName"
							value={editedData?.leadName || ''}
							onChange={handleEditChange}
						/>
					</div>
					<div>
						<label>Email:</label>
						<input
							type="text"
							name="leadEmail"
							value={editedData?.leadEmail || ''}
							onChange={handleEditChange}
						/>
					</div>
					<div>
						<label>Phone Number:</label>
						<input
							type="text"
							name="leadPhoneNumber"
							value={editedData?.leadPhoneNumber || ''}
							onChange={handleEditChange}
						/>
					</div>
					<button
						className={`${styles.saveButton} ${styles.deleteButton}`}
						onClick={handleSave}
						disabled={!editing}
					>
						Save
					</button>
				</div>
			) : (
				<div>
					<button onClick={() => setEditing(true)}>Edit</button>
					<button onClick={handleDelete}>Delete</button>
				</div>
			)}
		</div>
	);
};

export default LeadProfile;
