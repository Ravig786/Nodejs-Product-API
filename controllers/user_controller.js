const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "fiohhdfsdlhdi&^7812362#$%#@%#%$fdshfkjdshfaldhf";

module.exports = {
    registerUser: async(req, res) => {
        try {
            const { email, username, password: plainTextPassword } = req.body;

            if (!email || typeof email !== "string") {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid email",
                });
            }
            if (!username || typeof username !== "string") {
                return res.status(400).json({
                    status: "error",
                    error: "Invalid username",
                });
            }
            if (!plainTextPassword || plainTextPassword.length < 5) {
                return res.status(400).json({
                    status: "error",
                    error: "Password too small. Should be atleast 6 characters ",
                });
            }
            const actualpassword = plainTextPassword;
            const password = await bcrypt.hash(plainTextPassword, 10);

            const response = await User.create({
                email,
                username,
                password,
                actualpassword,
            });
            response.save().then((result) => {
                const token = jwt.sign({ result }, JWT_SECRET);
                console.log("User created", result);
                return res.status(201).json({
                    status: "ok",
                    data: result,
                    token: token,
                });
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({
                    status: "error",
                    error: "Username already in use",
                });
            }

            throw error;
        }
    },
    loginUser: async(req, res) => {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).lean();

        if (!user) {
            return res.status(400).json({
                status: "error",
                error: "Invalid username/password",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ user }, JWT_SECRET);

            return res.status(201).json({
                status: "ok",
                data: token,
            });
        }

        res.status(400).json({
            status: "error",
            error: "Invalid username/password",
        });
    },
};