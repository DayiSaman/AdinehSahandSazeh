"use strict";

/* =========================================================
   ADINEH SAHAND SAZEH
   ADMIN TICKET VIEW
   LOCALSTORAGE VERSION
========================================================= */

const TICKETS_KEY = "tickets";
const ADMINS_KEY = "admins";

let currentUser = null;


/* =========================================================
   CURRENT USER
========================================================= */

try {

    currentUser =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

} catch (error) {

    currentUser = null;

}


/* =========================================================
   HELPERS
========================================================= */

function normalize(value) {

    return String(
        value ?? ""
    ).trim();

}


function normalizeLower(value) {

    return normalize(value).toLowerCase();

}


function escapeHTML(value) {

    return normalize(value)

        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString(
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


/* =========================================================
   STORAGE
========================================================= */

function getTickets() {

    try {

        const raw =
            localStorage.getItem(
                TICKETS_KEY
            );

        if (!raw) {
            return [];
        }

        const parsed =
            JSON.parse(raw);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.error(
            "TICKETS READ ERROR:",
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


/* =========================================================
   ADMINS
========================================================= */

function getAdmins() {

    try {

        const raw =
            localStorage.getItem(
                ADMINS_KEY
            );

        if (!raw) {
            return ["@Owner"];
        }

        const admins =
            JSON.parse(raw);

        if (
            Array.isArray(admins) &&
            admins.length
        ) {
            return admins;
        }

    } catch (error) {

        console.error(
            "ADMINS READ ERROR:",
            error
        );

    }

    return ["@Owner"];

}


function isAdmin() {

    if (!currentUser) {
        return false;
    }

    const username =
        normalizeLower(
            currentUser.username
        );

    if (!username) {
        return false;
    }

    return getAdmins().some(
        admin =>
            normalizeLower(admin)
            ===
            username
    );

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

const details =
    document.getElementById(
        "adminTicketDetails"
    );


const messagesBox =
    document.getElementById(
        "adminTicketMessages"
    );


const replyBox =
    document.getElementById(
        "adminReplyArea"
    );


/* =========================================================
   URL
========================================================= */

function getTicketIdFromURL() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return normalize(
        params.get("id")
    );

}


/* =========================================================
   TICKET ID
========================================================= */

function getTicketId(ticket) {

    if (!ticket) {
        return "";
    }

    return normalize(
        ticket.id ??
        ticket.ticketId ??
        ticket._id ??
        ticket.number ??
        ticket.ticketNumber
    );

}


/* =========================================================
   FIND TICKET
========================================================= */

function findTicketById(id) {

    const wanted =
        normalize(id);

    if (!wanted) {
        return null;
    }

    const tickets =
        getTickets();

    return (
        tickets.find(
            ticket =>
                getTicketId(ticket)
                ===
                wanted
        )
        || null
    );

}


/* =========================================================
   TITLE
========================================================= */

function getTicketTitle(ticket) {

    return normalize(
        ticket.subject ||
        ticket.title ||
        "بدون عنوان"
    );

}


/* =========================================================
   STATUS
========================================================= */

function getStatusText(status) {

    switch (
        normalizeLower(status)
    ) {

        case "pending":
            return "در حال بررسی";

        case "closed":
            return "بسته";

        case "open":
        default:
            return "باز";

    }

}


function getStatusClass(status) {

    switch (
        normalizeLower(status)
    ) {

        case "pending":
            return "ticket-status-pending";

        case "closed":
            return "ticket-status-closed";

        case "open":
        default:
            return "ticket-status-open";

    }

}


/* =========================================================
   HEADER
========================================================= */

function renderHeader(ticket) {

    const firstname =
        normalize(
            ticket.firstname
        );

    const lastname =
        normalize(
            ticket.lastname
        );

    const fullName =
        `${firstname} ${lastname}`.trim();


    details.innerHTML = `

        <div class="admin-ticket-view-header">

            <div>

                <span class="ticket-number">
                    #${escapeHTML(
                        getTicketId(ticket)
                    )}
                </span>

                <h1>
                    ${escapeHTML(
                        getTicketTitle(ticket)
                    )}
                </h1>

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


        <div class="admin-ticket-user-box">

            <h3>
                👤 اطلاعات کاربر
            </h3>

            <div>

                <span>
                    نام
                </span>

                <strong>
                    ${escapeHTML(
                        fullName || "-"
                    )}
                </strong>

            </div>


            <div>

                <span>
                    نام کاربری
                </span>

                <strong>
                    ${escapeHTML(
                        ticket.username || "-"
                    )}
                </strong>

            </div>


            <div>

                <span>
                    موبایل
                </span>

                <strong>
                    ${escapeHTML(
                        ticket.phone || "-"
                    )}
                </strong>

            </div>

        </div>


        <div class="ticket-view-info">

            <div>

                <span>
                    دسته‌بندی
                </span>

                <strong>
                    📁
                    ${escapeHTML(
                        ticket.category || "-"
                    )}
                </strong>

            </div>


            <div>

                <span>
                    تاریخ ایجاد
                </span>

                <strong>
                    🕒
                    ${formatDate(
                        ticket.createdAt
                    )}
                </strong>

            </div>


            <div>

                <span>
                    آخرین بروزرسانی
                </span>

                <strong>
                    🔄
                    ${formatDate(
                        ticket.updatedAt ||
                        ticket.createdAt
                    )}
                </strong>

            </div>

        </div>


        <div class="admin-ticket-status-actions">

            <button
                type="button"
                class="profile-btn"
                onclick="
                    changeTicketStatus(
                        '${escapeHTML(getTicketId(ticket))}',
                        'open'
                    )
                "
            >
                🟢 باز
            </button>


            <button
                type="button"
                class="profile-btn"
                onclick="
                    changeTicketStatus(
                        '${escapeHTML(getTicketId(ticket))}',
                        'pending'
                    )
                "
            >
                🟡 در حال بررسی
            </button>


            <button
                type="button"
                class="profile-btn"
                onclick="
                    changeTicketStatus(
                        '${escapeHTML(getTicketId(ticket))}',
                        'closed'
                    )
                "
            >
                🔴 بستن
            </button>

        </div>

    `;

}


/* =========================================================
   MESSAGES
========================================================= */

function getMessages(ticket) {

    if (
        Array.isArray(
            ticket.messages
        )
    ) {

        return ticket.messages;

    }


    if (
        Array.isArray(
            ticket.replies
        )
    ) {

        return ticket.replies;

    }


    return [];

}


function isAdminMessage(message) {

    const role =
        normalizeLower(
            message.role
        );

    const sender =
        normalizeLower(
            message.sender
        );

    const senderType =
        normalizeLower(
            message.senderType
        );

    return (
        role === "admin" ||
        role === "support" ||
        sender === "admin" ||
        sender === "support" ||
        senderType === "admin" ||
        senderType === "support"
    );

}


function renderMessages(ticket) {

    const messages =
        getMessages(ticket);


    if (!messagesBox) {
        return;
    }


    if (!messages.length) {

        messagesBox.innerHTML = `

            <div class="ticket-no-messages">

                هنوز پیامی در این تیکت وجود ندارد.

            </div>

        `;

        return;

    }


    messagesBox.innerHTML =
        messages
            .map(
                function(message) {

                    const adminMessage =
                        isAdminMessage(
                            message
                        );


                    const senderName =
                        adminMessage
                            ? "🎧 پشتیبانی"
                            : "👤 کاربر";


                    return `

                        <div
                            class="
                                ticket-message
                                ${
                                    adminMessage
                                        ? "ticket-message-support"
                                        : "ticket-message-user"
                                }
                            "
                        >

                            <div
                                class="
                                    ticket-message-head
                                "
                            >

                                <strong>
                                    ${senderName}
                                </strong>

                                <span>
                                    ${formatDate(
                                        message.createdAt
                                    )}
                                </span>

                            </div>


                            <div
                                class="
                                    ticket-message-body
                                "
                            >

                                ${escapeHTML(
                                    message.message
                                ).replace(
                                    /\n/g,
                                    "<br>"
                                )}

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    messagesBox.scrollTop =
        messagesBox.scrollHeight;

}


/* =========================================================
   REPLY BOX
========================================================= */

function renderReply(ticket) {

    if (!replyBox) {
        return;
    }


    if (
        normalizeLower(
            ticket.status
        )
        ===
        "closed"
    ) {

        replyBox.innerHTML = `

            <div class="ticket-closed-message">

                🔒 این تیکت بسته شده است.

                <br><br>

                برای پاسخ دادن ابتدا وضعیت تیکت
                را روی «باز» قرار دهید.

            </div>

        `;

        return;

    }


    replyBox.innerHTML = `

        <form
            id="adminReplyForm"
            class="ticket-reply-form"
        >

            <div class="auth-group">

                <label
                    for="adminReplyMessage"
                >
                    🎧 پاسخ پشتیبانی
                </label>

                <textarea
                    id="adminReplyMessage"
                    rows="5"
                    maxlength="2000"
                    placeholder="پاسخ خود را برای کاربر بنویسید..."
                    required
                ></textarea>

            </div>


            <button
                type="submit"
                class="
                    profile-btn
                    admin-reply-btn
                "
            >
                📤 ارسال پاسخ
            </button>

        </form>

    `;


    const form =
        document.getElementById(
            "adminReplyForm"
        );


    if (form) {

        form.addEventListener(
            "submit",
            sendReply
        );

    }

}


/* =========================================================
   ADMIN REPLY
========================================================= */

function sendReply(event) {

    event.preventDefault();


    const input =
        document.getElementById(
            "adminReplyMessage"
        );


    if (!input) {
        return;
    }


    const text =
        input.value.trim();


    if (text.length < 2) {

        alert(
            "متن پاسخ را وارد کنید."
        );

        return;

    }


    const ticketId =
        getTicketIdFromURL();


    const tickets =
        getTickets();


    const index =
        tickets.findIndex(
            ticket =>
                getTicketId(ticket)
                ===
                ticketId
        );


    if (index === -1) {

        alert(
            "تیکت پیدا نشد."
        );

        return;

    }


    const ticket =
        tickets[index];


    if (
        normalizeLower(
            ticket.status
        )
        ===
        "closed"
    ) {

        alert(
            "این تیکت بسته شده است."
        );

        return;

    }


    if (
        !Array.isArray(
            ticket.messages
        )
    ) {

        ticket.messages = [];

    }


    const createdAt =
        new Date().toISOString();


    /*
       مهم:
       هم role و هم sender را ذخیره می‌کنیم
       تا سمت کاربر و ادمین هر دو درست تشخیص دهند.
    */

    ticket.messages.push({

        id:
            Date.now().toString(),

        sender:
            "admin",

        role:
            "admin",

        senderType:
            "admin",

        username:
            currentUser?.username || "",

        firstname:
            currentUser?.firstname || "",

        lastname:
            currentUser?.lastname || "",

        message:
            text,

        createdAt

    });


    ticket.updatedAt =
        createdAt;


    /*
       بعد از پاسخ ادمین،
       تیکت در انتظار پاسخ کاربر قرار می‌گیرد.
    */

    ticket.status =
        "pending";


    tickets[index] =
        ticket;


    saveTickets(
        tickets
    );


    input.value = "";


    renderHeader(
        ticket
    );

    renderMessages(
        ticket
    );

    renderReply(
        ticket
    );


    alert(
        "پاسخ با موفقیت برای کاربر ثبت شد."
    );

}


/* =========================================================
   CHANGE STATUS
========================================================= */

function changeTicketStatus(
    ticketId,
    status
) {

    const tickets =
        getTickets();


    const wanted =
        normalize(
            ticketId
        );


    const index =
        tickets.findIndex(
            ticket =>
                getTicketId(ticket)
                ===
                wanted
        );


    if (index === -1) {

        alert(
            "تیکت پیدا نشد."
        );

        return;

    }


    tickets[index].status =
        status;


    tickets[index].updatedAt =
        new Date().toISOString();


    saveTickets(
        tickets
    );


    renderHeader(
        tickets[index]
    );

    renderMessages(
        tickets[index]
    );

    renderReply(
        tickets[index]
    );

}


/* =========================================================
   NOT FOUND
========================================================= */

function renderNotFound() {

    if (details) {

        details.innerHTML = `

            <div class="ticket-not-found">

                <div class="ticket-not-found-icon">
                    ⚠️
                </div>

                <h2>
                    تیکت پیدا نشد
                </h2>

                <p>
                    تیکت موردنظر وجود ندارد
                    یا شناسه آن نامعتبر است.
                </p>

                <small>
                    شناسه:
                    ${escapeHTML(
                        getTicketIdFromURL()
                    )}
                </small>

            </div>

        `;

    }


    if (messagesBox) {
        messagesBox.innerHTML = "";
    }


    if (replyBox) {
        replyBox.innerHTML = "";
    }

}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            !currentUser ||
            !isAdmin()
        ) {

            return;

        }


        const ticketId =
            getTicketIdFromURL();


        console.log(
            "ADMIN TICKET ID:",
            ticketId
        );


        const ticket =
            findTicketById(
                ticketId
            );


        console.log(
            "ADMIN FOUND TICKET:",
            ticket
        );


        if (!ticket) {

            renderNotFound();

            return;

        }


        renderHeader(
            ticket
        );


        renderMessages(
            ticket
        );


        renderReply(
            ticket
        );

    }
);