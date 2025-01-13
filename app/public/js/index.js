"use strict"

let swRegistration = null;

// ** ----- Register ServiceWorker ----- **
if ("serviceWorker" in navigator) {
    $(window).on("load", async () => {
        try {
            swRegistration = await navigator.serviceWorker.register("/js/service-worker.js");
            console.log("Service worker registered");

            await initializeNotifications();
        } catch (err) {
            console.error("Service worker registration failed", err);
        }
    });
}

// * ----- ENCODE TO UINT8ARRAY ----- *
function urlBase64ToUint8Array(base64String) {
    const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    
    const uint8Array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        uint8Array[i] = binary.charCodeAt(i);
    }

    return uint8Array;
}

// * ----- CREATE SUBSCRIPTION ----- *
async function createSubscription() {
    let subscription;
    
    // Get VAPID KEY
    const response = await fetch("/notifications/public-vapid-key", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error("Failed to get PUBLIC_VAPID_KEY: ", response.statusText);
    }

    // Subscribe device
    const data = await response.json();
    try {
        subscription = await swRegistration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(data.publicVapidKey)
        });        
    }
    catch (error) {
        if (error.name == "NotAllowedError") {
            console.log("Error creating subscription: User did not accept browser permissions");
            alert("You need to accept browsers permissions");
        }
        throw new Error(error);
    }

    return subscription;
}

// * ----- INIT NOTIFICATIONS ----- *
async function initializeNotifications() {
    const notificationsAllowed = $("#button-notification-permissions").data("allowed");
    const pgphNotif = $("#p-notif");
    const messages = pgphNotif.data("messages");
    let message;

    // Notifications disabled
    if (!notificationsAllowed) {
        message = messages.disabled;
        $("#p-notif small").text(message);
    }
    // Notifications allowed
    else {
        // Permissions granted
        if (Notification.permission == "granted") {
            message = messages.granted;
            $("#p-notif small").text(message);
            // Check if permissions have been manually updated
            try {
                let existingSubscription = await swRegistration.pushManager.getSubscription();
                if (!existingSubscription) {
                    existingSubscription = await createSubscription();
                    let hiddenForm = $("<form>", {
                        method: "POST",
                        action: "/notifications/subscription",
                        style: "display: none;"
                    });

                    $("<input>", {
                        type: "hidden",
                        name: "subscription",
                        value: JSON.stringify(existingSubscription)
                    }).appendTo(hiddenForm);

                    $("body").append(hiddenForm);
                    hiddenForm.submit();
                }
            }
            catch (error) {
                console.error("ERROR: Error creating subscription for this device: ", error);
            }
        }
        // Permissions denied
        else if (Notification.permission == "denied") {
            message = messages.denied;
            $("#p-notif small").text(message);
        }
        // Permissions default
        else {
            // Create link for POST /subscriptions
            let linkForm = $("<form>", {
                method: "post",
                action: "/notifications/subscription",
                style: "display: inline;"
            });

            let linkRegex = /\$a\{([^}]+)\}/;
            let linkMatch = messages.default.match(linkRegex);
            let link = $("<p>", {
                text: linkMatch[1],
                css: {
                    display: "inline",
                    color: "#0B83AA",
                    textDecoration: "underline",
                    cursor: "pointer"
                }
            });
            linkForm.append(link);

            // On click
            link.on("click", async (event) => {
                try {
                    // Subscribe device
                    let newSubscription = await createSubscription();

                    // Add subscription to form
                    $("<input>")
                        .attr("type", "hidden")
                        .attr("name", "subscription")
                        .val(JSON.stringify(newSubscription))
                        .appendTo(linkForm);

                    linkForm.submit();
                }
                catch (error) {
                    console.error("ERROR: Error creating subscription for this device: ", error);
                }
            });

            let [before, after] = messages.default.split(linkMatch[0]);
            $("#p-notif small").append(
                $("<span>").text(before),
                linkForm,
                $("<span>").text(after)
            );
        }
    }
}

$(() => {
    // * ----- HAMBURGER MENU ----- *
    const buttonHamburger = $("#button-hamburger");
    const divHamburger = $("#div-hamburger");
    
    buttonHamburger.on("click", () => {
        buttonHamburger.toggleClass("active");
        divHamburger.toggleClass("collapsed-menu");
    });
    
    // * ----- LOGOUT ----- *
    const logout = $("#form-logout");
    logout.on("click", () => {
        logout.submit();
    });

    // * ----- NOTIFICATIONS ----- *
    const buttonNotificationPermissions = $("#button-notification-permissions");
    const notificationsAllowed = buttonNotificationPermissions.data("allowed");
    const formNotificationPermissions = $("#form-notification-permissions");
    // * --- ALLOW/BLOCK --- *
    buttonNotificationPermissions.on("click", async () => {
        // Create common request
        $("<input>")
        .attr("type", "hidden")
        .attr("name", "notificationsAllowed")
        .val(!notificationsAllowed)
        .appendTo(formNotificationPermissions);

        // If notifications are being allowed, create and add new subscription to form (if necessary)
        try {
            if (!notificationsAllowed) {
                if (!swRegistration) {
                    console.error("Service Worker not registered yet");
                    return;
                }

                // Check if there's already a subscription for the device
                let subscription = await swRegistration.pushManager.getSubscription();
                if (!subscription) {
                    subscription = await createSubscription();

                    // Add subscription to form
                    $("<input>")
                    .attr("type", "hidden")
                    .attr("name", "subscription")
                    .val(JSON.stringify(subscription))
                    .appendTo(formNotificationPermissions);
                }
            }
            
            // Send form
            formNotificationPermissions.submit();
        }
        catch (error) {
            console.error("ERROR: Error creating subscription for this device: ", error);
        }
    });

    // * --- SEND --- *
    const formSendNotification = $("#form-send-notification");
    const buttonSendNotification = $("#button-send-notification");
    buttonSendNotification.on("click", () => {
        formSendNotification.submit();
    });
});
