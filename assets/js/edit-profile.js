let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

document.getElementById("firstname").value = user.firstname || "";
document.getElementById("lastname").value = user.lastname || "";
document.getElementById("username").value = user.username || "";
document.getElementById("phone").value = user.phone || "";

function saveProfile() {

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();

    // ===== قوانین =====

    const firstnameRegex = /^[آ-ی\s]{2,30}$/;
    const lastnameRegex = /^[آ-ی\s]{2,40}$/;
    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{3,19}$/;
    const phoneRegex = /^09\d{9}$/;

    if (!firstnameRegex.test(firstname)) {
        alert("نام فقط باید شامل حروف فارسی و بین ۲ تا ۳۰ کاراکتر باشد.");
        return;
    }

    if (!lastnameRegex.test(lastname)) {
        alert("نام خانوادگی فقط باید شامل حروف فارسی و بین ۲ تا ۴۰ کاراکتر باشد.");
        return;
    }

    if (!usernameRegex.test(username)) {
        alert("نام کاربری باید با حرف انگلیسی شروع شود و فقط شامل حروف انگلیسی، اعداد و _ باشد (۴ تا ۲۰ کاراکتر).");
        return;
    }

    if (!phoneRegex.test(phone)) {
        alert("شماره موبایل باید ۱۱ رقم و با 09 شروع شود.");
        return;
    }

    // ذخیره

    user.firstname = firstname;
    user.lastname = lastname;
    user.username = username;
    user.phone = phone;

    localStorage.setItem("user", JSON.stringify(user));

    alert("اطلاعات حساب با موفقیت ذخیره شد.");

    window.location.href = "profile.html";
}