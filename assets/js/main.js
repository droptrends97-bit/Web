/* East Coast Digital
   The reveal, the trade switcher, and the scroll behaviour.
   Everything scroll-linked is scrubbed. Nothing runs on a timer. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var wide = window.matchMedia('(min-width: 901px)');
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  var clamp = function (n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; };

  /* ═══ the trades ═════════════════════════════════════════════════
     Each one drives both halves of the reveal: the old site and the
     rebuild are the same business, so they have to move together.  */

  var TRADES = {
    plasterer: {
      name: 'Dolan Plastering', phone: '01 845 9921',
      oldH1: 'Welcome to Dolan Plastering',
      oldP: 'Dolan Plastering are a family run plastering business based in Malahide, Co. Dublin, established 1998. We undertake all aspects of plastering work for domestic and commercial clients throughout north county Dublin.',
      oldList: ['Skimming & Plastering', 'Dry Lining', 'External Rendering', 'Coving & Cornice'],
      newH1: 'Plastering in Malahide, done once and done right.',
      newP: 'Skimming, dry lining and rendering across north county Dublin. Twenty-six years at it. Ring us and you get Peter, not a call centre.',
      cards: [['Skimming', 'Walls and ceilings, ready to paint.'], ['Dry lining', 'Insulated board, taped and finished.'], ['Rendering', 'Sand and cement, or a coloured finish.']],
      shot: 'Photo of your work', nb: '#0D4A5C', nt: '#E1EBEE'
    },
    electrician: {
      name: 'Byrne Electrical', phone: '01 890 3312',
      oldH1: 'Welcome to Byrne Electrical Ltd',
      oldP: 'Byrne Electrical Ltd are RECI registered electrical contractors based in Swords, Co. Dublin. We carry out domestic, commercial and industrial electrical installations throughout Dublin and the surrounding counties.',
      oldList: ['Rewiring', 'Fuse Board Upgrades', 'Emergency Lighting', 'Fault Finding'],
      newH1: 'Safe Electric contractors in Swords, on the phone today.',
      newP: 'Rewires, fuse boards, EV chargers and fault finding across north Dublin. Certified work, certified paperwork, and a straight price before we start.',
      cards: [['Rewires', 'Whole house or one room, tidied after.'], ['Fuse boards', 'Upgraded and certified same day.'], ['EV chargers', 'Supplied, fitted and registered.']],
      shot: 'Photo of your work', nb: '#14386B', nt: '#E3E9F3'
    },
    plumber: {
      name: 'Keane Plumbing & Heating', phone: '01 849 7740',
      oldH1: 'Keane Plumbing &amp; Heating - Home Page',
      oldP: 'Keane Plumbing & Heating provide a full range of plumbing and heating services to customers in Skerries, Rush, Lusk and surrounding areas. Established 2004. No call out charge.',
      oldList: ['Boiler Servicing', 'Bathroom Installations', 'Leak Detection', 'Power Flushing'],
      newH1: 'Heating and plumbing in Skerries, without the waiting.',
      newP: 'Boiler servicing, bathrooms and leaks across Fingal. RGII registered, same-week appointments, and a price agreed before a tool comes out of the van.',
      cards: [['Boiler service', 'Serviced, certified, and left clean.'], ['Bathrooms', 'Stripped and fitted in a week.'], ['Leaks & repairs', 'Found without knocking walls.']],
      shot: 'Photo of your work', nb: '#14514A', nt: '#DFEDEA'
    },
    roofer: {
      name: 'Nolan Roofing', phone: '01 843 6650',
      oldH1: 'Nolan Roofing - Roofing Contractors Dublin',
      oldP: 'Nolan Roofing are roofing contractors covering North County Dublin and Meath. All work fully insured and guaranteed. Free estimates given on all roofing work, large or small.',
      oldList: ['Slating & Tiling', 'Flat Roofs', 'Guttering', 'Chimney Repairs'],
      newH1: 'Roofs that stop the problem, not just the drip.',
      newP: 'Slating, flat roofs, gutters and chimneys across Fingal and Meath. Fully insured, guaranteed in writing, and photos of the work before and after.',
      cards: [['Slating & tiling', 'Matched to what is already up there.'], ['Flat roofs', 'Torch-on felt or fibreglass.'], ['Gutters', 'Cleared, repaired or replaced.']],
      shot: 'Photo of your work', nb: '#3F4A2E', nt: '#E9EDE1'
    },
    garage: {
      name: 'Hayes Motors', phone: '01 843 2218',
      oldH1: 'Hayes Motors - Car Servicing Donabate',
      oldP: 'Hayes Motors is a family run garage in Donabate offering car servicing, repairs and pre-NCT checks at competitive rates. All makes and models catered for. Courtesy car available on request.',
      oldList: ['Car Servicing', 'Pre-NCT Checks', 'Brakes & Clutches', 'Diagnostics'],
      newH1: 'Servicing and NCT prep in Donabate, booked online.',
      newP: 'All makes, all models, with a courtesy car if you need one. You get a photo of anything we find and a price before we touch it.',
      cards: [['Servicing', 'Full or interim, parts listed.'], ['Pre-NCT check', 'Fixed before it fails, not after.'], ['Diagnostics', 'The actual fault, not a guess.']],
      shot: 'Photo of your work', nb: '#6B3230', nt: '#F3E5E3'
    }
  };

  /* ═══ the reveal ═════════════════════════════════════════════════
     --x is the boundary. The rebuild occupies everything to its
     right, so a smaller --x means more of the good version.        */

  (function reveal() {
    var root = document.querySelector('[data-reveal]');
    if (!root) return;

    var frame = root.querySelector('.reveal__frame');
    var handle = root.querySelector('[data-reveal-handle]');
    var sites = root.querySelectorAll('.site');
    var oldSite = root.querySelector('.site--old');
    var newSite = root.querySelector('.site--new');

    var start = parseFloat(getComputedStyle(root).getPropertyValue('--x')) || 13;
    var x = start, dragging = false, touched = false, queued = false;

    /* Each side declares its own page size in CSS and is scaled into the
       frame, so both are true layouts rather than squashed ones.
       The old site always fits to width: on a phone that renders it as a
       tiny zoomed-out desktop page, which is what it actually does. */
    function fit() {
      var box = frame.getBoundingClientRect();
      if (!box.width) return;
      for (var i = 0; i < sites.length; i++) {
        var el = sites[i];
        var cs = getComputedStyle(el);
        var w = parseFloat(cs.getPropertyValue('--w')) || 1280;
        var h = parseFloat(cs.getPropertyValue('--h')) || 800;
        var fitWidth = el.classList.contains('site--old');
        var s = fitWidth ? box.width / w : Math.max(box.width / w, box.height / h);
        el.style.setProperty('--scale', s);
        el.style.setProperty('--tx', (box.width - w * s) / 2 + 'px');
      }
    }

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

    frame.addEventListener('pointerdown', function (e) {
      // on touch the drag must start on the handle, so a tap never jumps the wipe
      if (e.pointerType !== 'mouse' && !handle.contains(e.target)) return;
      dragging = true; touched = true;
      frame.setPointerCapture(e.pointerId);
      fromEvent(e);
      e.preventDefault();
    });
    frame.addEventListener('pointermove', function (e) {
      if (dragging) { fromEvent(e); return; }
      if (fine && e.pointerType === 'mouse') { touched = true; fromEvent(e); }
    });
    ['pointerup', 'pointercancel'].forEach(function (t) {
      frame.addEventListener(t, function (e) {
        dragging = false;
        if (frame.hasPointerCapture && frame.hasPointerCapture(e.pointerId)) frame.releasePointerCapture(e.pointerId);
      });
    });

    handle.addEventListener('keydown', function (e) {
      var step = e.shiftKey ? 10 : 2, next = null;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = x - step;
      else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = x + step;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = 100;
      if (next === null) return;
      e.preventDefault(); touched = true; set(next);
    });

    fit();
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    /* one-shot affordance hint on first sight — not ambient motion */
    if (!reduced && hasGsap) {
      ScrollTrigger.create({
        trigger: root, start: 'top 85%', once: true,
        onEnter: function () {
          if (touched) return;
          var proxy = { v: x };
          gsap.to(proxy, {
            v: start + 20, duration: .65, ease: 'power2.inOut', yoyo: true, repeat: 1,
            onUpdate: function () { if (!touched) set(proxy.v); }
          });
        }
      });
    }

    /* ── the trade switcher ─────────────────────────────────────── */
    var bar = document.querySelector('[data-trades]');
    if (!bar) return;

    var q = function (sel) { return root.querySelector(sel); };

    function apply(key) {
      var t = TRADES[key];
      if (!t) return;

      q('[data-o-name]').textContent = t.name;
      q('[data-o-phone]').textContent = 'Tel: ' + t.phone;
      q('[data-o-h1]').innerHTML = t.oldH1;
      q('[data-o-p]').textContent = t.oldP;
      q('[data-o-list]').innerHTML = t.oldList.map(function (s) { return '<li>' + s + '</li>'; }).join('');

      q('[data-n-logo]').textContent = t.name;
      q('[data-n-phone]').textContent = t.phone;
      q('[data-n-h1]').textContent = t.newH1;
      q('[data-n-p]').textContent = t.newP;
      q('[data-n-shot]').textContent = t.shot;
      q('[data-n-cards]').innerHTML = t.cards.map(function (c) {
        return '<div class="new__card"><i></i><b>' + c[0] + '</b><span>' + c[1] + '</span></div>';
      }).join('');

      newSite.style.setProperty('--nb', t.nb);
      newSite.style.setProperty('--nt', t.nt);

      oldSite.setAttribute('aria-label', 'The site ' + t.name + ' had before: a small, dated page from around 2011.');
      newSite.setAttribute('aria-label', t.name + ' rebuilt by East Coast Digital: a clear, current homepage.');

      if (hasGsap && !reduced) {
        gsap.fromTo([oldSite, newSite], { opacity: .35 }, { opacity: 1, duration: .32, ease: 'power2.out' });
      }
      fit();
    }

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.trade');
      if (!btn) return;
      bar.querySelectorAll('.trade').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      apply(btn.dataset.trade);
    });
  }());

  /* ═══ scroll ═════════════════════════════════════════════════════ */

  if (hasGsap) {
    var barEl = document.querySelector('.progress');
    if (barEl) {
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: function (self) { barEl.style.setProperty('--p', self.progress); }
      });
    }

    if (!reduced) {
      document.documentElement.classList.add('gsap-ready');
      /* things rise into place as they arrive. Short, once, and slightly
         lagged behind the scroll so it reads as weight rather than pop. */
      gsap.utils.toArray('.rise').forEach(function (el) {
        gsap.to(el, {
          opacity: 1, y: 0, duration: .7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });

      /* the one pinned sequence: scroll through the build itself */
      (function build() {
        if (!wide.matches) return;
        var stage = document.querySelector('[data-build-stage]');
        var scroller = document.querySelector('[data-build-scroller]');
        if (!stage || !scroller) return;

        stage.classList.add('is-pinned');
        var overflow = function () { return Math.max(0, scroller.scrollHeight - stage.clientHeight); };
        if (overflow() <= 0) { stage.classList.remove('is-pinned'); return; }

        ScrollTrigger.create({
          trigger: stage,
          start: 'center center',
          end: function () { return '+=' + Math.min(overflow(), window.innerHeight * 1.4); },
          pin: true, scrub: .6, invalidateOnRefresh: true,
          onUpdate: function (self) { gsap.set(scroller, { y: -overflow() * self.progress }); },
          onRefresh: function () { if (overflow() <= 0) gsap.set(scroller, { y: 0 }); }
        });
      }());
    }

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
    }
  }
}());
