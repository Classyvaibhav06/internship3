const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const contactsRouter = require('./routes/contacts');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(__dirname)); // Serves CSS, JS, and Images

// ─── CONNECT TO DB ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship3')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

// ─── AUTH ROUTES ────────────────────────────────────────
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        res.cookie('adminToken', 'logged_in', { httpOnly: true, maxAge: 86400000 });
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Incorrect password' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ success: true });
});

// ─── API ROUTES ─────────────────────────────────────────
app.use('/api/contacts', contactsRouter);

// ─── PAGE ROUTES ────────────────────────────────────────
// Now you explicitly control the HTML pages:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));