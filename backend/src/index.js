require('dotenv').config();
const express = require('express');
const cors = require('cors');


const authRoutes = require('../routes/auth');
const uploadRoutes = require('../routes/upload');
const dashboardRoutes = require('../routes/dashboard')


const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));


app.get('/', (req, res) => res.json({ ok: true, name: 'BPJS Cabang API' }));
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/keliling', require('../routes/keliling'))
app.use('/viola', require('../routes/viola'))
app.use('/prima', require('../routes/prima'))
app.use('/pengaduan', require('../routes/pengaduan'))


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));