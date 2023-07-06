import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../api';
import { Link } from 'react-router-dom';

type FormType = {
	_id: string;
	title: string;
	createdAt: Date;
	description: string;
	fields: Array<any>;
	submissions: Array<any>;
};

const FormList = ({ userEmail }: { userEmail: string }) => {
	const [forms, setForms] = useState<FormType[]>([]);

	useEffect(() => {
		axios
			.get(`${API_URL}/user`, {
				params: { email: userEmail },
			})

			.then((userResponse) => {
				console.log('User Response:', userResponse.data);

				// Retrieve the form ids from the user
				const formIds = userResponse.data.forms;

				console.log('Form IDs:', formIds);

				// Fetch each form data
				const formPromises = formIds.map((formId: string) =>
					axios.get(`${API_URL}/getFormById`, {
						params: { id: formId },
					})
				);

				console.log('Form Promises:', formPromises);

				// Wait for all promises to resolve
				Promise.all([...formPromises])
					.then((responses) => {
						console.log('Responses:', responses);

						// Extract form data responses
						const formResponses = responses.slice(0, formIds.length);
						const formTitles = responses[formIds.length];

						console.log('Form Responses:', formResponses);
						console.log('Form Titles:', formTitles);

						// Map form data and titles
						const allForms = formResponses.map((formRes) => ({
							...formRes.data,
							title: formRes.data.title,
							key: formRes.data._id,
						}));

						console.log('All Forms:', allForms);

						setForms(allForms);
					})
					.catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	}, []);

	return (
		<div>
			<h1>User's Forms</h1>
			{forms.map((form) => (
				<li key={form._id}>
					<Link to={`/form/${form._id}`}>{form.title}</Link>
				</li>
			))}
		</div>
	);
};

export default FormList;
