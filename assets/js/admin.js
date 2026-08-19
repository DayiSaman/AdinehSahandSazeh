/* =========================================================
   ADINEH SAHAND SAZEH
   ADMIN PANEL
========================================================= */


/* =========================================================
   CURRENT USER
========================================================= */

let user = null;

try {

    user = JSON.parse(
        localStorage.getItem("user")
    );

} catch (error) {

    user = null;

}


/* =========================================================
   ADMIN LIST
========================================================= */

const DEFAULT_ADMINS = [
    "@Owner"
];


function getAdmins() {

    try {

        const data =
            localStorage.getItem("admins");

        if (!data) {

            localStorage.setItem(
                "admins",
                JSON.stringify(DEFAULT_ADMINS)
            );

            return DEFAULT_ADMINS;

        }

        const admins =
            JSON.parse(data);

        return Array.isArray(admins)
            ? admins
            : DEFAULT_ADMINS;

    } catch (error) {

        return DEFAULT_ADMINS;

    }

}


/* =========================================================
   ADMIN CHECK
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


    return getAdmins()
        .some(function(admin) {

            return String(admin)
                .trim()
                .toLowerCase()
                === username;

        });

}


/* =========================================================
   SECURITY
========================================================= */

if (!user || !isAdmin(user)) {

    alert(
        "دسترسی به پنل مدیریت مجاز نیست."
    );

    window.location.href =
        "dashboard.html";

}


/* =========================================================
   GET ARRAY FROM STORAGE
========================================================= */

function getArray(key) {

    try {

        const data =
            localStorage.getItem(key);

        if (!data) {
            return [];
        }

        const parsed =
            JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {


    const users =
        getArray("users");


    const tickets =
        getArray("tickets");


    const banned =
        getArray("bannedUsers");


    const admins =
        getAdmins();



    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    const totalTickets =
        document.getElementById(
            "totalTickets"
        );


    const totalBanned =
        document.getElementById(
            "totalBanned"
        );


    const totalAdmins =
        document.getElementById(
            "totalAdmins"
        );



    if (totalUsers) {

        totalUsers.innerText =
            users.length;

    }


    if (totalTickets) {

        totalTickets.innerText =
            tickets.length;

    }


    if (totalBanned) {

        totalBanned.innerText =
            banned.length;

    }


    if (totalAdmins) {

        totalAdmins.innerText =
            admins.length;

    }

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateStats();

    }
);