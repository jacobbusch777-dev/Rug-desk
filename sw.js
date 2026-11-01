// shell cached; desk_state.json + options_state.json are network-first so a refresh always pulls fresh data
const V = "rug-desk-v12", SHELL = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  const j = ["desk_state.json", "options_state.json", "live.json", "kronos_state.json"].find(n => u.pathname.endsWith(n));
  if (j) {
    e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(j, c)); return r; })
      .catch(() => caches.match(j)));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
