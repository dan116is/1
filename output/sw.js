const CACHE='cis-v2';
const ASSETS=['./mobile.html','./manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('coingecko'))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
