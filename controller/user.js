const UserModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// let securityKey = process.env["SECRATE_KEY"];
let securityKey = "sonu1234";

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let hashedPassword = await bcrypt.hash(password, 10);
        let user = await UserModel.create({ name, email, password: hashedPassword });

        res.status(201).json({ status: "success", message: "user registerd succefully" });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message })
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await UserModel.find({ email });
        if (user.length === 0) {
            return res.status(400).json({ status: "fail", message: "User not found!" });
        }

        let matchedPassword = await bcrypt.compare(password, user[0].password);

        if (!matchedPassword) {
            return res.status(400).json({ status: 'fail', message: "Password is wrong!" });
        }

        let obj = {
            name: user[0].name,
            email: user[0].email,
            id: user[0]._id,
        }

        let token = jwt.sign(obj, securityKey);
        res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });
        return res.status(200).json({ status: "success", message: "Login succesfull", userName: email });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ status: "fail", message: error.message });
    }
}

const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ status: "success", message: "logout seccessfull" });
}


module.exports = { registerUser, loginUser, logoutUser }