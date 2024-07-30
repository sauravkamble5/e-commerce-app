import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		mongoose.connection.on('connected', () =>
			console.log('MongoDB is connected') 
		);
		mongoose.connection.on('disconnected', () =>
			console.log('MongDB is disconnected')
		);
		mongoose.connection.on('error', (err) =>
			console.error('Error in MongoDB connection', err)
		);

		await mongoose.connect(process.env.MONGO_URI);
	} catch (error) {
		console.error('Failed to connect database:', error);
	}
};

export default connectDB;
