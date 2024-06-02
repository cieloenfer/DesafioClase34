const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.get('/loggerTest', (req, res) => {
    logger.debug('This is a debug log');
    logger.http('This is an http log');
    logger.info('This is an info log');
    logger.warning('This is a warning log');
    logger.error('This is an error log');
    logger.fatal('This is a fatal log');
    res.send('Logging test complete');
});

module.exports = router;
