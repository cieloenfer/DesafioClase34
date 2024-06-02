require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    dbURL: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET
};
