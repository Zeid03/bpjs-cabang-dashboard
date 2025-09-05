require('dotenv').config();
const express = require('express');
const cors = require('cors');


const authRoutes = require('../routes/auth');
const uploadRoutes = require('../routes/upload');
const pesertaRoutes = require('../routes/peserta');
const klaimRoutes = require('../routes/klaim');
const dashboardRoutes = require('../routes/dashboard')


const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));


app.get('/', (req, res) => res.json({ ok: true, name: 'BPJS Cabang API' }));
app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/peserta', pesertaRoutes);
app.use('/klaim', klaimRoutes);
app.use('/dashboard', dashboardRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));