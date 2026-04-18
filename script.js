document.addEventListener("DOMContentLoaded", function () {

    // ================= SIGNUP =================
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please fill all fields");
                return;
            }

            try {
                const res = await fetch("https://classroom-test-system.onrender.com/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.text();
                console.log("Signup response:", data);

                if (data === "User registered") {
                    alert("Signup successful ✅");
                    window.location.href = "login.html";
                } else {
                    alert("Signup failed ❌");
                }

            } catch (err) {
                console.log(err);
                alert("Server error");
            }
        });
    }

    // ================= LOGIN =================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please fill all fields");
                return;
            }

            try {
                const res = await fetch("https://classroom-test-system.onrender.com/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.text();
                console.log("Login response:", data);

                if (data === "Login successful") {

                    // ✅ Save user session
                    localStorage.setItem("user", username);

                    // ✅ Redirect
                    window.location.href = "dashboard.html";

                } else {
                    alert("Invalid credentials ❌");
                }

            } catch (err) {
                console.log(err);
                alert("Server error");
            }
        });
    }

});
