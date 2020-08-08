self.addEventListener("install", (event) => {
    console.log("'onInstall' handler starts caching.");
    event.waitUntil(
        // load remote files to local cache
        caches.open("static-v2")
            .then((cache) => {
                return cache.addAll(
                    [
                        "./cached/file1.txt",
                        "./cached/file2.txt",
                        "./cached/file3.txt",
                        "./index.html",
                        "./pwa.webmanifest"
                    ]
                );
            })
            .then(() => {
                console.log("Cache is loaded.");
            })
            .then(() => {
                // emulate cache from previous version of service worker
                return caches.open("static-v1")
                    .then((cache) => {
                        return cache.addAll(
                            [
                                "./index.html",
                                "./pwa.webmanifest"
                            ]
                        );
                    })
                    .then(() => {
                        console.log("Deprecated cache is emulated.");
                    })
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("'onActivate' handler starts cache clean up.");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // delete all caches except "static-v2"
                    if (cacheName !== "static-v2") {
                        console.log("Removing cache '%s'...", cacheName);
                        return caches.delete(cacheName)
                            .then(() => {
                                console.log(`Cache '${cacheName}' is removed.`);
                            });
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("'onFetch' handler starts fetching (%s).", event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
            })
    );
});

self.addEventListener("push", (event) => {
    console.log("push");
});

self.addEventListener("notificationclick", (event) => {
    console.log("notificationclick");
});

self.addEventListener("notificationclose", (event) => {
    console.log("notificationclose");
});

self.addEventListener("sync", (event) => {
    console.log("sync");
});

self.addEventListener("canmakepayment", (event) => {
    console.log("canmakepayment");
});

self.addEventListener("paymentrequest", (event) => {
    console.log("paymentrequest");
});

