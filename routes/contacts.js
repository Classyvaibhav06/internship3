// routes/contacts.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// ─── CREATE ─────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── READ ALL ───────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── READ ONE ───────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Not found' });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── UPDATE ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // return updated doc + validate
        );
        if (!contact) return res.status(404).json({ error: 'Not found' });
        res.json(contact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── DELETE ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted', contact });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;