//REACT-FORM-BUILDER/backend/models/lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
	leadName: {
		type: String,
		required: true,
	},
	leadEmail: {
		type: String,
		required: true,
	},
	leadPhoneNumber: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Lead', leadSchema);
