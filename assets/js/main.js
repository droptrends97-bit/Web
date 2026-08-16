/* East Coast Digital
   Three jobs: the reveal, the course line, and one pinned sequence.
   Everything scroll-linked is scrubbed. Nothing runs on a timer. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wide = window.matchMedia('(min-width: 861px)');
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var clamp = function (n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; };

  /* ═══ 1. the reveal ══════════════════════════════════════════════
     --x is the boundary. The rebuild occupies everything right of it,
     so a smaller --x means more of the good version.                */

  (function reveal() {
    var root = document.querySelector('[data-reveal]');
    if (!root) return;

    var frame = root.querySelector('.reveal__frame');
    var handle = root.querySelector('[data-reveal-handle]');
    var start = parseFloat(getComputedStyle(root).getPropertyValue('--x')) || 30;
    var x = start;
    var dragging = false;
    var touched = false;
    var queued = false;

    function paint() {
      queued = false;
      root.style.setProperty('--x', x + '%');
      var v = Math.round(x);
      handle.setAttribute('aria-valuenow', v);
      handle.setAttribute('aria-valuetext', v + ' per cent old site, ' + (100 - v) + ' per cent rebuild');
    }

    function set(next) {
      x = clamp(next, 0, 100);
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }

    function fromEvent(e) {
      var box = frame.getBoundingClientRect();
      set(((e.clientX - box.left) / box.width) * 100);
    }

    function stop() { touched = true; }

    frame.addEventListener('pointerdown', function (e) {
      // on touch the drag must start on the handle, so a tap never jumps the wipe
      if (e.pointerType !== 'mouse' && !handle.contains(e.target)) return;
      dragging = true;
      stop();
      frame.setPointerCapture(e.pointerId);
      fromEvent(e);
      e.preventDefault();
    });

    frame.addEventListener('pointermove', function (e) {
      if (dragging) { fromEvent(e); return; }
      if (fine && e.pointerType === 'mouse') { stop(); fromEvent(e); }
    });

    ['pointerup', 'pointercancel'].forEach(function (t) {
      frame.addEventListener(t, function (e) {
        dragging = false;
        if (frame.hasPointerCapture && frame.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId);
      });
    });

    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2;
      var next = null;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = x - step;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = x + step;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = 100;
      if (next === null) return;
      e.preventDefault();
      stop();
      set(next);
    });

    // one-shot affordance hint on first sight. Not ambient motion.
    if (!reduced && hasGsap) {
      ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        once: true,
        onEnter: function () {
          if (touched) return;
          var proxy = { v: x };
          gsap.to(proxy, {
            v: start + 16,
            duration: .55,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
            onUpdate: function () { if (!touched) set(proxy.v); }
          });
        }
      });
    }
  }());

  /* ═══ 2. the course line ═════════════════════════════════════════
     Progress, contents and jump nav in one device. The waypoints sit
     at each section's true position in the document.                */

  (function course() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('.room[data-town]'));
    if (!sections.length) return;

    var rail = document.querySelector('.course');
    var list = rail && rail.querySelector('.course__waypoints');
    var bar = document.querySelector('.course-bar');
    var links = [];

    if (list) {
      sections.forEach(function (sec) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.className = 'course__wp';
        a.href = '#' + sec.id;
        a.innerHTML = '<span>' + sec.dataset.town + '</span><span>' + sec.dataset.lat + '&deg;N</span>';
        li.appendChild(a);
        list.appendChild(li);
        links.push(a);
      });
    }

    function place() {
      var range = document.documentElement.scrollHeight - window.innerHeight;
      if (range <= 0) return;
      links.forEach(function (a, i) {
        a.style.top = (clamp(sections[i].offsetTop / range, 0, 1) * 100) + '%';
      });
    }

    function progress(p) {
      if (rail) rail.style.setProperty('--progress', p);
      if (bar) bar.style.setProperty('--progress', p);
    }

    function mark(i) {
      links.forEach(function (a, j) {
        a.classList.toggle('is-passed', j <= i);
        if (j === i) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }

    place();

    if (hasGsap) {
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: function (self) { progress(self.progress); }
      });
      sections.forEach(function (sec, i) {
        ScrollTrigger.create({
          trigger: sec,
          start: 'top 40%',
          end: 'bottom 40%',
          onToggle: function (self) { if (self.isActive) mark(i); }
        });
      });
      ScrollTrigger.addEventListener('refresh', place);
    } else {
      window.addEventListener('scroll', function () {
        var range = document.documentElement.scrollHeight - window.innerHeight;
        progress(range > 0 ? clamp(window.scrollY / range, 0, 1) : 0);
      }, { passive: true });
      window.addEventListener('resize', place);
    }

    mark(0);
  }());

  /* ═══ 3. the one pinned sequence ═════════════════════════════════
     Desktop only, and capped at 1.4 viewport heights so it can never
     feel like being held. On a phone the build is simply full width
     and you scroll it natively — same experience, no machinery.     */

  (function build() {
    if (!hasGsap || reduced || !wide.matches) return;

    var stage = document.querySelector('[data-build-stage]');
    var scroller = document.querySelector('[data-build-scroller]');
    if (!stage || !scroller) return;

    stage.classList.add('is-pinned');

    var overflow = function () {
      return Math.max(0, scroller.scrollHeight - stage.clientHeight);
    };

    if (overflow() <= 0) { stage.classList.remove('is-pinned'); return; }

    ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: function () { return '+=' + Math.min(overflow(), window.innerHeight * 1.4); },
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        gsap.set(scroller, { y: -overflow() * self.progress });
      },
      onRefresh: function () {
        if (overflow() <= 0) gsap.set(scroller, { y: 0 });
      }
    });
  }());

  /* ═══ 4. section labels ══════════════════════════════════════════ */

  if (hasGsap && !reduced) {
    gsap.utils.toArray('.room .label').forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 8,
        duration: .2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      });
    });
  }

  /* keep measurements honest once late assets land */
  if (hasGsap) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
}());
