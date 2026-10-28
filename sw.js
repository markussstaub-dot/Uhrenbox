// Uhrenbox: hält die App offline bereit. Deine Daten liegen getrennt im Browser-Speicher (IndexedDB) und werden hier nie angefasst.
// Nach JEDER Änderung an index.html (oder Icons/Manifest) VERSION hochzählen – sonst bekommen installierte Apps die neue Fassung nicht.
const VERSION = 'uhrenbox-v3';
const FILES = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './shortcut-messung.png', './shortcut-tragen.png', './shortcut-foto.png',
];

// frisch vom Server holen (nicht aus dem HTTP-Cache), damit die neue Version wirklich vollständig ist
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
  // kein skipWaiting hier: die neue Version übernimmt erst, wenn in der App „Neu laden“ getippt wird
});
self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Sofort aus dem Speicher antworten (auch bei schlechtem Netz kein Warten), nur bei Fehlenden ans Netz.
// Nur eigene Dateien; alles Fremde läuft am Service Worker vorbei.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(hit => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
});
