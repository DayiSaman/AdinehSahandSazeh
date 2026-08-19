let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

document.getElementById("firstname").innerText = user.firstname || "-";
document.getElementById("lastname").innerText = user.lastname || "-";
document.getElementById("username").innerText = user.username || "-";
document.getElementById("phone").innerText = user.phone || "-";

if (user.createdAt) {
    let date = new Date(user.createdAt);

    document.getElementById("createdAt").innerText =
        date.toLocaleDateString("fa-IR");
} else {
    document.getElementById("createdAt").innerText = "-";
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("loggedIn");
    window.location.href = "login.html";
}