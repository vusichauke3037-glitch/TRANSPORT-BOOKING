const CACHE='makhanani-v12-limpopo';
const FILES=['./','./index.html','./manifest.json'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.map(x=>{if(x!=CACHE) return caches.delete(x)}))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
    if(e.request.method==='GET' && e.request.url.startsWith('http')){
      caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
    }
    return res;
  }).catch(()=>caches.match('./index.html'))));
});
