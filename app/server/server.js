const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

connectDB();

const todos = require('./routes/todos');
const app = express();
app.use(cors());

app.use(express.json());

app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Define Routes
app.use('/api/todos', todos);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server started in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => process.exit(1));
});
