const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const logger = require('../utils/logger');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    logger.info(`User registered: ${email}`);
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      logger.warn(`Failed login attempt: ${email}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    user.last_connection = new Date();
    await user.save();

    res.status(200).json({ token });
    logger.info(`User logged in: ${email}`);
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({ message: error.message });
  }
};
