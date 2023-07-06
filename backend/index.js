// REACT-FORM-BUILDER/backend/index.js
const express = require('express');
require('dotenv').config();
require('./db/dbconfig');
const User = require('./models/user');
const Form = require('./models/form');
const Lead = require('./models/lead');
var cors = require('cors');
const bcrypt = require('bcrypt');
ObjectId = require('mongodb').ObjectID;
const saltRounds = 10;
const gmailSend = require('gmail-send');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.get('/', (req, res) => {
	res.send('formIt Backend');
});
app.post('/auth/', async (req, res) => {
	//authenticate user
	var response = await authenticate(req.body);
	res.send({ response: response });
});
app.post('/addUser/', async (req, res) => {
	//add user
	var response = await findUser(req.body.email);
	console.log(response);
	if (response === true) {
		res.send({
			success: false,
			msg: 'User Exists',
		});
	} else {
		const newUser = new User({
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, saltRounds),
			name: req.body.name,
		});
		newUser.save((err) => {
			if (err) {
				res.send({
					success: false,
					msg: 'Failed to Save',
				});
				console.log(err);
			} else {
				res.send({
					success: true,
					msg: 'User Created',
				});
			}
		});
	}
});
app.post('/createForm/', async (req, res) => {
	let valid = await authenticate(req.body);
	if (valid === true) {
		try {
			console.log('Request Body:', req.body);

			const form = new Form({
				title: req.body.formData.title,
				description: req.body.formData.description,
				fields: req.body.formData.fields,
				createdBy: req.body.email,
				createdAt: new Date(),
				updatedAt: new Date(),
				submissions: [],
			});

			console.log('New Form:', form);

			const savedForm = await form.save();

			console.log('Saved Form:', savedForm);

			const user = await User.findOneAndUpdate(
				{ email: req.body.email },
				{ $push: { forms: savedForm._id } },
				{ new: true }
			);

			console.log('Updated User:', user);

			res.send({
				success: true,
				msg: 'Form Created',
			});
		} catch (err) {
			console.log(err);
			res.send({
				success: false,
				msg: 'Failed to Create Form',
			});
		}
	} else {
		res.send({
			success: false,
			msg: 'Invalid Credentials',
		});
	}
});

/////////////////////index.js server apis

