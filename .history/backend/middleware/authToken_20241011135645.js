const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        console.log("Token received:", token);
        if (!token) {
            return res.status(401).json({
                message: "Please login first!",
                error: true,
                success: false
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err);
                return res.status(403).json({
                    message: "Invalid or expired token!",
                    error: true,
                    success: false
                });
            }

            console.log("Decoded token:", decoded);
            req.userId = decoded._id; // Assuming _id is in the token

            next();
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "Server error",
            data: [],
            error: true,
            success: false
        });
    }
}

module.exports = authToken;
