const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Ruta para iniciar sesión
router.post('/login', authController.login);

// Ruta para registrar un nuevo usuario
router.post('/register', authController.register);

module.exports = router;
