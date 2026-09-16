
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 1,
    "preload": [
      "chunk-IYL22f-Y.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-HM3WsMxE.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/auth/login"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-C1GS2oG_.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/auth/signup"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-CuQ2_ffH.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/auth/forgot-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-BmHbGkr5.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/auth/reset-password"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-D5QcYB5y.js"
    ],
    "route": "/auth/forbidden"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-B3vU0GNZ.js",
      "chunk-BWOIj8kX.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/profile"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-B3vU0GNZ.js",
      "chunk-BWOIj8kX.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/admin"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-C3-GBZis.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js",
      "chunk-DvFAR6XZ.js"
    ],
    "route": "/products"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-CVsTUthA.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/forms"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-BhasK5oP.js",
      "chunk-BWOIj8kX.js",
      "chunk-D2_FotLW.js",
      "chunk-DR20b7hC.js"
    ],
    "route": "/async"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-3EV7ACtJ.js",
      "chunk-BWOIj8kX.js",
      "chunk-DvFAR6XZ.js"
    ],
    "route": "/overlays"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-C6QhvKHm.js",
      "chunk-BWOIj8kX.js"
    ],
    "route": "/frames"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-DIa2xM-5.js",
      "chunk-BWOIj8kX.js"
    ],
    "route": "/edge-cases"
  },
  {
    "renderMode": 1,
    "redirectTo": "/products",
    "route": "/legacy-products"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-wV4pgdy3.js"
    ],
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 875, hash: '6a82e14387a7ff0fe8c298eb63d63eb5385bb1ee9559708f6077653910f7aecf', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1056, hash: '565e2674b80b526b8903f024f4c5ed8b9d2282c1289bf6e8779ed1eea07e660e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-WXZFCRGJ.css': {size: 3797, hash: '+SBbENz+GVU', text: () => import('./assets-chunks/styles-WXZFCRGJ_css.mjs').then(m => m.default)}
  },
};
