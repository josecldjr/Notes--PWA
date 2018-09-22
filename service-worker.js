
let cacheName = 'notes-son.v.1.0.0';
let filesToCache = [
    './',
    'index.html',
    'css/colors.css',
    'css/styles.css',
    'js/array.observe.polyfill.js',
    'js/object.observe.polyfill.js',
    'js/scripts.js', 
];

self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(cacheName)
        .then(function(cache){
            console.log('chacning files');
            return cache.addAll(filesToCache);

            
        })
        .catch(function(e){
            console.log('error', e);          
        })
    );
});

self.addEventListener('activate', function(e){
    console.log('Service worker Activate');
    e.waitUntil(
            caches.keys().then(function(keyList){
                return Promise.all(keyList.map(function(key){
                    if (key !== cacheName){
                        console.log('removing old cache');
                        
                        return caches.delete(key);
                    }
                }));
            })  
    );

});

self.addEventListener('fetch', function(e){
    console.log('Fetching', e.request.url);
    e.respondWith(
        caches.match(e.request)
        .then(function(response){
            return response || fetch(e.request)
        })
    )
});