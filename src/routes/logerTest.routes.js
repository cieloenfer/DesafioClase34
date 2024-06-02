const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

router.get('/loggerTest', (req, res) => {
  logger.debug('Debug log');
  logger.http('HTTP log');
  logger.info('Info log');
  logger.warn('Warning log');
  logger.error('Error log');
  logger.fatal('Fatal log');
  res.send('Logger test completed. Check your logs.');
});

module.exports = router;
