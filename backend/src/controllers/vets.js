const Vet = require('../models/vets');

const vetApplicationController = async (req, res) => {
  try {
    if (req.user.role !== 'vet') {
      return res.status(403).json({ message: 'Only vet accounts can submit a vet application' });
    }

    const existing = await Vet.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'A vet profile already exists for this account' });
    }
    const { name, licenseNumber, specialization, experienceYears, contactInfo, city, rating } = req.body;

    const newVet = new Vet({
      user: req.user.id,
      name,
      licenseNumber,
      specialization,
      experienceYears,
      contactInfo,
      city,
      rating,
    });
    await newVet.save();
    res.status(201).json(newVet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVetsController = async (req, res) => {
  try {
    const vets = await Vet.find({ verificationStatus: 'verified' });
    res.status(200).json(vets);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getVetByIdController = async (req, res) => {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) {
      return res.status(404).json({ message: 'Vet not found' });
    }
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getOwnVetProfileController = async (req, res) => {
  try {
    const vet = await Vet.findOne({ user: req.user.id });
    if (!vet) {
      return res.status(404).json({ message: 'No vet profile found for this account' });
    }
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const validateVetProfileInput = ({ name, specialization, experienceYears, city, contactInfo }) => {
  if (name !== undefined && !name.trim()) {
    return 'Name is required';
  }
  if (specialization !== undefined && !specialization.trim()) {
    return 'Specialization is required';
  }
  if (experienceYears !== undefined && (isNaN(Number(experienceYears)) || Number(experienceYears) < 0)) {
    return "Experience can't be negative";
  }
  if (city !== undefined && !city.trim()) {
    return 'City is required';
  }
  if (contactInfo?.phone !== undefined && !contactInfo.phone.trim()) {
    return 'Phone number is required';
  }
  if (contactInfo?.email !== undefined) {
    if (!contactInfo.email.trim()) {
      return 'Contact email is required';
    }
    if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
      return 'Enter a valid email address';
    }
  }
  return null;
};

const updateOwnVetProfileController = async (req, res) => {
  try {
    const vet = await Vet.findOne({ user: req.user.id });
    if (!vet) {
      return res.status(404).json({ message: 'No vet profile found for this account' });
    }

    const { name, specialization, experienceYears, city, contactInfo } = req.body;

    const validationError = validateVetProfileInput({ name, specialization, experienceYears, city, contactInfo });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    if (name !== undefined) vet.name = name;
    if (specialization !== undefined) vet.specialization = specialization;
    if (experienceYears !== undefined) vet.experienceYears = experienceYears;
    if (city !== undefined) vet.city = city;
    if (contactInfo !== undefined) {
      vet.contactInfo = {
        phone: contactInfo.phone ?? vet.contactInfo?.phone,
        email: contactInfo.email ?? vet.contactInfo?.email,
      };
    }

    await vet.save();
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update vet profile', error: error.message });
  }
};

const submitVerification = async (req, res) => {
  try {
    if (req.user.role !== 'vet') {
      return res.status(403).json({ message: 'Only vets can submit verification' });
    }

    const vet = await Vet.findOne({ user: req.user.id });
    if (!vet) {
      return res.status(404).json({ message: 'No vet profile found for this account' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'A proof document is required' });
    }

    const { licenseIssuingAuthority, licenseIssueDate, additionalNotes } = req.body;

    if (!licenseIssuingAuthority || !licenseIssuingAuthority.trim() || licenseIssuingAuthority.trim().length < 2) {
      return res.status(400).json({ message: 'Please enter a valid issuing authority' });
    }
    if (!licenseIssueDate) {
      return res.status(400).json({ message: 'License issue date is required' });
    }
    if (new Date(licenseIssueDate) > new Date()) {
      return res.status(400).json({ message: "Issue date can't be in the future" });
    }

    vet.verificationDetails = {
      licenseIssuingAuthority,
      licenseIssueDate,
      additionalNotes,
    };
    vet.proofDocumentPath = `/uploads/vet-proofs/${req.file.filename}`;
    vet.verificationStatus = 'pending';
    vet.submittedAt = new Date();
    vet.rejectionReason = undefined;

    await vet.save();
    res.status(200).json(vet);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting verification', error: error.message });
  }
};

const getPendingVerifications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view pending verifications' });
    }
    const pending = await Vet.find({ verificationStatus: 'pending' }).populate('user', 'name email');
    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  vetApplicationController,
  getVetsController,
  getVetByIdController,
  getOwnVetProfileController,
  updateOwnVetProfileController,
  submitVerification,
  getPendingVerifications,
};