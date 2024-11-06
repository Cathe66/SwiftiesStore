const jwt = require('jsonwebtoken');

async function authToken(req, res, next) {
    try {
        console.log("req.cookies", req.cookies);  // Log all cookies to ensure token is there
        const token = req.cookies?.token;
        console.log("token", token);  // Log just the token

        if (!token) {
            return res.status(200).json({
                message: "Please Login...!",
                error: true,
                success: false,
            });
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function (err, decoded) {
            if (err) {
                console.log("error auth", err);
                return res.status(401).json({ message: "Unauthorized access", error: true });
            }

            console.log("decoded", decoded);
            req.userId = decoded?._id;
            next();
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            data: [],
            error: true,
            success: false,
        });
    }
}

module.exports = authToken;
