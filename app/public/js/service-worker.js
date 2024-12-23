"use strict";

self.addEventListener("fetch", (event) => {
    // Redirect all requests
    event.respondWith(fetch(event.request));
});
