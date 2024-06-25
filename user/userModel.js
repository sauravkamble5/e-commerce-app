import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please use a valid email address',
			],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		address: {
			type: String,
			required: [true, 'Address is required'],
		},
		city: {
			type: String,
			required: [true, 'City Name is required'],
		},
		country: {
			type: String,
			required: [true, 'Country Name is required'],
		},
		phone: {
			type: String,
			required: [true, 'Phone number is required'],
		},
		profilePic: {
			type: String,
		},
	},
	{ timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

export default UserModel;
