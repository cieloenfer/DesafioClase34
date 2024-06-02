const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', authMiddleware.isAdmin, (req, res) => {
  userController.getAllUsers(req, res)
    .then(() => logger.info('Fetched all users'))
    .catch(error => logger.error('Error fetching users:', error));
});

router.delete('/', authMiddleware.isAdmin, (req, res) => {
  userController.deleteInactiveUsers(req, res)
    .then(() => logger.info('Deleted inactive users'))
    .catch(error => logger.error('Error deleting inactive users:', error));
});

module.exports = router;
