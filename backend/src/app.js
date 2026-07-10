require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const appointmentRoutes = require('./routes/appointments');
const vetRoutes = require('./routes/vets');
const petRoutes = require('./routes/pets');


if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
else {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.send('Welcome to VetSphere API');
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/vets', vetRoutes);
app.use('/pets', petRoutes);

app.all('*splat', (req, res) => { 
  res.status(404).send('Not Found'); 
});

module.exports = app;