const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Body parser
app.use(express.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const movies = require('./routes/movies');
const review = require('./routes/review');
const ticketing = require('./routes/ticketing');
const specials = require('./routes/specials');

// Mount routers
app.use('/api/movies', movies);
app.use('/api/review', review);
app.use('/api/ticketing', ticketing);
app.use('/api/specials', specials);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
