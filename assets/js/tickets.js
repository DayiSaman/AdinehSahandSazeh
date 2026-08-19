/* =========================================================
   ADINEH SAHAND SAZEH
   TICKETS SYSTEM
========================================================= */

const TICKETS_KEY = "tickets";

/* =========================================================
   USER
========================================================= */

let user = null;

try {
    user = JSON.parse(localStorage.getItem("user"));
} catch (error) {
    user = null;
}

if (!user) {
    window.location.href = "login.html";
}


/* =========================================================
   HELPERS
========================================================= */

function getTickets() {

    try {

        const data = localStorage.getItem(TICKETS_KEY);

        if (!data) {
            return [];
        }

        const tickets = JSON.parse(data);

        return Array.isArray(tickets) ? tickets : [];

    } catch (error) {

        console.error("Tickets read error:", error);

        return [];

    }
}


function saveTickets(tickets) {

    localStorage.setItem(
        TICKETS_KEY,
        JSON.stringify(tickets)
    );

}


function generateTicketId() {

    return Date.now().toString();

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

    const d = new Date(date);

    if (isNaN(d.getTime())) {
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


/* =========================================================
   NORMALIZE ID
========================================================= */

function normalizeId(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim();

}


/* =========================================================
   FIND TICKET
========================================================= */

function findTicketById(id) {

    const wantedId = normalizeId(id);

    if (!wantedId) {
        return null;
    }

    const tickets = getTickets();

    const ticket = tickets.find(function (item) {

        return normalizeId(item.id) === wantedId;

    });

    return ticket || null;

}


/* =========================================================
   GET TICKET ID FROM URL
========================================================= */

function getTicketIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return normalizeId(
        params.get("id")
    );

}


/* =========================================================
   GET CURRENT USERNAME
========================================================= */

function getCurrentUsername() {

    return String(
        user?.username || ""
    )
        .trim()
        .toLowerCase();

}


/* =========================================================
   CHECK OWNER
========================================================= */

function isTicketOwner(ticket) {

    if (!ticket || !user) {
        return false;
    }

    const currentUsername =
        getCurrentUsername();

    const ticketUsername =
        String(
            ticket.username || ""
        )
            .trim()
            .toLowerCase();


    /* username */

    if (
        currentUsername &&
        ticketUsername &&
        currentUsername === ticketUsername
    ) {

        return true;

    }


    /* phone fallback */

    const currentPhone =
        String(
            user.phone || ""
        ).trim();

    const ticketPhone =
        String(
            ticket.phone || ""
        ).trim();


    if (
        currentPhone &&
        ticketPhone &&
        currentPhone === ticketPhone
    ) {

        return true;

    }


    return false;

}


/* =========================================================
   CREATE TICKET
========================================================= */

function initCreateTicket() {

    const form =
        document.getElementById(
            "createTicketForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const title =
                document
                    .getElementById("ticketTitle")
                    .value
                    .trim();


            const category =
                document
                    .getElementById("ticketCategory")
                    .value
                    .trim();


            const message =
                document
                    .getElementById("ticketMessage")
                    .value
                    .trim();


            if (title.length < 3) {

                alert(
                    "عنوان تیکت باید حداقل ۳ کاراکتر باشد."
                );

                return;

            }


            if (!category) {

                alert(
                    "لطفاً دسته‌بندی تیکت را انتخاب کنید."
                );

                return;

            }


            if (message.length < 5) {

                alert(
                    "متن تیکت باید حداقل ۵ کاراکتر باشد."
                );

                return;

            }


            const tickets =
                getTickets();


            const now =
                new Date().toISOString();


            const ticket = {

                id:
                    generateTicketId(),

                title:
                    title,

                category:
                    category,

                status:
                    "open",

                username:
                    user.username || "",

                phone:
                    user.phone || "",

                firstname:
                    user.firstname || "",

                lastname:
                    user.lastname || "",

                createdAt:
                    now,

                updatedAt:
                    now,

                messages: [

                    {

                        id:
                            Date.now(),

                        sender:
                            "user",

                        username:
                            user.username || "",

                        message:
                            message,

                        createdAt:
                            now

                    }

                ]

            };


            tickets.push(ticket);

            saveTickets(tickets);


            alert(
                "تیکت با موفقیت ایجاد شد."
            );


            window.location.href =
                "ticket-view.html?id=" +
                encodeURIComponent(ticket.id);

        }
    );

}


