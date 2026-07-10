const Vet = require('../models/vets');

const adminDashboard = async (req, res) => {
  try {
    const vets = await Vet.find().select(
      'name licenseNumber specialization experienceYears contactInfo city isVerified verificationStatus verificationDetails proofDocumentPath rejectionReason submittedAt reviewedAt'
    );
    res.json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateVerifyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus, rejectionReason } = req.body;

    if (!['verified', 'rejected'].includes(verificationStatus)) {
      return res.status(400).json({ message: 'verificationStatus must be either "verified" or "rejected"' });
    }

    if (verificationStatus === 'rejected' && !rejectionReason?.trim()) {
      return res.status(400).json({ message: 'A rejection reason is required' });
    }

    const vet = await Vet.findById(id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }

    if (vet.verificationStatus === 'not_submitted') {
      return res.status(400).json({ message: 'This vet has not submitted a verification request yet' });
    }

    if (vet.verificationStatus === verificationStatus) {
      return res.status(400).json({ message: `Vet is already ${verificationStatus}` });
    }

    const setFields = {
      verificationStatus,
      isVerified: verificationStatus === 'verified',
      reviewedAt: new Date(),
    };

    const updateQuery = { $set: setFields };

    if (verificationStatus === 'rejected') {
      setFields.rejectionReason = rejectionReason.trim();
    } else {
      updateQuery.$unset = { rejectionReason: '' };
    }

    const updatedVet = await Vet.findByIdAndUpdate(id, updateQuery, { new: true });
    res.json({ message: `Vet ${verificationStatus}`, vet: updatedVet });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  adminDashboard,
  updateVerifyStatus,
};