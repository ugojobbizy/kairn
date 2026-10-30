// Service worker de l'espace client Kairn (30/10/2026) : affiche les notifications de nouveaux contacts
// envoyées par api/livraison.js, et ouvre l'espace au toucher. Aucun cache : l'espace reste toujours à jour.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Nouveau contact à appeler', {
    body: d.body || 'Ouvrez votre espace Kairn.',
    icon: '/logo-192.png',
    badge: '/favicon-96.png',
    tag: 'kairn-contacts',
    renotify: true,
    data: { url: d.url || '/espace' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/espace';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
    const w = wins.find((c) => c.url.includes('/espace'));
    if (w) { w.focus(); return w.navigate ? w.navigate(url) : null; }
    return self.clients.openWindow(url);
  }));
});
