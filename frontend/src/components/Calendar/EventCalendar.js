// Component to track events
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import styles from './EventCalendar.module.css';
import axios from 'axios';
import ClientProfile from '../Leads/ClientProfile';

const EventCalendar = () => {
	const [value, onChange] = useState(new Date());
	const [events, setEvents] = useState([]);
	const [selectedClient, setSelectedClient] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get('http://localhost:5000/api/forms');
				setEvents(response.data);
			} catch (error) {
				console.error('Error fetching events data:', error);
			}
		};

		fetchEvents();
	}, []);

	const getEventDate = (date) => {
		return new Date(date).toDateString();
	};

	const getEventsForDate = (date) => {
		const eventDate = getEventDate(date);
		return events.filter(
			(event) => getEventDate(event.eventDate) === eventDate
		);
	};

	const onEventClick = (event) => {
		setSelectedClient(event.clientName);
		setShowModal(true);
	};

	const closeClientProfile = () => {
		setSelectedClient(null);
		setShowModal(false);
	};

	const tileContent = ({ date, view }) => {
		if (view !== 'month') return null;

		const eventsForDate = getEventsForDate(date);
		if (eventsForDate.length === 0) return null;

		return (
			<div className={styles.tileContent}>
				{eventsForDate.map((event) => (
					<button
						key={event.clientName}
						className={styles.eventButtonlong}
						onClick={() => onEventClick(event)}
					>
						{event.clientName}
					</button>
				))}
			</div>
		);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.container}>
				<h2>Event Calendar</h2>
				<Calendar onChange={onChange} value={value} tileContent={tileContent} />
			</div>
			{showModal && (
				<div className={styles.modal}>
					<div className={styles.modalContent}>
						<ClientProfile
							clientName={selectedClient}
							onClose={closeClientProfile}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default EventCalendar;
