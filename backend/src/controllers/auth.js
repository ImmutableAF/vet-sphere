const users = require('../models/users');
const Vet = require('../models/vets');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const GRACE_PERIOD_DAYS = 7;
const GRACE_PERIOD_MS = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    let accountRestored = false;

    if (user.deletionRequestedAt) {
      const elapsed = Date.now() - new Date(user.deletionRequestedAt).getTime();

      if (elapsed >= GRACE_PERIOD_MS) {
        if (user.role === 'vet') {
          await Vet.findOneAndDelete({ user: user._id });
        }
        await users.findByIdAndDelete(user._id);
        return res.status(410).json({ message: 'This account has been permanently deleted.' });
      }

      user.deletionRequestedAt = null;
      await user.save();
      accountRestored = true;
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({
      token,
      accountRestored,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const validateRegistrationInput = ({ name, email, password, role, phone, specialization, licenseNumber }) => {
  if (!name || name.length < 2) {
    return 'Name must be at least two characters';
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return 'Name can only contain letters';
  }

  if (!email) {
    return 'Email is required';
  }
  if (email.includes(' ')) {
    return 'Email cannot contain spaces';
  }
  if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return 'Enter a valid email address';
  }
  if (/\.{2,}/.test(email)) {
    return 'Email cannot contain consecutive dots';
  }
  if (/[._-]{2,}/.test(email)) {
    return 'Email cannot contain consecutive special characters';
  }
  if (email.startsWith('.') || email.startsWith('-') || email.startsWith('_')) {
    return 'Email cannot start with a special character';
  }

  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }

  if (role === 'vet') {
    if (!phone || !/^\d+$/.test(phone)) {
      return 'Phone number can only contain digits';
    }
    if (phone.length < 10 || phone.length > 13) {
      return 'Enter a valid phone number (10–13 digits)';
    }
    if (!specialization || specialization.length < 2) {
      return 'Specialization must be at least 2 characters';
    }
    if (!licenseNumber || !/^[a-zA-Z0-9]+$/.test(licenseNumber)) {
      return 'License number must be alphanumeric';
    }
    if (licenseNumber.length < 4) {
      return 'License number must be at least 4 characters';
    }
  }

  return null;
};

const registerController = async (req, res) => {
  try {
    const { name, email, password, role, phone, specialization, licenseNumber } = req.body;

    const safeRole = role === 'vet' ? 'vet' : 'owner';

    const validationError = validateRegistrationInput({ name, email, password, role: safeRole, phone, specialization, licenseNumber });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new users({ name, email, password: hashedPassword, role: safeRole });
    await newUser.save();

    if (safeRole === 'vet') {
      try {
        const newVet = new Vet({
          user: newUser._id,
          name: newUser.name,
          specialization,
          licenseNumber,
          contactInfo: {
            phone,
            email: newUser.email,
          },
        });
        await newVet.save();
      } catch (vetError) {
        await users.findByIdAndDelete(newUser._id);
        console.log('Vet creation failed, rolled back user:', vetError);
        return res.status(500).json({ message: 'Failed to create vet profile' });
      }
    }

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const requestAccountDeletionController = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required to confirm deletion' });
    }

    const user = await users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (user.role !== 'owner' && user.role !== 'vet') {
      return res.status(403).json({ message: 'This account type cannot be deleted through this feature' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    user.deletionRequestedAt = new Date();
    await user.save();

    res.json({ message: `Account scheduled for deletion in ${GRACE_PERIOD_DAYS} days.` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  loginController,
  registerController,
  requestAccountDeletionController,
};