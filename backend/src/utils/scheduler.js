const cron = require('node-cron');
const Appointment = require('../models/appointments');

const runAppointmentCleanup = async () => {
  try {
    const now = new Date();

    const expiredPending = await Appointment.updateMany(
      { status: 'pending', date: { $lt: now } },
      { $set: {
        status: 'rejected',
        statusNote: 'Automatically rejected — no response before the appointment time passed.',
      } }
    );

    const expiredConfirmed = await Appointment.updateMany(
      { status: 'confirmed', date: { $lt: now } },
      { $set: {
        status: 'completed',
        statusNote: 'Automatically marked as completed after the appointment time passed.',
      } }
    );

    if (expiredPending.modifiedCount > 0 || expiredConfirmed.modifiedCount > 0) {
      console.log(
        `[appointment-scheduler] Auto-rejected: ${expiredPending.modifiedCount}, Auto-completed: ${expiredConfirmed.modifiedCount}`
      );
    }
  } catch (error) {
    console.error('[appointment-scheduler] Error running cleanup:', error);
  }
};

const startAppointmentScheduler = () => {
  cron.schedule('*/15 * * * *', runAppointmentCleanup);
  console.log('[appointment-scheduler] Scheduler started — runs every 15 minutes');
  runAppointmentCleanup();
};

module.exports = { startAppointmentScheduler };