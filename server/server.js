require("dotenv").config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// middleware
app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static frontend
app.use(express.static(path.join(__dirname, '../public')));

//  routes
app.use('/api/messages', require('./routes/messages'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

//  image folder
app.use('/uploads', express.static('uploads'));
// server start 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});