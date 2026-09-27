document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");

    // Login page
    if (loginForm) {

        const loginError =
            document.getElementById("login-error");

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            loginError.textContent = "";

            const studentId =
                document.getElementById("student-id").value.trim();

            const password =
                document.getElementById("password").value;

            try {

                const response = await apiRequest(
                    "/auth/login",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            studentId: studentId,
                            password: password
                        })
                    }
                );

                localStorage.setItem(
                    "auth_token",
                    response.token
                );

                window.location.href = "index.html";

            } catch (error) {

                loginError.textContent = error.message;
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }

});

function requireAuthentication() {

    const token = localStorage.getItem("auth_token");

    if (!token) {
        window.location.href = "login.html";
    }
}

function logout() {

    localStorage.removeItem("auth_token");

    window.location.href = "login.html";
}