const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

const mongoose = require('mongoose');
const app = require('./app');
const express = require('express');
const { startAppointmentScheduler } = require('./utils/scheduler');

app.use(express.json());

const startServer = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log('Connected to MongoDB');

    startAppointmentScheduler();

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
    }
    catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
};

startServer();