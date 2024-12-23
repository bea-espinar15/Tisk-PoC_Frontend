"use strict"

if ("serviceWorker" in navigator) {
    $(window).on("load", async () => {
        try {
            const sw = await navigator.serviceWorker.register("/js/service-worker.js");
            console.log("Service worker registered");
        } catch (err) {
            console.error("Service worker registration failed", err);
        }
    });
}
