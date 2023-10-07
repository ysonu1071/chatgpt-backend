const jwt = require('jsonwebtoken');

let securityKey = "sonu1234";

const authenticateUser = async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token) {
        return res.status(400).json({ status: "fail", message: "Token not found" })
    }

    try {
        let verifiedToken = jwt.verify(token, securityKey);
        if (!verifiedToken) {
            return res.status(400).json({ status: "fail", message: "Wrong token" });
        }

        next();
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ status: "fail", message: error.message });
    }
}

module.exports = authenticateUser;