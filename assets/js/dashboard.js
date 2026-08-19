/* =========================================================
   ADINEH SAHAND SAZEH
   USER DASHBOARD
========================================================= */


/* =========================================================
   GET USER
========================================================= */

let user = null;


try {

    user =
        JSON.parse(
            localStorage.getItem("user")
        );

} catch (error) {

    console.error(
        "User data error:",
        error
    );

    user = null;

}


/* =========================================================
   LOGIN CHECK
========================================================= */

if (!user) {

    window.location.href =
        "login.html";

}


/* =========================================================
   ELEMENTS
========================================================= */

const usernameElement =
    document.getElementById(
        "username"
    );


const phoneElement =
    document.getElementById(
        "phone"
    );


const adminPanelButton =
    document.getElementById(
        "adminPanelButton"
    );


const roleBox =
    document.getElementById(
        "roleBox"
    );


/* =========================================================
   USER INFO
========================================================= */

if (usernameElement) {

    usernameElement.innerText =
        user.username || "-";

}


if (phoneElement) {

    phoneElement.innerText =
        user.phone || "-";

}


/* =========================================================
   ADMIN USERS
========================================================= */

const ADMIN_USERNAMES = [

    "@Owner"

];


/* =========================================================
   CHECK ADMIN
========================================================= */

function isAdmin(currentUser) {

    if (!currentUser) {

        return false;

    }


    const username =
        String(
            currentUser.username || ""
        )
        .trim()
        .toLowerCase();


    return ADMIN_USERNAMES
        .map(function (name) {

            return String(name)
                .trim()
                .toLowerCase();

        })
        .includes(username);

}


/* =========================================================
   SHOW ADMIN PANEL
========================================================= */

if (isAdmin(user)) {


    console.log(
        "Admin user detected:",
        user.username
    );


    if (adminPanelButton) {

        adminPanelButton.style.display =
            "flex";

    }


    if (roleBox) {

        roleBox.style.display =
            "block";

    }


}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {


    localStorage.removeItem(
        "user"
    );


    localStorage.removeItem(
        "loggedIn"
    );


    window.location.href =
        "login.html";

}