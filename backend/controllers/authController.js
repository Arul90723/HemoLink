const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Donor = require('../models/Donor');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '1d',
  });
};

exports.registerHospital = async (req, res, next) => {
  try {
    const { email, password, name, license, documentMetadata, lat, lng } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, passwordHash: password, role: 'HOSPITAL' });
    await user.save();

    const hospital = new Hospital({
      userId: user._id,
      name,
      license,
      documentMetadata,
      location: { lat, lng }
    });
    await hospital.save();

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'Hospital registered successfully', user: { id: user._id, email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.registerDonor = async (req, res, next) => {
  try {
    const { email, password, phone, bloodGroup } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, passwordHash: password, role: 'DONOR' });
    await user.save();

    const donor = new Donor({
      userId: user._id,
      phone,
      bloodGroup
    });
    await donor.save();

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'Donor registered successfully', user: { id: user._id, email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id, user.role);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: 'Logged in successfully', user: { id: user._id, email: user.email, role: user.role }, token });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};
