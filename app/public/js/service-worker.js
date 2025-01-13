"use strict";


// * ----- PWA ----- *
self.addEventListener("fetch", (event) => {
    // Redirect all requests
    event.respondWith(fetch(event.request));
});


// * ----- NOTIFICATIONS ----- *
self.addEventListener('push', (event) => {
    // Build notification
    const payload = event.data.json();
    const notificationTitle = payload.title;
    const notificationOptions = {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        data: {
            url: payload.url
        }
    };

    // Show notification
    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});

self.addEventListener('notificationclick', (event) => {
    const notification = event.notification;
    const url = notification.data.url;

    // Close notification
    notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus window if it was open
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open URL in a new window
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
