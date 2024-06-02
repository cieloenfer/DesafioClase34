const User = require('../models/user.model');
const emailService = require('../services/email.service');
const moment = require('moment');
const logger = require('../utils/logger');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName lastName email role');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
  try {
    const threshold = moment().subtract(30, 'minutes'); // Cambia a 2 días para producción
    const inactiveUsers = await User.find({ last_connection: { $lt: threshold.toDate() } });

    for (const user of inactiveUsers) {
      await emailService.sendEmail({
        to: user.email,
        subject: 'Cuenta eliminada por inactividad',
        text: 'Tu cuenta ha sido eliminada debido a inactividad.'
      });
      logger.info(`Sent email to inactive user: ${user.email}`);
    }

    await User.deleteMany({ _id: { $in: inactiveUsers.map(user => user._id) } });

    res.status(200).json({ message: 'Usuarios inactivos eliminados' });
    logger.info('Deleted inactive users');
  } catch (error) {
    logger.error('Error deleting inactive users:', error);
    res.status(500).json({ message: error.message });
  }
};
