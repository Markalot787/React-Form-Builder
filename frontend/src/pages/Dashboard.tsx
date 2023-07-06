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
