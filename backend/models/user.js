const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	// forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }],
	forms: [{ type: Schema.Types.ObjectId, ref: 'Form' }],
	// forms : {
	// 	type: Array,
});

module.exports = mongoose.model('User', userSchema);