app.get('/user', async (req, res) => {
	const { email } = req.query;
	try {
		const user = await User.findOne({ email }).populate('forms');
		res.send(user);
		console.log(user.forms); // This should now contain the actual forms with titles

		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/form/:formId', async (req, res) => {
	try {
		const form = await Form.findById(req.params.formId);
		res.status(200).json(form);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/getFormTitlesByIds', async (req, res) => {
	const { ids } = req.query;
	try {
		const formTitles = await Form.find({ _id: { $in: ids } }, 'title');
		res.status(200).json(formTitles);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.get('/getFormById/', async (req, res) => {
	// Get form by IDs
	const formIds = req.body.ids; // Assuming the form IDs are provided as an array in the request body with the key 'ids'

	try {
		const forms = await Form.find({ _id: { $in: formIds } });

		if (forms.length === 0) {
			res.send({
				success: false,
				data: forms,
			});
		} else {
			res.send({
				success: true,
				data: forms,
			});
		}
	} catch (error) {
		console.log(error);
		res.send({
			success: false,
			data: [],
		});
	}
});

app.post('/submitForm/', async (req, res) => {
	//submit form

	try {
		let response = await submitForm(req.body);
		res.send({
			msg: response,
		});
	} catch (err) {
		res.send({
			msg: err,
		});
	}
});

app.get('/getUser/:email', async (req, res, next) => {
	try {
		const user = await User.findOne({ email: req.params.email }).populate(
			'forms'
		);
		if (!user) {
			return res.status(404).send({ message: 'User not found' });
		}
		return res.status(200).send(user);
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: 'Failed to fetch user' });
	}
});

app.post('/deleteResponse/', async (req, res) => {
	//delete response
	var response = await deleteResponse(req.body);
	console.log(req.body);
	res.send({
		msg: response,
	});
});
// Add lead data
app.post('/api/leads', async (req, res) => {
	try {
		const lead = new Lead(req.body);
		const savedLead = await lead.save();
		res.status(201).json(savedLead);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//lead data
// Get all unique leads
app.get('/api/leads', async (req, res) => {
	try {
		const leads = await Lead.find();
		res.status(200).json(leads);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get lead data by ID
app.get('/api/leads/:id', async (req, res) => {
	try {
		const leadData = await Lead.findById(req.params.id);
		res.status(200).json(leadData);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update lead data by ID
app.put('/api/leads/:id', async (req, res) => {
	try {
		const updatedLeadData = await Lead.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.status(200).json(updatedLeadData);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete lead data by ID
app.delete('/api/leads/:id', async (req, res) => {
	try {
		await Lead.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'lead data deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// email form to lead api
app.post('/api/sendForm/:formId', async (req, res) => {
	try {
		const formId = req.params.formId;
		const leadEmail = req.body.leadEmail;

		// Get the form data by formId
		const form = await Form.findById(formId);
		if (!form) {
			return res.status(404).json({ error: 'Form not found' });
		}

		// Create the form link
		const formLink = `${process.env.FRONTEND_URL}/form/${formId}`;

		// Compose the email message
		const emailSubject = 'Form Link';
		const emailText = `Please fill out the form using the following link: ${formLink}`;

		// Configure gmail-send options
		const sendOptions = {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASSWORD,
			to: leadEmail,
			subject: emailSubject,
			text: emailText,
		};

		// Get all forms
		app.get('/api/forms', async (req, res) => {
			try {
				const forms = await Form.find();
				res.status(200).json(forms);
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
		});

		// Send the email
		gmailSend(sendOptions, (error, result) => {
			if (error) {
				console.error('Error sending email:', error);
				res.status(500).json({ error: 'Failed to send form link' });
			} else {
				console.log('Email sent successfully:', result);
				res.status(200).json({ message: 'Form link sent successfully' });
			}
		});
	} catch (error) {
		console.error('Error sending form link:', error);
		res.status(500).json({ error: 'Failed to send form link' });
	}
});

app.listen(process.env.PORT || 8000, async () => {
	console.log(`Listening on PORT ${process.env.PORT || 8000}`);
});
app.post('/deleteForm/', async (req, res) => {
	let valid = await authenticate(req.body);
	if (valid === true) {
		let response = (await deleteForm(req.body)) && (await unlink(req.body));

		console.log(response, req.body.id);
		if (response !== '') {
			res.send({
				success: true,
				msg: 'Form Deleted',
			});
		} else {
			res.send({
				success: false,
				msg: 'Failed to Delete',
			});
		}
	} else {
		res.send({
			success: false,
			msg: 'Invalid Credentials',
		});
	}
});
//functions
async function deleteForm(obj) {
	console.log(obj);
	let data = await Form.find({
		_id: obj.id,
	});
	if (data.length === 0) return 'Form Not Found';
	else {
		let resp = await Form.find({
			_id: obj.id,
		}).deleteOne();
		console.log(resp);
		return resp ? 'Form Deleted' : '';
	}
}
async function unlink(obj) {
	let data = await User.find({
		email: obj.email,
	}).updateOne({
		$pull: {
			forms: { id: obj.id, name: obj.name },
		},
	});
	console.log('data:', data);
	return data;
}
async function deleteResponse(obj) {
	try {
		let response = await Form.findOne({ _id: obj.id });
		console.log(response);
		response.submissions.splice(obj.index, 1);
		let resp = await Form.find({ _id: obj.id }).updateOne({
			$set: {
				submissions: response.submissions,
			},
		});
		if (resp) return 'Success';
		else return 'Error';
	} catch (err) {
		return err;
	}
}
async function getUser(email) {
	if (email === null) return false;
	try {
		const user = await User.findOne({ email }).populate({
			path: 'forms',
			select: 'title',
		});
		return user;
	} catch (err) {
		console.log(err);
		return null;
	}
}

async function submitForm(obj) {
	let data = await Form.find({
		_id: obj.id,
	});
	if (data.length === 0) return 'Form Not Found';
	else {
		let resp = await Form.find({
			_id: obj.id,
		}).updateOne({
			$push: {
				submissions: {
					responses: obj.submission,
					name: obj.name,
					date: Date.now(),
				},
			},
		});
		if (resp) return 'Success';
		else return 'Error';
	}
}
async function getForm(obj) {
	if (obj === null) return false;
	try {
		let data = await Form.find({
			_id: obj,
		});
		return data;
	} catch (err) {
		console.log(err);
	}
}
async function makeForm(obj) {
	let uid;
	const newForm = new Form({
		title: obj.formData.title,
		description: obj.formData.description,
		fields: obj.formData.fields,
	});
	newForm.save(async (err, form) => {
		if (err) {
			console.log(err);
			return 'err';
		} else {
			var cnf = await tagUser(obj.email, form._id, form.title);
			console.log(cnf);
			if (cnf !== null) return cnf;
			else return 'Cant Link';
		}
	});
}
async function tagUser(user, uid, title) {
	let resp = await User.findOneAndUpdate(
		{ email: user },
		{ $push: { forms: { id: uid.toString(), title: title } } },
		{ new: true }
	);
	if (resp) return uid.toString();
	else return null;
}
async function authenticate(obj) {
	let data = await User.find({
		email: obj.email,
	});
	return data.length === 1 && bcrypt.compare(obj.password, data[0].password);
}
async function findUser(obj) {
	let data = await User.find({
		email: obj,
	});
	//   console.log(data.length);
	if (data.length !== 0) return true;
	else return false;
}
