/* ==========================================================================
   East Coast Digital

   Three things happen here and nothing else:
     1. the hero reveal        — a range input drives a clip-path
     2. the coastline rail     — scroll position expressed as a real latitude
     3. one pinned sequence    — the demo build scrubs past, GSAP + ScrollTrigger

   GSAP is only fetched for (3), and only when motion is allowed. Everything
   the page has to say is already said with the script switched off.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (n, a, b) { return n < a ? a : n > b ? b : n; };

  /* ------------------------------------------------------------ 1. reveal */

  (function reveal() {
    var host = document.getElementById('reveal');
    var frame = document.getElementById('reveal-frame');
    var range = document.getElementById('reveal-range');
    if (!host || !frame || !range) return;

    var REST = 38;              // resting seam: more "before" than "after"
    var pos = REST;
    var target = REST;
    var following = false;
    var dragging = false;
    var raf = 0;

    function paint(v) {
      pos = v;
      host.style.setProperty('--pos', v.toFixed(2));
    }

    function announce(v) {
      range.setAttribute(
        'aria-valuetext',
        v < 8 ? 'Showing the old site'
          : v > 92 ? 'Showing the rebuilt site'
            : Math.round(v) + '% rebuilt site, ' + Math.round(100 - v) + '% old site'
      );
    }

    function set(v) { paint(v); announce(v); }

    range.value = REST;
    set(REST);

    range.addEventListener('input', function () {
      following = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      target = parseFloat(range.value);
      set(target);
    });

    range.addEventListener('pointerdown', function () { dragging = true; following = false; });
    window.addEventListener('pointerup', function () { dragging = false; });

    /* Desktop only: the seam drifts toward the cursor so the affordance is
       felt before it is read. Off entirely under reduced motion. */
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    function tick() {
      raf = 0;
      var next = Math.abs(target - pos) < 0.15 ? target : pos + (target - pos) * 0.12;
      set(next);
      range.value = next;
      if (next !== target) raf = requestAnimationFrame(tick);
    }

    function start() { if (!raf) raf = requestAnimationFrame(tick); }

    frame.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || dragging) return;
      following = true;
      var r = frame.getBoundingClientRect();
      target = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100);
      start();
    });

    frame.addEventListener('pointerleave', function () {
      if (dragging) return;
      following = true;
      target = REST;
      start();
    });
  })();

  /* -------------------------------------------------------------- 2. rail */
  /* The readout is not decoration: it interpolates between the real latitudes
     of the real east-coast towns each section is labelled with, so the number
     on screen is genuinely where this scroll position sits on the coast. */

  (function rail() {
    var read = document.getElementById('rail-read');
    var course = document.getElementById('course');
    if (!read || !course) return;

    var labels = [].slice.call(document.querySelectorAll('[data-lat]'));
    if (!labels.length) return;

    var marks = [].slice.call(document.querySelectorAll('.wp'));
    var dark = [].slice.call(document.querySelectorAll('.hero, .build, .price'));
    var points = [];

    function measure() {
      points = labels.map(function (el) {
        var r = el.getBoundingClientRect();
        return {
          y: r.top + window.scrollY,
          lat: parseFloat(el.getAttribute('data-lat')),
          place: el.getAttribute('data-place')
        };
      });
    }

    function latAt(y) {
      if (y <= points[0].y) return points[0];
      var last = points[points.length - 1];
      if (y >= last.y) return last;
      for (var i = 1; i < points.length; i++) {
        var a = points[i - 1], b = points[i];
        if (y <= b.y) {
          var t = (y - a.y) / Math.max(b.y - a.y, 1);
          return { lat: a.lat + (b.lat - a.lat) * t, place: t > 0.5 ? b.place : a.place };
        }
      }
      return last;
    }

    var pending = false;

    function update() {
      pending = false;
      var vh = window.innerHeight;
      var max = Math.max(document.documentElement.scrollHeight - vh, 1);
      var progress = clamp(window.scrollY / max, 0, 1);

      course.setAttribute('stroke-dashoffset', String(1000 * (1 - progress)));

      var here = latAt(window.scrollY + vh / 2);
      read.textContent = here.lat.toFixed(4) + '°N — ' + here.place;

      for (var i = 0; i < marks.length; i++) {
        var r = marks[i].getBoundingClientRect();
        marks[i].classList.toggle('is-passed', r.top < vh * 0.55);
      }

      var onInk = false;
      for (var j = 0; j < dark.length; j++) {
        var d = dark[j].getBoundingClientRect();
        if (d.top < vh / 2 && d.bottom > vh / 2) { onInk = true; break; }
      }
      document.getElementById('rail').classList.toggle('rail--ink', onInk);
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    }

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); });
    window.addEventListener('load', function () { measure(); onScroll(); });
  })();

  /* --------------------------------------------------- 3. the pinned build */

  (function pinnedBuild() {
    var stage = document.getElementById('stage');
    var inner = document.getElementById('stage-inner');
    var bar = document.getElementById('stage-bar');
    if (!stage || !inner) return;

    // No motion: the build stays an ordinary tall section you scroll past.
    if (reduced) return;

    // Crop to the viewport window immediately, not once GSAP has landed, so
    // the section is never re-sized under a reader who has scrolled to it.
    stage.classList.add('is-pinned');

    function unpin() { stage.classList.remove('is-pinned'); }

    function script(src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    script('assets/js/vendor/gsap.min.js')
      .then(function () { return script('assets/js/vendor/ScrollTrigger.min.js'); })
      .then(function () {
        var gsap = window.gsap;
        gsap.registerPlugin(window.ScrollTrigger);

        var navH = function () {
          var n = document.querySelector('.nav');
          return n ? n.getBoundingClientRect().height : 0;
        };
        var travel = function () {
          return Math.max(inner.scrollHeight - stage.clientHeight, 0);
        };

        if (travel() < 40) { unpin(); return; }

        gsap.to(inner, {
          y: function () { return -travel(); },
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: function () { return 'top top+=' + navH(); },
            end: function () { return '+=' + travel(); },
            pin: true,
            scrub: true,                 // tied to scroll: stops when you stop
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              if (bar) bar.style.setProperty('--read', (self.progress * 100).toFixed(2));
            }
          }
        });
      })
      .catch(function () {
        // GSAP unavailable: show the build in full rather than a cropped slice.
        unpin();
      });
  })();
})();
