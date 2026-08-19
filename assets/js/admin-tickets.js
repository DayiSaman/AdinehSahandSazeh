/* =========================================================
   ADINEH SAHAND SAZEH
   ADMIN TICKETS
========================================================= */


const TICKETS_KEY = "tickets";

const ADMIN_USERS_KEY = "admins";


/* =========================================================
   CURRENT USER
========================================================= */

let currentUser = null;


try {

    currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );

} catch (error) {

    currentUser = null;

}


/* =========================================================
   HELPERS
========================================================= */

function getTickets() {

    try {

        const data =
            localStorage.getItem(
                TICKETS_KEY
            );

        if (!data) {
            return [];
        }

        const tickets =
            JSON.parse(data);

        return Array.isArray(tickets)
            ? tickets
            : [];

    } catch (error) {

        console.error(
            "Tickets read error:",
            error
        );

        return [];

    }

}


function saveTickets(tickets) {

    localStorage.setItem(
        TICKETS_KEY,
        JSON.stringify(tickets)
    );

}


function getAdmins() {

    try {

        const data =
            localStorage.getItem(
                ADMIN_USERS_KEY
            );

        if (!data) {

            return [
                "@Owner"
            ];

        }

        const admins =
            JSON.parse(data);

        return Array.isArray(admins)
            ? admins
            : ["@Owner"];

    } catch (error) {

        return ["@Owner"];

    }

}


function isAdmin() {

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


function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    const d =
        new Date(date);


    if (
        isNaN(
            d.getTime()
        )
    ) {

        return "-";

    }


    return d.toLocaleDateString(
        "fa-IR",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


function getStatusText(status) {

    switch (status) {

        case "open":
            return "باز";

        case "pending":
            return "در حال بررسی";

        case "closed":
            return "بسته";

        default:
            return "باز";

    }

}


function getStatusClass(status) {

    switch (status) {

        case "open":
            return "ticket-status-open";

        case "pending":
            return "ticket-status-pending";

        case "closed":
            return "ticket-status-closed";

        default:
            return "ticket-status-open";

    }

}


function normalizeId(value) {

    return String(
        value ?? ""
    ).trim();

}


/* =========================================================
   SECURITY
========================================================= */

if (
    !currentUser ||
    !isAdmin()
) {

    alert(
        "دسترسی به مدیریت تیکت‌ها مجاز نیست."
    );

    window.location.href =
        "dashboard.html";

}


/* =========================================================
   ELEMENTS
========================================================= */

const list =
    document.getElementById(
        "adminTicketsList"
    );


const searchInput =
    document.getElementById(
        "ticketSearch"
    );


const statusFilter =
    document.getElementById(
        "ticketStatusFilter"
    );


/* =========================================================
   RENDER
========================================================= */

function renderTickets() {

    if (!list) {
        return;
    }


    const tickets =
        getTickets();


    const search =
        String(
            searchInput?.value || ""
        )
        .trim()
        .toLowerCase();


    const status =
        statusFilter?.value || "all";


    let filtered =
        tickets.filter(
            function(ticket) {


                /* STATUS */

                if (
                    status !== "all" &&
                    ticket.status !== status
                ) {

                    return false;

                }


                /* SEARCH */

                if (!search) {

                    return true;

                }


                const searchable = [

                    ticket.id,

                    ticket.title,

                    ticket.category,

                    ticket.username,

                    ticket.phone,

                    ticket.firstname,

                    ticket.lastname

                ]
                .join(" ")
                .toLowerCase();


                return searchable
                    .includes(search);

            }
        );


    filtered.sort(
        function(a, b) {

            return new Date(
                b.updatedAt ||
                b.createdAt
            )
            -
            new Date(
                a.updatedAt ||
                a.createdAt
            );

        }
    );


    if (
        filtered.length === 0
    ) {

        list.innerHTML = `

            <div class="admin-empty">

                <div>
                    🎫
                </div>

                <h3>
                    تیکتی پیدا نشد
                </h3>

                <p>
                    در این بخش تیکتی با شرایط انتخاب‌شده وجود ندارد.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =

        filtered
        .map(
            function(ticket) {

                return `

                    <div
                        class="admin-ticket-card"
                    >

                        <div
                            class="admin-ticket-card-top"
                        >

                            <div>

                                <span
                                    class="ticket-number"
                                >
                                    #${escapeHTML(ticket.id)}
                                </span>

                                <h3>
                                    ${escapeHTML(ticket.title)}
                                </h3>

                            </div>


                            <span
                                class="
                                    ticket-status
                                    ${getStatusClass(ticket.status)}
                                "
                            >
                                ${getStatusText(ticket.status)}
                            </span>

                        </div>



                        <div
                            class="admin-ticket-user"
                        >

                            <span>
                                👤
                                ${escapeHTML(
                                    ticket.firstname ||
                                    ""
                                )}
                                ${escapeHTML(
                                    ticket.lastname ||
                                    ""
                                )}
                            </span>

                            <span>
                                ${escapeHTML(
                                    ticket.username ||
                                    "-"
                                )}
                            </span>

                            <span>
                                📱
                                ${escapeHTML(
                                    ticket.phone ||
                                    "-"
                                )}
                            </span>

                        </div>



                        <div
                            class="ticket-meta"
                        >

                            <span>
                                📁
                                ${escapeHTML(
                                    ticket.category
                                )}
                            </span>

                            <span>
                                🕒
                                ${formatDate(
                                    ticket.createdAt
                                )}
                            </span>

                        </div>



                        <div
                            class="admin-ticket-actions"
                        >

                            <button
                                class="profile-btn"
                                onclick="
                                    openAdminTicket(
                                        '${escapeHTML(ticket.id)}'
                                    )
                                "
                            >
                                👁️ مشاهده
                            </button>


                            ${
                                ticket.status === "closed"

                                ?

                                `
                                <button
                                    class="profile-btn admin-reopen-btn"
                                    onclick="
                                        changeTicketStatus(
                                            '${escapeHTML(ticket.id)}',
                                            'open'
                                        )
                                    "
                                >
                                    🔓 بازکردن
                                </button>
                                `

                                :

                                `
                                <button
                                    class="
                                        profile-btn
                                        admin-close-btn
                                    "
                                    onclick="
                                        changeTicketStatus(
                                            '${escapeHTML(ticket.id)}',
                                            'closed'
                                        )
                                    "
                                >
                                    🔒 بستن
                                </button>
                                `
                            }

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


/* =========================================================
   OPEN TICKET
========================================================= */

function openAdminTicket(id) {

    window.location.href =
        "admin-ticket-view.html?id=" +
        encodeURIComponent(id);

}


/* =========================================================
   CHANGE STATUS
========================================================= */

function changeTicketStatus(
    id,
    newStatus
) {


    const tickets =
        getTickets();


    const index =
        tickets.findIndex(
            function(ticket) {

                return normalizeId(
                    ticket.id
                )
                ===
                normalizeId(id);

            }
        );


    if (index === -1) {

        alert(
            "تیکت پیدا نشد."
        );

        return;

    }


    tickets[index].status =
        newStatus;


    tickets[index].updatedAt =
        new Date().toISOString();


    saveTickets(
        tickets
    );


    renderTickets();

}


/* =========================================================
   EVENTS
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderTickets
    );

}


if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        renderTickets
    );

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderTickets();

    }
);