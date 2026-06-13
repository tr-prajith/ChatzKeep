const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }
};

module.exports = authMiddleware;