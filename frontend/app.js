const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const placeRoutes = require('./routes/places');

// تحميل متغيرات البيئة
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

const app = express();

// Middleware لتفسير JSON
app.use(express.json());

// مسارات الأماكن
app.use('/api/places', placeRoutes);

module.exports = app;
