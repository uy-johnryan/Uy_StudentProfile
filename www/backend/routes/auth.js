const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {

    const { studentId, password } = req.body;

    if (!studentId || !password) {
        return res.status(400).json({
            message: "Student ID and password are required."
        });
    }

    try {

        const [rows] = await db.execute(
            "SELECT * FROM users WHERE student_id = ?",
            [studentId]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                message: "Invalid student ID or password."
            });
        }

        const user = rows[0];

        const passwordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordValid) {
            return res.status(401).json({
                message: "Invalid student ID or password."
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                studentId: user.student_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful.",
            token
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Unable to authenticate. Please try again."
        });
    }
});

module.exports = router;