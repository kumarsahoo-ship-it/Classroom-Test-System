document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // 🚨 STOP page reload

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://classroom-test-system.onrender.com/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Response:", data);

        if (data === "User registered") {
            alert("Signup successful");
            window.location.href = "login.html"; // ✅ redirect works now
        } else {
            alert("Signup failed");
        }
    })
    .catch(err => {
        console.log("Error:", err);
    });
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault(); // stop refresh

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://classroom-test-system.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(data => {
        console.log("Login response:", data);

        if (data === "Login successful") {
            // ✅ save user
            localStorage.setItem("user", username);

            // ✅ redirect
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid username or password");
        }
    })
    .catch(err => console.log(err));
});
