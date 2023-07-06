// REACT-FORM-BUILDER/frontend/src/pages/PublicForm.tsx
import { useEffect, useState } from 'react';
import {
	Paper,
	Typography,
	Card,
	Checkbox,
	TextField,
	Toolbar,
	List,
	MenuItem,
	ListItem,
	ListItemText,
	Button,
	Select,
	AppBar,
	SelectChangeEvent,
} from '@mui/material';
import { AdbRounded } from '@mui/icons-material';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default function PublicForm() {
	const [form, setForm] = useState<any>({});
	const [response, setResponse] = useState<any>([]);
	const [name, setName] = useState<string>('');
	const [checked, setChecked] = useState<any>(true); //eslint-disable-line
	const id = window.location.href.substring(
		window.location.href.lastIndexOf('/') + 1
	);
	useEffect(() => {
		axios({
			method: 'post',
			url: process.env.REACT_APP_API + 'getFormById/',
			data: {
				id: id,
			},
		})
			.then((res) => {
				setForm(res.data.data[0]);
				console.log(res.data.data[0]);
				let arr: Array<any> = [];
				for (let i = 0; i < res.data.data[0].fields.length; i++) {
					if (res.data.data[0].fields[i].type === 'chk') {
						arr.push([]);
						for (
							let j = 0;
							j < res.data.data[0].fields[i].options.length;
							j++
						) {
							arr[i].push(false);
						}
					} else {
						arr.push('');
					}
				}
				setResponse(arr);
				console.log(arr);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []); // eslint-disable-line
	useEffect(() => {
		// console.log(response);
	}, [response]);
	function validate() {
		let valid = true;
		if (name === '') {
			valid = false;
			return valid;
		}
		for (let i = 0; i < form.fields.length; i++) {
			if (form.fields[i].required === true) {
				if (form.fields[i].type === 'chk') {
					let count = 0;
					for (let j = 0; j < form.fields[i].options.length; j++) {
						if (response[i][j] === true) {
							count++;
						}
					}
					if (count === 0) {
						valid = false;
						return valid;
					}
				} else {
					if (response[i] === '') {
						valid = false;
						return valid;
					}
				}
			}
		}
		return true;
	}
	function submitForm() {
		axios({
			method: 'post',
			url: process.env.REACT_APP_API + 'submitForm/',
			data: {
				id: id,
				name: name,
				submission: response,
			},
		})
			.then((res) => {
				console.log(res);
				alert('Form submitted successfully');
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
				alert(err);
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
					maxWidth: '800px',
					width: '95%',
					minHeight: '95vh',
				}}
			>
				<AppBar position="relative" color="transparent">
					<Toolbar>
						<Link
							to="/"
							style={{
								textDecoration: 'none',
								margin: 'auto',
							}}
						>
							<AdbRounded htmlColor="#487346"></AdbRounded>
						</Link>
					</Toolbar>
				</AppBar>
				<Card
					sx={{
						margin: '10px',
						padding: '10px',
					}}
				>
					<Typography variant="h4" component={'h4'} align="left">
						{form.title}
					</Typography>
					<Typography variant="h5" component={'h5'} align="left">
						{form.description}
					</Typography>
				</Card>
				<Card
					sx={{
						margin: '10px',
						padding: '10px',
					}}
				>
					<Typography variant="body1" component={'p'} align="left">
						<>
							{' '}
							Name <span style={{ color: 'red' }}>*</span>
						</>
					</Typography>
					<TextField
						required
						sx={{ float: 'left' }}
						fullWidth
						size="small"
						onChange={(e) => {
							setName(e.target.value);
						}}
						variant="filled"
					></TextField>
				</Card>
				{form?.fields?.map((field: any, i: number) => {
					return (
						<Card
							sx={{
								margin: '10px',
								padding: '10px',
							}}
						>
							<Typography variant="body1" component={'p'} align="left">
								{field.label}{' '}
								{field.required ? (
									<span style={{ color: 'red' }}>*</span>
								) : (
									<></>
								)}
							</Typography>
							{field.type === 'chk' ? (
								<List>
									{field.options.map((option: string, j: number) => {
										return (
											<ListItem>
												<Checkbox
													size="small"
													sx={{ padding: '0px' }}
													edge="start"
													onChange={() => {
														setChecked(!response[i][j]);
														response[i][j] = !response[i][j];
													}}
													checked={response[i][j]}
												/>
												&nbsp;
												<ListItemText primary={option}>{option}</ListItemText>
											</ListItem>
										);
									})}
								</List>
							) : (
								<Select
									fullWidth
									size="small"
									value={response[i]}
									onChange={(e: SelectChangeEvent) => {
										setChecked(false);
										response[i] = e.target.value;
									}}
								>
									{field.options.map((option: any, j: number) => {
										return <MenuItem value={option}>{option}</MenuItem>;
									})}
								</Select>
							)}
						</Card>
					);
				})}
				<Button
					variant="contained"
					sx={{ float: 'left', left: '15px' }}
					onClick={() => {
						console.log(response);
						if (validate()) {
							submitForm();
						} else {
							alert('Please Fill all the required fields');
						}
					}}
				>
					SUBMIT
				</Button>
			</Paper>
		</Paper>
	);
}
