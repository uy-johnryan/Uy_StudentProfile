require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", async (req, res) => {

    try {

        const [rows] = await db.execute(
            "SELECT 1 AS database_connection"
        );

        res.json({
            message: "Student Profile API is running.",
            database: rows[0].database_connection === 1
                ? "connected"
                : "not connected"
        });

    } catch (error) {

        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed."
        });
    }
});

const PORT = process.env.PORT || 3000;  

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});