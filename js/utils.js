/* ==========================================================================
   utils.js — small helpers shared by every module
   ========================================================================== */
(function (global) {
  'use strict';

  var U = {};

  /* ---------- dom ---------- */
  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  U.on = function (target, type, fn, opts) {
    target.addEventListener(type, fn, opts || false);
    return function () { target.removeEventListener(type, fn, opts || false); };
  };

  /* ---------- math ---------- */
  U.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.inv = function (a, b, v) { return b === a ? 0 : (v - a) / (b - a); };
  U.map = function (v, a, b, c, d) { return U.lerp(c, d, U.clamp(U.inv(a, b, v), 0, 1)); };
  U.rand = function (a, b) { return a + Math.random() * (b - a); };
  U.randInt = function (a, b) { return Math.floor(U.rand(a, b + 1)); };
  U.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  U.TAU = Math.PI * 2;

  /* Frame-rate independent smoothing: approaches target at a fixed
     half-life regardless of how long the frame took. */
  U.damp = function (current, target, smoothing, dt) {
    return U.lerp(current, target, 1 - Math.pow(smoothing, dt));
  };

  /* shortest signed angle difference */
  U.angleDiff = function (a, b) {
    var d = (b - a) % U.TAU;
    if (d > Math.PI) d -= U.TAU;
    if (d < -Math.PI) d += U.TAU;
    return d;
  };

  /* ---------- easing ---------- */
  U.ease = {
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    outQuint: function (t) { return 1 - Math.pow(1 - t, 5); },
    inOutCubic: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outBack: function (t) { var c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };

  /* ---------- deterministic value noise (1D + 2D) ---------- */
  function hash(n) { var s = Math.sin(n) * 43758.5453123; return s - Math.floor(s); }
  U.noise1 = function (x) {
    var i = Math.floor(x), f = x - i;
    var u = f * f * (3 - 2 * f);
    return U.lerp(hash(i), hash(i + 1), u) * 2 - 1;
  };
  U.noise2 = function (x, y) {
    var ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy;
    var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    var a = hash(ix + iy * 57), b = hash(ix + 1 + iy * 57);
    var c = hash(ix + (iy + 1) * 57), d = hash(ix + 1 + (iy + 1) * 57);
    return U.lerp(U.lerp(a, b, ux), U.lerp(c, d, ux), uy) * 2 - 1;
  };

  /* ---------- colour ---------- */
  U.hsl = function (h, s, l, a) {
    return 'hsla(' + h.toFixed(1) + ',' + s.toFixed(1) + '%,' + l.toFixed(1) + '%,' + (a == null ? 1 : a) + ')';
  };
  U.mixHsl = function (c1, c2, t) {
    return [U.lerp(c1[0], c2[0], t), U.lerp(c1[1], c2[1], t), U.lerp(c1[2], c2[2], t)];
  };

  /* ---------- timing ---------- */
  U.throttle = function (fn, ms) {
    var last = 0, timer = null, lastArgs = null;
    return function () {
      var now = Date.now(); lastArgs = arguments;
      if (now - last >= ms) { last = now; fn.apply(null, lastArgs); }
      else if (!timer) {
        timer = setTimeout(function () { timer = null; last = Date.now(); fn.apply(null, lastArgs); }, ms - (now - last));
      }
    };
  };
  U.debounce = function (fn, ms) {
    var t = null;
    return function () {
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, ms);
    };
  };
  U.raf = function (fn) { return requestAnimationFrame(fn); };

  /* ---------- device / preferences ---------- */
  U.prefersReducedMotion = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  U.isTouch = function () {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  };
  U.isSmall = function () { return window.innerWidth < 760; };

  /* ---------- canvas ---------- */
  /* Sizes a canvas to its CSS box with a capped DPR and returns {w,h,dpr}. */
  U.fitCanvas = function (canvas, maxDpr) {
    var dpr = Math.min(window.devicePixelRatio || 1, maxDpr || 2);
    var r = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w: w, h: h, dpr: dpr, ctx: ctx };
  };

  /* ---------- observers ---------- */
  U.inView = function (node, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return function () {}; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { cb(e.isIntersecting, e); });
    }, opts || { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    io.observe(node);
    return function () { io.disconnect(); };
  };

  /* ---------- misc ---------- */
  U.formatNum = function (n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  U.uid = (function () { var i = 0; return function (p) { return (p || 'id') + '-' + (++i); }; })();

  global.U = U;
})(window);
