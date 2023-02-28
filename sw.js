const cacheVersion = 1;
const addResourcesToCache = async (resources) => {
    const cache = await caches.open('v1');
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open(`hatMat-${cacheVersion}`);
    await cache.put(request, response);
};

const cacheFirst = async ({request, preloadResponsePromise, fallbackUrl}) => {
    // First try to get the resource from the cache
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }

    // Next try to use the preloaded response, if it's there
    const preloadResponse = await preloadResponsePromise;
    if (preloadResponse) {
        console.info('using preload response', preloadResponse);
        putInCache(request, preloadResponse.clone());
        return preloadResponse;
    }

    // Next try to get the resource from the network
    try {
        const responseFromNetwork = await fetch(request);
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        const fallbackResponse = await caches.match(fallbackUrl);
        if (fallbackResponse) {
            return fallbackResponse;
        }
        // when even the fallback response is not available,
        // there is nothing we can do, but we must always
        // return a Response object
        return new Response('Network error happened', {
            status: 408,
            headers: {'Content-Type': 'text/plain'},
        });
    }
};

const enableNavigationPreload = async () => {
    if (self.registration.navigationPreload) {
        // Enable navigation preloads!
        await self.registration.navigationPreload.enable();
    }
};

self.addEventListener('activate', (event) => {
    event.waitUntil(enableNavigationPreload());
});

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        addResourcesToCache([
            './blog/static/css/bootstrap.css',
            './blog/static/css/mdb.css',
            './blog/static/css/mdb.lite.css',
            './blog/static/css/sass/base/_page.scss',
            './blog/static/css/sass/base/_reset.scss',
            './blog/static/css/sass/base/_typography.scss',
            './blog/static/css/sass/components/_actions.scss',
            './blog/static/css/sass/components/_box.scss',
            './blog/static/css/sass/components/_button.scss',
            './blog/static/css/sass/components/_form.scss',
            './blog/static/css/sass/components/_icon.scss',
            './blog/static/css/sass/components/_icons.scss',
            './blog/static/css/sass/components/_image.scss',
            './blog/static/css/sass/components/_list.scss',
            './blog/static/css/sass/components/_row.scss',
            './blog/static/css/sass/components/_section.scss',
            './blog/static/css/sass/components/_table.scss',
            './blog/static/css/sass/components/_tiles.scss',
            './blog/static/css/sass/layout/_footer.scss',
            './blog/static/css/sass/layout/_header.scss',
            './blog/static/css/sass/layout/_main.scss',
            './blog/static/css/sass/layout/_menu.scss',
            './blog/static/css/sass/layout/_wrapper.scss',
            './blog/static/css/sass/libs/_breakpoints.scss',
            './blog/static/css/sass/libs/_functions.scss',
            './blog/static/css/sass/libs/_html-grid.scss',
            './blog/static/css/sass/libs/_mixins.scss',
            './blog/static/css/sass/libs/_vars.scss',
            './blog/static/css/sass/libs/_vendor.scss',
            './blog/static/css/sass/main.scss',
            './blog/static/css/sass/noscript.scss',
            './blog/static/css/webfonts/fa-brands-400.eot',
            './blog/static/css/webfonts/fa-brands-400.svg',
            './blog/static/css/webfonts/fa-brands-400.ttf',
            './blog/static/css/webfonts/fa-brands-400.woff',
            './blog/static/css/webfonts/fa-brands-400.woff2',
            './blog/static/css/webfonts/fa-regular-400.eot',
            './blog/static/css/webfonts/fa-regular-400.svg',
            './blog/static/css/webfonts/fa-regular-400.ttf',
            './blog/static/css/webfonts/fa-regular-400.woff',
            './blog/static/css/webfonts/fa-regular-400.woff2',
            './blog/static/css/webfonts/fa-solid-900.eot',
            './blog/static/css/webfonts/fa-solid-900.svg',
            './blog/static/css/webfonts/fa-solid-900.ttf',
            './blog/static/css/webfonts/fa-solid-900.woff',
            './blog/static/css/webfonts/fa-solid-900.woff2',
            './blog/static/css/fonts/glyphicons-halflings-regular.eot',
            './blog/static/css/fonts/glyphicons-halflings-regular.svg',
            './blog/static/css/fonts/glyphicons-halflings-regular.ttf',
            './blog/static/css/fonts/glyphicons-halflings-regular.woff',
            './blog/static/css/fonts/glyphicons-halflings-regular.woff2',
            './blog/static/css/fonts/lg.eot',
            './blog/static/css/fonts/lg.svg',

            './blog/static/js/basic-upload.js',
            './blog/static/js/bootstrap-tagsinput.js',
            './blog/static/js/bootstrap-tagsinput.min.js',
            './blog/static/js/bootstrap.js',
            './blog/static/js/bootstrap.min.js',
            './blog/static/js/drag-and-drop-upload.js',
            './blog/static/js/form_ajax.js',
            './blog/static/js/jq.js',

            './blog/static/js/jquery.js',
            './blog/static/js/jquery.min.js',
            './blog/static/js/lazysizes.min.js',
            './blog/static/js/mdb.js',
            './blog/static/js/mdb.lite.min.js.map',
            './blog/static/js/mdb.min.js',
            './blog/static/js/mdb.min.js.map',
            './blog/static/js/modal_register.js',

            './blog/static/js/popper.js',
            './blog/static/js/popper.min.js',
            './blog/static/js/addons/datatables-select.min.js',
            './blog/static/js/addons/datatables-select.min.js.map',
            './blog/static/js/addons/datatables-select2.min.js',
            './blog/static/js/addons/datatables-select2.min.js.map',
            './blog/static/js/addons/datatables.min.js',
            './blog/static/js/addons/datatables.min.js.map',
            './blog/static/js/addons/datatables2.min.js',
            './blog/static/js/addons/datatables2.min.js.map',
            './blog/static/js/addons/directives.min.js',
            './blog/static/js/addons/directives.min.js.map',
            './blog/static/js/addons/flag.min.js',
            './blog/static/js/addons/flag.min.js.map',
            './blog/static/js/addons/imagesloaded.pkgd.min.js',
            './blog/static/js/addons/imagesloaded.pkgd.min.js.map',
            './blog/static/js/addons/jquery.zmd.hierarchical-display.min.js',
            './blog/static/js/addons/jquery.zmd.hierarchical-display.min.js.map',
            './blog/static/js/addons/masonry.pkgd.min.js',
            './blog/static/js/addons/masonry.pkgd.min.js.map',
            './blog/static/js/addons/rating.min.js',
            './blog/static/js/addons/rating.min.js.map',
            './blog/static/js/jquery-file-upload/jquery.fileupload.js',
            './blog/static/js/jquery-file-upload/jquery.iframe-transport.js',
            './blog/static/js/jquery-file-upload/vendor/jquery.ui.widget.js',

            './article/static/js/article_form_ajax.js',
            './article/static/js/canvasjs.min.js',
            './article/static/js/graphs.js',

            './blog/static/js/modules/animations-extended.min.js',
            './blog/static/js/modules/animations-extended.min.js.map',
            './blog/static/js/modules/forms-free.min.js',
            './blog/static/js/modules/forms-free.min.js.map',
            './blog/static/js/modules/scrolling-navbar.min.js',
            './blog/static/js/modules/scrolling-navbar.min.js.map',
            './blog/static/js/modules/treeview.min.js',
            './blog/static/js/modules/treeview.min.js.map',
            './blog/static/js/modules/wow.min.js',
            './blog/static/js/p_gallery/modules/lg-autoplay.js',
            './blog/static/js/p_gallery/modules/lg-autoplay.min.js',
            './blog/static/js/p_gallery/modules/lg-fullscreen.js',
            './blog/static/js/p_gallery/modules/lg-fullscreen.min.js',
            './blog/static/js/p_gallery/modules/lg-hash.js',
            './blog/static/js/p_gallery/modules/lg-hash.min.js',
            './blog/static/js/p_gallery/modules/lg-pager.js',
            './blog/static/js/p_gallery/modules/lg-pager.min.js',
            './blog/static/js/p_gallery/modules/lg-share.js',
            './blog/static/js/p_gallery/modules/lg-share.min.js',
            './blog/static/js/p_gallery/modules/lg-thumbnail.js',
            './blog/static/js/p_gallery/modules/lg-thumbnail.min.js',
            './blog/static/js/p_gallery/modules/lg-video.js',
            './blog/static/js/p_gallery/modules/lg-video.min.js',
            './blog/static/js/p_gallery/modules/lg-zoom.js',
            './blog/static/js/p_gallery/modules/lg-zoom.min.js',

            './blog/static/js/p_gallery/lightgallery.js',
            './blog/static/js/p_gallery/lightgallery-all.js',


            './blog/static/s_worker/app.js',

        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request,
            preloadResponsePromise: event.preloadResponse,
            fallbackUrl: '../../templates/blog/post_detail.html',
        })
    );
});