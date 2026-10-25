const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const contactsRouter = require('./routes/contacts');   // 👈 new

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internship3')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/contacts', contactsRouter);              // 👈 new

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));