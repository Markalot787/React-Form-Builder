// REACT-FORM-BUILDER/frontend/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Card, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import FormList from './FormList';
import ResponsiveAppBar from '../components/Appbar';
import { DeleteOutline } from '@mui/icons-material';
import { getUser, getFormById, getFormTitlesByIds } from '../api';

export default function Dashboard(props: {
	setAuthenticated: any;
	authenticated: any;
	setEmail: any;
	setPassword: any;
	email: any;
	password: any;
}) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		console.log('Dashboard');
		console.log('Form Data:', data);
		if (props.authenticated) {
			getUser(props.email)
				.then((user) => {
					console.log(user.forms);
					const formIds = user.forms.map((form: any) => form.id); // Specify the type for 'form'
					// Make a GET request to retrieve the user's forms
					getFormById(formIds.map((form: any) => form.id))
						.then((forms) => {
							console.log(forms);
							// Process the retrieved forms
							const formTitles = forms.data.map((form: any) => ({
								id: form._id,
								title: form.title,
							}));
							setData(formTitles);
						})
						.catch((error) => {
							console.log(error);
							// Handle the error
						});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [props.authenticated, props.email, props.password, data]); // Include 'data' in the dependency array

	function wipeUser() {
		localStorage.removeItem('formit.sessionInfo');
		window.location.reload();
	}

	function deleteForm(id: string, name: string) {
		axios
			.post(`${process.env.REACT_APP_API}deleteForm/`, {
				id,
				email: props.email,
				password: props.password,
				name,
			})
			.then((res) => {
				console.log(res.data);
				if (res.data.success) {
					alert('Form deleted successfully');
					window.location.reload();
				} else {
					alert('Error deleting form');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	return (
		<Paper
			style={{
				width: '100%',
				minHeight: '100vh',
				backgroundColor: '#487346',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				alignContent: 'center',
			}}
		>
			<Paper
				style={{
					margin: '15px auto',
					width: '95%',
					minHeight: '95vh',
				}}
			>
				<ResponsiveAppBar wipeUser={wipeUser} />
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						flexWrap: 'wrap',
						margin: 'auto',
					}}
				>
					{data.length > 0 ? (
						data.map((form: any) => (
							<span
								key={form.id} // Change 'form._id' to 'form.id'
								style={{
									display: 'flex',
									justifyContent: 'center',
									margin: '50px',
									flexDirection: 'column',
								}}
							>
								<Link
									to={`/dashboard/viewform/${form.id}`} // Change 'form._id' to 'form.id'
									style={{
										textDecoration: 'none',
									}}
								>
									<Card
										style={{
											width: '150px',
											height: '150px',
											display: 'flex',
											flexDirection: 'column',
											justifyContent: 'center',
											alignItems: 'center',
											alignContent: 'center',
											backgroundColor: '#2DB604',
											backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1600 800'%3E%3Cg stroke='%235AFF24' stroke-width='70.5' stroke-opacity='0.06' %3E%3Ccircle fill='%232DB604' cx='0' cy='0' r='1800'/%3E%3Ccircle fill='%232cac06' cx='0' cy='0' r='1700'/%3E%3Ccircle fill='%232ba307' cx='0' cy='0' r='1600'/%3E%3Ccircle fill='%232a9a08' cx='0' cy='0' r='1500'/%3E%3Ccircle fill='%23299009' cx='0' cy='0' r='1400'/%3E%3Ccircle fill='%2328870a' cx='0' cy='0' r='1300'/%3E%3Ccircle fill='%23267e0a' cx='0' cy='0' r='1200'/%3E%3Ccircle fill='%2325750b' cx='0' cy='0' r='1100'/%3E%3Ccircle fill='%23236d0b' cx='0' cy='0' r='1000'/%3E%3Ccircle fill='%2321640b' cx='0' cy='0' r='900'/%3E%3Ccircle fill='%231f5b0b' cx='0' cy='0' r='800'/%3E%3Ccircle fill='%231d530a' cx='0' cy='0' r='700'/%3E%3Ccircle fill='%231b4b0a' cx='0' cy='0' r='600'/%3E%3Ccircle fill='%23194309' cx='0' cy='0' r='500'/%3E%3Ccircle fill='%23173b08' cx='0' cy='0' r='400'/%3E%3Ccircle fill='%23153307' cx='0' cy='0' r='300'/%3E%3Ccircle fill='%23132b04' cx='0' cy='0' r='200'/%3E%3Ccircle fill='%23112401' cx='0' cy='0' r='100'/%3E%3C/g%3E%3C/svg%3E")`,

											backgroundAttachment: 'fixed',
											backgroundSize: 'cover',
											color: 'white',
										}}
									>
										<h3>{form.title}</h3>
									</Card>
								</Link>
								<Button
									style={{
										backgroundColor: 'purple',
										width: '100%',
										padding: '0',
										margin: '0',
									}}
									onClick={() => {
										deleteForm(form.id, form.title);
									}}
								>
									<DeleteOutline htmlColor="#fff" />
								</Button>
							</span>
						))
					) : (
						<h1>No Forms</h1>
					)}
				</div>
			</Paper>
		</Paper>
	);
}
