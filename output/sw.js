const CACHE='cis-v5';
const ASSETS=['./index.html','./trader.html','./polymarket.html','./manifest.json'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('binance')||e.request.url.includes('coingecko')||e.request.url.includes('polymarket')||e.request.url.includes('alternative.me')||e.request.url.includes('polygon-rpc')||e.request.url.includes('moonpay')||e.request.url.includes('ethers'))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
