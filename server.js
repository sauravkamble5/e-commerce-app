import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/route.js';
import connectDB from './config/dbConnect.js';

dotenv.config();

connectDB();

const PORT = process.env.PORT || 8000;
const app = express();

app.use('/api/v1', routes);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	return res.status(200).send('<h2>Welcome to E-Commerce App</h2>');
});

app.listen(PORT, () => {
	console.log(`E-Commerce app listening on ${PORT}`.bgCyan.bgMagenta);
});
