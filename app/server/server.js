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

app.get('/api', (req, res) => {
  res.json({ status: 'Todo API running' });
});

// Add this after your other routes
app.get('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const altPort = port + 1;
    console.log(`Port ${port} in use, trying ${altPort}`);
    server.listen(altPort);  // Fixed port increment (5000 → 5001)
  }
});

process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	server.close(() => process.exit(1));
});
