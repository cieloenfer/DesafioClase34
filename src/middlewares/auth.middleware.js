function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
}

function authorizeUser(req, res, next) {
    if (req.user && req.user.role === 'usuario') {
        next();
    } else {
        res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
}

module.exports = {
    authorizeAdmin,
    authorizeUser
};
