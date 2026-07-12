const cron = require('node-cron');
const Appointment = require('../models/appointments');
const Users = require('../models/users');
const Vet = require('../models/vets');

const GRACE_PERIOD_DAYS = 7;
const GRACE_PERIOD_MS = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

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

const runAccountDeletionCleanup = async () => {
  try {
    const cutoff = new Date(Date.now() - GRACE_PERIOD_MS);

    const staleUsers = await Users.find({
      deletionRequestedAt: { $ne: null, $lte: cutoff },
    });

    if (staleUsers.length === 0) {
      return;
    }

    let deletedCount = 0;

    for (const user of staleUsers) {
      if (user.role === 'vet') {
        await Vet.findOneAndDelete({ user: user._id });
      }
      await Users.findByIdAndDelete(user._id);
      deletedCount += 1;
    }

    console.log(`[account-scheduler] Permanently deleted ${deletedCount} account(s) past the grace period.`);
  } catch (error) {
    console.error('[account-scheduler] Error running account cleanup:', error);
  }
};

const startAppointmentScheduler = () => {
  cron.schedule('*/15 * * * *', runAppointmentCleanup);
  console.log('[appointment-scheduler] Scheduler started — runs every 15 minutes');
  runAppointmentCleanup();
};

const startAccountDeletionScheduler = () => {
  cron.schedule('0 0 * * *', runAccountDeletionCleanup);
  console.log('[account-scheduler] Scheduler started — runs every 24 hours');
  runAccountDeletionCleanup();
};

module.exports = { startAppointmentScheduler, startAccountDeletionScheduler };