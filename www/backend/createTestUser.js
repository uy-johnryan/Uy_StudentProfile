require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./db");

async function createTestUser() {

    const studentId = "DELETE-TEST";
    const password = "DeleteTest123";

    const fullName = "Delete Test User";
    const course = "BS Information Technology";
    const yearLevel = "3rd Year";

    const aboutMe =
        "I am currently a 3rd Year BSIT student at Xavier University Ateneo de Cagayan, planning on pursuing the field of Web Development. By exploring and tinkering around HTML, CSS, and JavaScript, I create projects that best fit my ideas.";

    const skills =
        "HTML, CSS, Responsive Layout, Debugging, JavaScript, Python";

    const facebook =
        "https://www.facebook.com/johnryan.uy.501/";

    const github =
        "https://github.com/uy-johnryan";

    const email =
        "johnryan.m.uy@gmail.com";

    const profilePicture =
        "img/profile1.jpg";


    try {

        // Hash the password before storing it
        const passwordHash = await bcrypt.hash(
            password,
            10
        );

        // Create user account
        const [userResult] = await db.execute(
            `INSERT INTO users
                (student_id, password_hash)
             VALUES (?, ?)`,
            [
                studentId,
                passwordHash
            ]
        );

        const userId = userResult.insertId;

        // Create the student's profile
        await db.execute(
            `INSERT INTO student_profiles
                (
                    user_id,
                    full_name,
                    course,
                    year_level,
                    about_me,
                    skills,
                    facebook,
                    github,
                    email,
                    profile_picture
                )
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                fullName,
                course,
                yearLevel,
                aboutMe,
                skills,
                facebook,
                github,
                email,
                profilePicture
            ]
        );

        console.log("Test student account created successfully.");
        console.log("Student ID:", studentId);
        console.log("Test password:", password);

    } catch (error) {

        console.error(
            "Error creating test account:",
            error
        );

    } finally {

        await db.end();
    }
}

createTestUser();