// shell cached; desk_state.json is network-first so a refresh always pulls fresh data
const V = "rug-desk-v1", SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.pathname.endsWith("desk_state.json")) {
    e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => { const c = r.clone(); caches.open(V).then(x => x.put("desk_state.json", c)); return r; })
      .catch(() => caches.match("desk_state.json")));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
