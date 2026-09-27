const express = require("express");
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET logged-in student's profile
router.get("/me", authenticateToken, async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT
                u.student_id,
                p.full_name,
                p.course,
                p.year_level,
                p.about_me,
                p.skills,
                p.facebook,
                p.github,
                p.email,
                p.profile_picture
             FROM users u
             JOIN student_profiles p
                ON u.id = p.user_id
             WHERE u.id = ?`,
            [req.user.userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        res.json({
            profile: rows[0]
        });

    } catch (error) {
        console.error("Profile retrieval error:", error);

        res.status(500).json({
            message: "Unable to retrieve student profile."
        });
    }
});

// UPDATE logged-in student's profile
router.put("/me", authenticateToken, async (req, res) => {
    const {
        fullName,
        course,
        yearLevel,
        aboutMe,
        skills,
        facebook,
        github,
        email
    } = req.body;

    if (!fullName || !course || !yearLevel || !aboutMe || !skills || !email) {
        return res.status(400).json({
            message: "Please complete all required profile fields."
        });
    }

    try {
        const [result] = await db.execute(
            `UPDATE student_profiles
             SET
                full_name = ?,
                course = ?,
                year_level = ?,
                about_me = ?,
                skills = ?,
                facebook = ?,
                github = ?,
                email = ?
             WHERE user_id = ?`,
            [
                fullName,
                course,
                yearLevel,
                aboutMe,
                skills,
                facebook || null,
                github || null,
                email,
                req.user.userId
            ]
        );

        if (result.affectedRows === 0) {
            const [profileRows] = await db.execute(
                "SELECT id FROM student_profiles WHERE user_id = ?",
                [req.user.userId]
            );

            if (profileRows.length === 0) {
                return res.status(404).json({
                    message: "Student profile not found."
                });
            }
        }

        res.json({
            message: "Profile Updated Successfully."
        });

    } catch (error) {
        console.error("Profile update error:", error);

        res.status(500).json({
            message: "Unable to update student profile."
        });
    }
}); 

// UPDATE logged-in student's profile picture
router.put("/me/picture", authenticateToken, async (req, res) => {
    const { profilePicture } = req.body;

    if (!profilePicture) {
        return res.status(400).json({
            message: "Profile picture is required."
        });
    }

    try {
        const [result] = await db.execute(
            `UPDATE student_profiles
             SET profile_picture = ?
             WHERE user_id = ?`,
            [
                profilePicture,
                req.user.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student profile not found."
            });
        }

        res.json({
            message: "Profile picture updated successfully."
        });

    } catch (error) {
        console.error("Profile picture update error:", error);

        res.status(500).json({
            message: "Unable to update profile picture."
        });
    }
});

// DELETE logged-in student's profile
router.delete("/me", authenticateToken, async (req, res) => {
    try {
        const [result] = await db.execute(
            "DELETE FROM users WHERE id = ?",
            [req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Student account not found."
            });
        }

        res.json({
            message: "Student profile deleted successfully."
        });

    } catch (error) {
        console.error("Profile deletion error:", error);

        res.status(500).json({
            message: "Unable to delete student profile."
        });
    }
});

module.exports = router;