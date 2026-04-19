// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index');

// taking environment variables from .env ideally
const PORT = process.env.PORT || 5000;

// using middlewares
app.use(cors());
app.use(express.json());

// using our routes from the routes folder
app.use('/api', routes);

// basic route
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to SpaceSync API' });
});

// starting the server!
app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}`);
});
