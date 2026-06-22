
const adminDashboard = (req, res) => {
  res.send('Admin Dashboard');
};

const updateAdminInfo = (req, res) => {
  res.send('Update Admin Info');
};

module.exports = {
  adminDashboard,
  updateAdminInfo,
};