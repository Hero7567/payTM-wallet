const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");

const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

// Zod schema for signup
const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

// POST /signup
router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    await Account.create({
        userId: user._id,
        balance: Math.floor(1 + Math.random() * 10000)
    });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

// Zod schema for signin
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

// POST /signin
router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid inputs"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        return res.status(411).json({
            message: "Invalid username or password"
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
});

// Zod schema for updating user
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
});

// PUT / - update user profile
router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid input format"
        });
    }

    await User.updateOne({ _id: req.userId }, { $set: req.body });

    res.json({
        message: "Updated successfully"
    });
});

// GET /bulk?filter=<string> - search users by name
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [
            { firstName: { $regex: filter, $options: "i" } },
            { lastName: { $regex: filter, $options: "i" } }
        ]
    }).select("username firstName lastName _id");

    res.json({
        users
    });
});

module.exports = router;
