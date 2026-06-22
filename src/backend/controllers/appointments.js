
const createAppointment = (req, res) => {
  res.send('Create appointment endpoint');
};

const getAppointments = (req, res) => {
  res.send('Get appointments endpoint');
};

const updateAppointmentStatus = (req, res) => {
  res.send('Update appointment status endpoint');
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};