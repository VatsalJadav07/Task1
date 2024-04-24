const jwt = require('jsonwebtoken');
const secretKey = 'myFirstWebsitetodevloapmyself';
const UserRole = require('../Model/userRole');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return res.status(401).json({ message: 'Invalid token format.' });
        }

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token.' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const userRoles = await UserRole.find({ userId: req.user._id }).populate('roleId');
        const roles = userRoles.map(userRole => userRole.roleId.roleName);

        if (!roles.includes('admin')) {
            return res.status(403).json({ message: 'You do not have access to proceed further' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const isUser = async (req, res, next) => {
    try {
        const userRoles = await UserRole.find({ userId: req.user._id }).populate('roleId');
        const roles = userRoles.map(userRole => userRole.roleId.roleName);

        if (!roles.includes('user')) {
            return res.status(403).json({ message: 'You do not have access to proceed further' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { auth, isAdmin, isUser };
