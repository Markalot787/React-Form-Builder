import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import LeadProfile from './LeadProfile';
import ResponsiveAppBar from '../Appbar';
import Modal from './Modal';
import { API_URL } from '../../api.js';

interface Lead {
	id?: string;
	leadName?: string;
	leadEmail?: string;
	leadPhoneNumber?: string;
}

type LeadDashboardProps = {
	setAuthenticated: Dispatch<SetStateAction<boolean | undefined>>;
};

const LeadDashboard = ({ setAuthenticated }: LeadDashboardProps) => {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [showModal, setShowModal] = useState(false);

	const email = 'example@example.com';

	useEffect(() => {
		const fetchLeads = async () => {
			try {
				const response = await axios.get(`${API_URL}api/leads`);
				console.log('Response data:', response.data);
				const formattedLeads = response.data.map((lead: any) => ({
					id: lead.id,
					leadName: lead.leadName,
					leadEmail: lead.leadEmail,
					leadPhoneNumber: lead.leadPhoneNumber,
				}));

				setLeads(formattedLeads);
			} catch (error) {
				console.error('Error fetching lead data:', error);
			}
		};

		fetchLeads();
	}, []);

	const handleLeadClick = (lead: Lead) => {
		console.log('Selected lead:', lead);
		setSelectedLead({ ...lead });
		setShowModal(true);
	};

	const closeLeadProfile = () => {
		setSelectedLead(null);
		setShowModal(false);
	};

	const handleLinkCopy = () => {
		const link =
			window.location.origin + '/React-Form-Builder#/lead-capture-form';
		navigator.clipboard.writeText(link).then(
			() => {
				alert('Link copied to clipboard');
			},
			(err) => {
				console.error('Could not copy link: ', err);
			}
		);
	};

	const wipeUser = () => {
		setAuthenticated(undefined);
	};

	return (
		<div>
			<ResponsiveAppBar wipeUser={wipeUser} />
			<h2>Lead Dashboard</h2>
			<button onClick={handleLinkCopy}>Copy Link to Lead Capture Form</button>
			<ul>
				{leads.map((lead) => (
					<li key={lead.id}>
						<button onClick={() => handleLeadClick(lead)}>
							{lead.leadName}
						</button>
					</li>
				))}
			</ul>
			{showModal && selectedLead && (
				<Modal showModal={showModal} closeModal={closeLeadProfile}>
					<LeadProfile
						lead={selectedLead}
						email={email}
						onClose={closeLeadProfile}
					/>
				</Modal>
			)}
		</div>
	);
};

export default LeadDashboard;
