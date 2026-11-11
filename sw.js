/* MotionSentry service worker
   - Precaches the whole app so it runs with no connection.
   - Serves from cache instantly, then refreshes the cache from the network
     in the background (stale-while-revalidate), so the next launch is current.
   - Bump VERSION on every release: the page sees the new worker and offers a reload. */
const VERSION = 'v3.0.1';
const CACHE = `motionsentry-${VERSION}`;
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-192.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './fonts/barlow-300.woff2',
  './fonts/barlow-400.woff2',
  './fonts/barlow-600.woff2',
  './fonts/barlowcond-600.woff2',
  './fonts/barlowcond-700.woff2',
  './fonts/sharetechmono-400.woff2',
];

self.addEventListener('install', e => {
  // cache: 'reload' bypasses the HTTP cache so a new version never precaches stale files
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('motionsentry-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // navigations (incl. ?query start URLs) all resolve to the app shell
    const key = req.mode === 'navigate' ? './index.html' : req;
    const cached = await cache.match(key, { ignoreSearch: req.mode === 'navigate' });
    const network = fetch(req).then(res => {
      if (res.ok && res.type === 'basic') cache.put(key, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    return (await network) || new Response('Offline', { status: 503, statusText: 'Offline' });
  })());
});
