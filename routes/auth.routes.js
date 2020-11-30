const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { STATUS, SECRET_KEY } = require("../core/constants");
const User = require("../models/User");

const router = Router();

/*
    REGISTRATION
*/
router.post(
    "/register",
    [
        body("name").isLength({ min: 1 }).withMessage("name must be at least 1 chars long"),
        body("password").isLength({ min: 1 }).withMessage("password must be at least 1 chars long"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(STATUS.CLIENT_ERROR).json({
                    errors: errors.array(),
                    message: "Wrong data for sign up",
                });
            }

            const { name, password } = req.body;

            const userExist = await User.findOne({ name });

            if (userExist) {
                return res.status(STATUS.CLIENT_ERROR).json({ message: `User ${name} already exist` });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({ name, password: hashedPassword });

            await newUser.save();

            res.status(STATUS.CREATED).json({ user: {name, password}, message: "User has been created" });
        } catch (e) {
            res.status(STATUS.CLIENT_ERROR).json({ message: "Something went wrong. Try again." });
        }
    },
);

/*
    LOGIN
*/
router.post(
    "/login",
    [
        body("name").isLength({ min: 1 }).withMessage("What is your name?"),
        body("password").exists().withMessage("Where is your password?"),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(STATUS.CLIENT_ERROR).json({
                    errors: errors.array(),
                    message: "Wrong data for sign in",
                });
            }

            const { name, password } = req.body;

            const user = await User.findOne({ name });

            if (!user) {
                return res.status(STATUS.CLIENT_ERROR).json({ message: "User doesn't exist" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(STATUS.CLIENT_ERROR).json({ message: "Wrong password" });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

            res.json({ token, userId: user.id, userName: user.name });
        } catch (e) {
            res.status(STATUS.CLIENT_ERROR).json({ message: "Something went wrong. Try again." });
        }
    },
);

module.exports = router;
