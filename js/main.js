/* ==========================================================================
   main.js — boot sequence
   ========================================================================== */
(function () {
  'use strict';

  var reduced = U.prefersReducedMotion();

  /* ------------------------------------------------------------ preloader */
  function preload(done) {
    var pre = U.$('#preloader'), bar = U.$('#preloaderBar');
    var p = 0, t0 = performance.now();
    (function tick(now) {
      /* a short, honest little wait — long enough for the first frame of the
         simulation to settle, short enough not to be a toll booth */
      p = U.clamp((now - t0) / 900, 0, 1);
      if (bar) bar.style.width = (U.ease.outCubic(p) * 100).toFixed(1) + '%';
      if (p < 1) requestAnimationFrame(tick);
      else {
        pre.classList.add('is-done');
        setTimeout(function () { pre.style.display = 'none'; }, 900);
        done();
      }
    })(t0);
  }

  /* ------------------------------------------------------- motion toggle */
  function motionToggle() {
    var btn = U.$('#motionBtn');
    function apply(on, announce) {
      reduced = on;
      document.documentElement.classList.toggle('reduced', on);
      document.documentElement.classList.toggle('no-smooth', on);
      Sections.setReduced(on);
      Tank.setReduced(on);
      if (btn) btn.setAttribute('aria-pressed', String(on));
      if (announce) announce(on ? 'Motion reduced — the tank is holding still' : 'Full motion restored');
    }
    return { apply: apply, btn: btn };
  }

  /* ------------------------------------------------------------------ go */
  function boot() {
    var toast = Sections.toaster();

    Tank.init(U.$('#tank'), { reduced: reduced, quality: U.isSmall() ? .72 : 1 });

    Sections.setReduced(reduced);
    document.documentElement.classList.toggle('reduced', reduced);

    Sections.reveals();
    Sections.nav();
    Sections.counters();
    Sections.descent();
    Sections.species(toast);
    Sections.drawer();
    Sections.anatomy();
    Sections.scale();
    Sections.feed(toast);
    Sections.quiz(toast);
    Sections.faq();
    Sections.form(toast);
    Sections.magnetic();
    Sections.sound();

    var mt = motionToggle();
    if (mt.btn) {
      mt.btn.setAttribute('aria-pressed', String(reduced));
      U.on(mt.btn, 'click', function () { mt.apply(!reduced, toast); });
    }

    /* live fish counter in the hero */
    var live = U.$('#liveCount');
    if (live) setInterval(function () { live.textContent = Tank.count(); }, 900);

    var year = U.$('#year');
    if (year) year.textContent = new Date().getFullYear();

    /* a nudge, once, after the visitor has had a moment to look around */
    setTimeout(function () {
      if (Tank.stats().dropped === 0) toast('Tip: click anywhere on the water to drop food');
    }, 14000);
  }

  if (document.readyState === 'loading') {
    U.on(document, 'DOMContentLoaded', function () { preload(boot); });
  } else {
    preload(boot);
  }
})();
