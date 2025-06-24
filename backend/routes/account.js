const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

// GET /balance - fetch user's account balance
router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (err) {
        console.error("Balance fetch error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST /transfer - transfer funds to another user
router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        // Validate input
        if (typeof amount !== 'number' || amount <= 0 || !mongoose.Types.ObjectId.isValid(to)) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid transfer details" });
        }

        // Fetch sender's account
        const fromAccount = await Account.findOne({ userId: req.userId }).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Fetch recipient's account
        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient account" });
        }

        // Perform balance update
        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });

    } catch (error) {
        await session.abortTransaction();
        console.error("Transfer error:", error);
        res.status(500).json({ message: "Transfer failed. Please try again later." });
    } finally {
        session.endSession();
    }
});

module.exports = router;