/* =========================================================
   TICKETS LIST
========================================================= */

function initTicketsList() {

    const container =
        document.getElementById(
            "ticketsList"
        );

    if (!container) {
        return;
    }


    const tickets =
        getTickets();


    const currentUsername =
        getCurrentUsername();


    const currentPhone =
        String(
            user?.phone || ""
        ).trim();


    const myTickets =
        tickets
            .filter(function (ticket) {

                const ticketUsername =
                    String(
                        ticket.username || ""
                    )
                        .trim()
                        .toLowerCase();


                const ticketPhone =
                    String(
                        ticket.phone || ""
                    ).trim();


                return (
                    (
                        currentUsername &&
                        ticketUsername &&
                        currentUsername === ticketUsername
                    )
                    ||
                    (
                        currentPhone &&
                        ticketPhone &&
                        currentPhone === ticketPhone
                    )
                );

            })
            .sort(function (a, b) {

                return (
                    new Date(
                        b.updatedAt ||
                        b.createdAt
                    )
                    -
                    new Date(
                        a.updatedAt ||
                        a.createdAt
                    )
                );

            });


    if (myTickets.length === 0) {

        container.innerHTML = `

            <div class="tickets-empty">

                <div class="tickets-empty-icon">
                    🎫
                </div>

                <h3>
                    هنوز هیچ تیکتی ایجاد نکرده‌اید
                </h3>

                <p>
                    اگر به پشتیبانی نیاز دارید،
                    می‌توانید یک تیکت جدید ایجاد کنید.
                </p>

                <a
                    href="create-ticket.html"
                    class="profile-btn"
                >
                    ➕ ایجاد اولین تیکت
                </a>

            </div>

        `;

        return;

    }


    container.innerHTML =

        myTickets
            .map(function (ticket) {

                return `

                    <div class="ticket-card">

                        <div class="ticket-card-top">

                            <div>

                                <span class="ticket-number">
                                    #${escapeHTML(ticket.id)}
                                </span>

                                <h3>
                                    ${escapeHTML(ticket.title)}
                                </h3>

                            </div>


                            <span
                                class="ticket-status ${getStatusClass(ticket.status)}"
                            >
                                ${getStatusText(ticket.status)}
                            </span>

                        </div>


                        <div class="ticket-meta">

                            <span>
                                📁
                                ${escapeHTML(ticket.category)}
                            </span>

                            <span>
                                🕒
                                ${formatDate(ticket.createdAt)}
                            </span>

                        </div>


                        <div class="ticket-card-footer">

                            <a
                                href="ticket-view.html?id=${encodeURIComponent(ticket.id)}"
                                class="profile-btn"
                            >
                                👁️ مشاهده تیکت
                            </a>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* =========================================================
   GET TICKET FROM URL
========================================================= */

function getTicketFromURL() {

    const id =
        getTicketIdFromURL();


    if (!id) {
        return null;
    }


    return findTicketById(id);

}


/* =========================================================
   TICKET VIEW
========================================================= */

function initTicketView() {

    const details =
        document.getElementById(
            "ticketDetails"
        );


    if (!details) {
        return;
    }


    const id =
        getTicketIdFromURL();


    console.log(
        "Ticket ID:",
        id
    );


    const ticket =
        findTicketById(id);


    console.log(
        "Ticket:",
        ticket
    );


    console.log(
        "All tickets:",
        getTickets()
    );


    if (!ticket) {

        details.innerHTML = `

            <div class="ticket-not-found">

                <div class="ticket-not-found-icon">
                    ⚠️
                </div>

                <h2>
                    تیکت پیدا نشد
                </h2>

                <p>
                    تیکتی با این شماره پیدا نشد.
                </p>

                <a
                    href="tickets.html"
                    class="profile-btn"
                >
                    🎫 بازگشت به تیکت‌ها
                </a>

            </div>

        `;

        return;

    }


    if (!isTicketOwner(ticket)) {

        details.innerHTML = `

            <div class="ticket-not-found">

                <div class="ticket-not-found-icon">
                    🔒
                </div>

                <h2>
                    دسترسی غیرمجاز
                </h2>

                <p>
                    این تیکت متعلق به حساب کاربری شما نیست.
                </p>

                <a
                    href="tickets.html"
                    class="profile-btn"
                >
                    🎫 بازگشت به تیکت‌ها
                </a>

            </div>

        `;

        return;

    }


    details.innerHTML = `

        <div class="ticket-view-header">

            <div>

                <span class="ticket-number">
                    تیکت #${escapeHTML(ticket.id)}
                </span>

                <h1>
                    ${escapeHTML(ticket.title)}
                </h1>

            </div>


            <span
                class="ticket-status ${getStatusClass(ticket.status)}"
            >
                ${getStatusText(ticket.status)}
            </span>

        </div>


        <div class="ticket-view-info">

            <div>

                <span>
                    دسته‌بندی
                </span>

                <strong>
                    📁
                    ${escapeHTML(ticket.category)}
                </strong>

            </div>


            <div>

                <span>
                    ایجاد شده
                </span>

                <strong>
                    🕒
                    ${formatDate(ticket.createdAt)}
                </strong>

            </div>

        </div>

    `;


    renderMessages(ticket);

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages(ticket) {

    const container =
        document.getElementById(
            "ticketMessages"
        );


    if (!container) {
        return;
    }


    const messages =
        Array.isArray(ticket.messages)
            ? ticket.messages
            : [];


    if (messages.length === 0) {

        container.innerHTML = `

            <div class="ticket-no-messages">
                هنوز پیامی وجود ندارد.
            </div>

        `;

        return;

    }


    container.innerHTML =

        messages
            .map(function (message) {

                const isUser =
                    message.sender === "user";


                return `

                    <div
                        class="ticket-message ${
                            isUser
                                ? "ticket-message-user"
                                : "ticket-message-support"
                        }"
                    >

                        <div class="ticket-message-head">

                            <strong>
                                ${
                                    isUser
                                        ? "👤 شما"
                                        : "🎧 پشتیبانی"
                                }
                            </strong>

                            <span>
                                ${formatDate(message.createdAt)}
                            </span>

                        </div>


                        <div class="ticket-message-body">

                            ${escapeHTML(
                                message.message
                            ).replace(
                                /\n/g,
                                "<br>"
                            )}

                        </div>

                    </div>

                `;

            })
            .join("");


    container.scrollTop =
        container.scrollHeight;

}


/* =========================================================
   REPLY
========================================================= */

function initReply() {

    const form =
        document.getElementById(
            "replyTicketForm"
        );


    if (!form) {
        return;
    }


    const ticket =
        getTicketFromURL();


    if (!ticket) {

        form.style.display =
            "none";

        return;

    }


    if (!isTicketOwner(ticket)) {

        form.style.display =
            "none";

        return;

    }


    if (ticket.status === "closed") {

        form.innerHTML = `

            <div class="ticket-closed-message">

                🔒 این تیکت بسته شده است و
                امکان ارسال پاسخ وجود ندارد.

            </div>

        `;

        return;

    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                document.getElementById(
                    "replyMessage"
                );


            if (!input) {
                return;
            }


            const message =
                input.value.trim();


            if (message.length < 2) {

                alert(
                    "متن پاسخ را وارد کنید."
                );

                return;

            }


            const tickets =
                getTickets();


            const index =
                tickets.findIndex(
                    function (item) {

                        return (
                            normalizeId(item.id)
                            ===
                            normalizeId(ticket.id)
                        );

                    }
                );


            if (index === -1) {

                alert(
                    "تیکت پیدا نشد."
                );

                return;

            }


            if (
                !isTicketOwner(
                    tickets[index]
                )
            ) {

                alert(
                    "دسترسی غیرمجاز."
                );

                return;

            }


            const now =
                new Date().toISOString();


            if (
                !Array.isArray(
                    tickets[index].messages
                )
            ) {

                tickets[index].messages = [];

            }


            tickets[index].messages.push({

                id:
                    Date.now(),

                sender:
                    "user",

                username:
                    user.username || "",

                message:
                    message,

                createdAt:
                    now

            });


            tickets[index].updatedAt =
                now;


            tickets[index].status =
                "open";


            saveTickets(tickets);


            input.value = "";


            initTicketView();

        }
    );

}


/* =========================================================
   PAGE INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initCreateTicket();

        initTicketsList();

        initTicketView();

        initReply();

    }
);