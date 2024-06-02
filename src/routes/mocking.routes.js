const express = require('express');
const router = express.Router();
const { generateMockProducts } = require('../Controllers/mocking.controller');

router.get('/mockingproducts', generateMockProducts);

module.exports = router;
