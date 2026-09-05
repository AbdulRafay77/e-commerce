require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectBD = require('./config/db.js');
const orderRoutes = require('./routes/orderRoutes.js');

const authRoutes = require('./routes/authRoutes.js');
const productRoutes = require('./routes/productRoutes.js');

const app = express();

connectBD();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));