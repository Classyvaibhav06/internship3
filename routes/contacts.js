const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// 🔒 Middleware: Block if no cookie
const requireAdmin = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken === 'logged_in') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }
};

// 1. Public: Submit a message
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = await Contact.create({ name, email, message });
        res.status(201).json({ success: true, contact });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// 2. Protected: Read all messages
router.get('/', requireAdmin, async (req, res) => { // 👈 requireAdmin is here!
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Protected: Delete a message
router.delete('/:id', requireAdmin, async (req, res) => { // 👈 requireAdmin is here!
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;