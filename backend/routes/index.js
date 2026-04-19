// backend/routes/index.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const User = require('../models/User');

// GET all available resources
router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.json(resources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while getting resources' });
    }
});

// POST a new resource
router.post('/resources', async (req, res) => {
    try {
        const { name, type, capacity } = req.body;
        const newResource = await Resource.create({ name, type, capacity });
        res.status(201).json(newResource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating resource' });
    }
});

// GET all bookings (includes resource and user data using join/eager loading)
router.get('/bookings', async (req, res) => {
    try {
        // finding bookings and combining BOTH resource and user data
        const bookings = await Booking.findAll({
            include: [Resource, User] 
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while getting bookings' });
    }
});

// POST a new booking
router.post('/bookings', async (req, res) => {
    try {
        const { resource_id, requested_by, booking_date } = req.body;
        
        if (!resource_id || !requested_by || !booking_date) {
            return res.status(400).json({ error: 'Please provide all fields' });
        }

        // Check if the resource is already booked on this date
        const existingBooking = await Booking.findOne({
            where: { resource_id, booking_date }
        });

        if (existingBooking) {
            return res.status(409).json({ error: 'This resource is already booked on the selected date.' });
        }

        // Student-like solution: Instead of making them login, we dynamically find or create their User row.
        const [user, created] = await User.findOrCreate({
            where: { name: requested_by }
        });

        const newBooking = await Booking.create({ 
            resource_id, 
            user_id: user.id, 
            booking_date 
        });
        
        res.status(201).json(newBooking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while creating booking' });
    }
});

// DELETE a specific booking
router.delete('/bookings/:id', async (req, res) => {
    try {
        const idToDelete = req.params.id;
        await Booking.destroy({ where: { id: idToDelete } });
        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error while deleting booking' });
    }
});

module.exports = router;
