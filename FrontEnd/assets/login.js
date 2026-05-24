document.querySelector("#btn-login").addEventListener("click", async () => {
    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const logs = await response.json()

    if (response.ok) {
        localStorage.setItem("token", logs.token)
        window.location.href = "index.html"
    } else {
        document.querySelector("#login-error").textContent = "Email ou mot de passe incorrect"
    }
})
