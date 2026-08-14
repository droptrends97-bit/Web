/* ==========================================================================
   sections.js — every interactive region of the page
   Each init() is independent and fails quietly if its markup is absent.
   ========================================================================== */
(function (global) {
  'use strict';

  var S = {};
  var reduced = false;
  S.setReduced = function (v) { reduced = v; };

  /* ======================================================== showcase loop */
  /* One shared rAF drives every small "fish swimming on the spot" canvas
     (species cards, drawer, quiz result). Off-screen canvases are skipped. */
  var showcases = [];
  var showLoopOn = false;

  function addShowcase(canvas, spec, opts) {
    opts = opts || {};
    var s = {
      cv: canvas, spec: spec, w: 0, h: 0, ctx: null,
      visible: false, t: Math.random() * 40, scale: opts.scale || 1,
      always: !!opts.always
    };
    function fit() {
      var f = U.fitCanvas(canvas, 2);
      s.w = f.w; s.h = f.h; s.ctx = f.ctx;
    }
    fit();
    s.fit = fit;
    U.inView(canvas, function (vis) { s.visible = vis; }, { threshold: 0 });
    showcases.push(s);
    if (!showLoopOn) { showLoopOn = true; requestAnimationFrame(showLoop); }
    return s;
  }

  var showLast = 0;
  function showLoop(now) {
    var dt = Math.min(.05, (now - showLast) / 1000 || .016);
    showLast = now;
    for (var i = 0; i < showcases.length; i++) {
      var s = showcases[i];
      if (!s.spec || (!s.visible && !s.always)) continue;
      if (!s.ctx || !s.w) continue;
      if (!reduced) s.t += dt;
      s.ctx.clearRect(0, 0, s.w, s.h);
      FishArt.showcase(s.ctx, s.spec, s.w, s.h, s.t, s.scale);
    }
    requestAnimationFrame(showLoop);
  }
  U.on(window, 'resize', U.debounce(function () {
    showcases.forEach(function (s) { s.fit(); });
  }, 200));

  /* ============================================================== reveals */
  S.reveals = function () {
    var nodes = U.$$('[data-reveal]');
    nodes.forEach(function (n) {
      var d = n.getAttribute('data-delay');
      if (d) n.style.setProperty('--d', d + 'ms');
      U.inView(n, function (vis, e) {
        if (vis) { n.classList.add('is-in'); if (e && e.target) { /* once */ } }
      }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    });
  };

  /* ================================================================== nav */
  S.nav = function () {
    var nav = U.$('#nav'), bar = U.$('#progressBar');
    var burger = U.$('#burger'), menu = U.$('#mobileMenu');
    var links = U.$$('.nav__links a');
    var lastY = 0, ticking = false;

    function onScroll() {
      var y = window.pageYOffset;
      var doc = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (U.clamp(y / (doc || 1), 0, 1) * 100).toFixed(2) + '%';
      nav.classList.toggle('is-stuck', y > 40);
      if (y > 420 && y > lastY + 6 && !menu.hasAttribute('hidden') === false) nav.classList.add('is-hidden');
      else if (y < lastY - 6 || y < 200) nav.classList.remove('is-hidden');
      lastY = y;
      ticking = false;
    }
    U.on(window, 'scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    /* current-section highlight */
    U.$$('main section[id]').forEach(function (sec) {
      U.inView(sec, function (vis) {
        if (!vis) return;
        links.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + sec.id);
        });
      }, { threshold: .01, rootMargin: '-45% 0px -45% 0px' });
    });

    /* smooth scrolling that also works with the reduced-motion switch */
    function go(hash) {
      var t = document.querySelector(hash);
      if (!t) return;
      var top = t.getBoundingClientRect().top + window.pageYOffset - 10;
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    }
    U.on(document, 'click', function (e) {
      var a = e.target.closest('[data-scroll]');
      if (!a) return;
      var hash = a.getAttribute('href') || a.getAttribute('data-target');
      if (!hash || hash.charAt(0) !== '#') return;
      e.preventDefault();
      go(hash);
      closeMenu();
    });

    function closeMenu() {
      if (!menu || menu.hasAttribute('hidden')) return;
      menu.setAttribute('hidden', '');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
    }
    if (burger) {
      U.on(burger, 'click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        if (open) closeMenu();
        else {
          menu.removeAttribute('hidden');
          burger.setAttribute('aria-expanded', 'true');
          document.body.classList.add('is-locked');
        }
      });
    }
    U.on(document, 'keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    var top = U.$('#topBtn');
    if (top) U.on(top, 'click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });
  };

  /* ============================================================ counters */
  S.counters = function () {
    U.$$('[data-count]').forEach(function (n) {
      var target = parseFloat(n.getAttribute('data-count'));
      var suffix = n.getAttribute('data-suffix') || '';
      var done = false;
      U.inView(n, function (vis) {
        if (!vis || done) return;
        done = true;
        if (reduced) { n.textContent = U.formatNum(target) + suffix; return; }
        var dur = 1700, t0 = performance.now();
        (function tick(now) {
          var p = U.clamp((now - t0) / dur, 0, 1);
          n.textContent = U.formatNum(target * U.ease.outQuint(p)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }, { threshold: .4 });
    });
  };

  /* ============================================================== descent */
  S.descent = function () {
    var sec = U.$('#descent');
    if (!sec) return;
    var els = {
      idx: U.$('#zoneIndex'), name: U.$('#zoneName'), range: U.$('#zoneRange'),
      text: U.$('#zoneText'), light: U.$('#zoneLight'), pressure: U.$('#zonePressure'),
      temp: U.$('#zoneTemp'), resident: U.$('#zoneResident'),
      rail: U.$('#railFill'), ticks: U.$('#railTicks'),
      depth: U.$('#gaugeDepth'), gauge: U.$('#gaugeFill')
    };
    var Z = DATA.ZONES;
    /* metres at the start / end of each zone; the last one rises again */
    var METRES = [[0, 200], [200, 1000], [1000, 4000], [4000, 6000], [6000, 11000], [11000, 0]];

    Z.forEach(function (z, i) {
      var li = U.el('li', '', z.tick || z.short);
      li.dataset.i = i;
      els.ticks.appendChild(li);
    });
    var tickEls = U.$$('li', els.ticks);

    var current = -1, ticking = false;

    function paint(zi, p) {
      if (zi !== current) {
        current = zi;
        var z = Z[zi];
        els.idx.textContent = ('0' + (zi + 1)).slice(-2);
        els.name.textContent = z.name;
        els.range.textContent = z.range;
        els.text.textContent = z.text;
        els.light.textContent = z.light;
        els.pressure.textContent = z.pressure;
        els.temp.textContent = z.temp;
        els.resident.textContent = z.resident;
        [els.name, els.text].forEach(function (n) {
          n.classList.remove('zone-swap');
          void n.offsetWidth;
          if (!reduced) n.classList.add('zone-swap');
        });
        tickEls.forEach(function (t, i) { t.classList.toggle('is-on', i === zi); });
      }
      var m = U.lerp(METRES[zi][0], METRES[zi][1], p);
      els.depth.textContent = U.formatNum(m);
      els.gauge.style.width = (U.clamp(m / 11000, 0, 1) * 100).toFixed(1) + '%';
    }

    function onScroll() {
      ticking = false;
      var r = sec.getBoundingClientRect();
      var total = sec.offsetHeight - window.innerHeight;
      var prog = U.clamp(-r.top / (total || 1), 0, 1);
      var f = prog * Z.length;
      var zi = U.clamp(Math.floor(f), 0, Z.length - 1);
      var within = U.clamp(f - zi, 0, 1);

      els.rail.style.height = (prog * 100).toFixed(2) + '%';
      paint(zi, within);

      /* hand the same position to the live tank so the water changes with us */
      if (global.Tank) Tank.setDepth(U.clamp(f - .5, 0, Z.length - 1));
    }

    U.on(window, 'scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    U.on(window, 'resize', U.debounce(onScroll, 150));
    onScroll();
  };

  /* ============================================================== species */
  S.species = function (toast) {
    var grid = U.$('#speciesGrid');
    if (!grid) return;
    var empty = U.$('#speciesEmpty');
    var search = U.$('#speciesSearch');
    var chips = U.$$('.chip');
    var filter = 'all', term = '';
    var cards = [];

    DATA.SPECIES.forEach(function (sp) {
      var card = U.el('article', 'card');
      card.dataset.group = sp.group;
      card.dataset.id = sp.id;
      card.innerHTML =
        '<div class="card__stage">' +
          '<canvas></canvas>' +
          '<span class="card__badge">' + labelFor(sp.group) + '</span>' +
          '<span class="card__depth">' + sp.depthText + '</span>' +
        '</div>' +
        '<div class="card__body">' +
          '<h3>' + sp.name + '</h3>' +
          '<p class="card__latin">' + sp.latin + '</p>' +
          '<p>' + sp.blurb + '</p>' +
          '<div class="card__row">' +
            '<button class="card__btn card__btn--go" data-open>Read the profile</button>' +
            '<button class="card__btn" data-release>Release</button>' +
          '</div>' +
        '</div>';
      grid.appendChild(card);

      addShowcase(U.$('canvas', card), sp.art, { scale: .92 });

      /* pointer-tracked highlight */
      U.on(card, 'pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--cx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--cy', ((e.clientY - r.top) / r.height * 100) + '%');
      });

      U.on(U.$('[data-open]', card), 'click', function () { S.openDrawer(sp); });
      U.on(U.$('[data-release]', card), 'click', function (e) {
        var b = e.currentTarget;
        Tank.release(sp.id, 3);
        b.textContent = 'Released ✓';
        b.classList.add('is-done');
        toast('<b>' + sp.name + '</b> released into the tank');
        setTimeout(function () { b.textContent = 'Release'; b.classList.remove('is-done'); }, 2200);
      });

      cards.push({ node: card, sp: sp });
    });

    function labelFor(g) {
      return { reef: 'Reef', open: 'Open ocean', deep: 'Deep sea', fresh: 'Freshwater', cold: 'Polar' }[g] || g;
    }

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var okGroup = filter === 'all' || c.sp.group === filter;
        var hay = (c.sp.name + ' ' + c.sp.latin + ' ' + c.sp.blurb).toLowerCase();
        var okTerm = !term || hay.indexOf(term) !== -1;
        var show = okGroup && okTerm;
        c.node.classList.toggle('is-hidden', !show);
        if (show) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    }

    chips.forEach(function (ch) {
      U.on(ch, 'click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        ch.classList.add('is-active');
        filter = ch.dataset.filter;
        apply();
      });
    });
    if (search) U.on(search, 'input', U.debounce(function () {
      term = search.value.trim().toLowerCase();
      apply();
    }, 120));
    var clear = U.$('#clearFilters');
    if (clear) U.on(clear, 'click', function () {
      term = ''; filter = 'all';
      if (search) search.value = '';
      chips.forEach(function (c) { c.classList.toggle('is-active', c.dataset.filter === 'all'); });
      apply();
    });
    if (search) search.placeholder = 'Search ' + DATA.SPECIES.length + ' species…';

    /* tank controls */
    var countEl = U.$('#tankCount');
    function syncCount() { if (countEl) countEl.textContent = Tank.count(); }
    Tank.on('count', syncCount);
    setInterval(syncCount, 1200);
    syncCount();

    var relAll = U.$('#releaseAll');
    if (relAll) U.on(relAll, 'click', function () {
      DATA.SPECIES.forEach(function (sp, i) {
        setTimeout(function () { Tank.release(sp.id, 1); }, i * 110);
      });
      toast('All twelve species released');
    });
    var reset = U.$('#resetTank');
    if (reset) U.on(reset, 'click', function () {
      Tank.reset();
      toast('Tank reset to its ambient population');
    });
  };

  /* =============================================================== drawer */
  var drawerShowcase = null, lastFocus = null;
  S.openDrawer = function (sp) {
    var d = U.$('#drawer');
    if (!d) return;
    lastFocus = document.activeElement;
    U.$('#drawerLatin').textContent = sp.latin;
    U.$('#drawerName').textContent = sp.name;
    U.$('#drawerBlurb').textContent = sp.long;

    var facts = U.$('#drawerFacts');
    facts.innerHTML = sp.facts.map(function (f) {
      return '<li><span>' + f[0] + '</span><b>' + f[1] + '</b></li>';
    }).join('');

    var bars = U.$('#drawerBars');
    bars.innerHTML = Object.keys(sp.stats).map(function (k) {
      return '<div class="bar">' +
        '<div class="bar__head"><span>' + k + '</span><span>' + sp.stats[k] + '</span></div>' +
        '<div class="bar__track"><i class="bar__fill" data-w="' + sp.stats[k] + '"></i></div></div>';
    }).join('');

    if (!drawerShowcase) drawerShowcase = addShowcase(U.$('#drawerCanvas'), sp.art, { always: true });
    else { drawerShowcase.spec = sp.art; drawerShowcase.fit(); }

    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');

    setTimeout(function () {
      drawerShowcase.fit();
      U.$$('.bar__fill', bars).forEach(function (b) { b.style.width = b.dataset.w + '%'; });
      var c = U.$('.drawer__close', d); if (c) c.focus();
    }, 60);

    var status = U.$('#drawerStatus');
    status.classList.remove('is-on');
    var rel = U.$('#drawerRelease');
    rel.onclick = function () {
      Tank.release(sp.id, 3);
      status.textContent = 'Three ' + sp.name.toLowerCase() + ' are now swimming behind this panel.';
      status.classList.add('is-on');
    };
  };

  S.drawer = function () {
    var d = U.$('#drawer');
    if (!d) return;
    function close() {
      d.classList.remove('is-open');
      d.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    U.$$('[data-close-drawer]', d).forEach(function (n) { U.on(n, 'click', close); });
    U.on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && d.classList.contains('is-open')) close();
    });
  };

  /* ============================================================== anatomy */
  S.anatomy = function () {
    var svg = U.$('#anatomySvg');
    if (!svg) return;
    var host = U.$('#hotspots');
    var stage = U.$('.anatomy__stage');
    var title = U.$('#anLabelTitle'), text = U.$('#anLabelText');
    var NS = 'http://www.w3.org/2000/svg';

    /* decorative scale rows inside the body */
    var scales = U.$('.an-scales', svg);
    if (scales) {
      for (var row = 0; row < 5; row++) {
        for (var col = 0; col < 14; col++) {
          var c = document.createElementNS(NS, 'circle');
          c.setAttribute('cx', 250 + col * 32 + (row % 2) * 16);
          c.setAttribute('cy', 178 + row * 26);
          c.setAttribute('r', 11);
          scales.appendChild(c);
        }
      }
    }

    DATA.ANATOMY.forEach(function (h) {
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'hotspot');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', h.title);
      g.innerHTML =
        '<circle class="hs-ring" cx="' + h.x + '" cy="' + h.y + '" r="9"/>' +
        '<circle class="hs-dot" cx="' + h.x + '" cy="' + h.y + '" r="5"/>' +
        '<text class="hs-label" x="' + h.x + '" y="' + (h.y - 18) + '" text-anchor="middle">' + h.label + '</text>' +
        '<circle class="hs-hit" cx="' + h.x + '" cy="' + h.y + '" r="26"/>';
      host.appendChild(g);

      function activate() {
        U.$$('.hotspot', host).forEach(function (n) { n.classList.remove('is-on'); });
        g.classList.add('is-on');
        U.$$('.an-part', svg).forEach(function (p) {
          p.classList.toggle('is-lit', p.dataset.part === h.part);
        });
        stage.classList.add('has-focus');
        title.textContent = h.title;
        text.textContent = h.text;
        [title, text].forEach(function (n) {
          n.classList.remove('label-swap'); void n.offsetWidth;
          if (!reduced) n.classList.add('label-swap');
        });
      }
      U.on(g, 'pointerenter', activate);
      U.on(g, 'focus', activate);
      U.on(g, 'click', activate);
      U.on(g, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });

    U.on(stage, 'pointerleave', function () {
      stage.classList.remove('has-focus');
      U.$$('.hotspot', host).forEach(function (n) { n.classList.remove('is-on'); });
      U.$$('.an-part', svg).forEach(function (p) { p.classList.remove('is-lit'); });
    });
  };

  /* ================================================================ scale */
  S.scale = function () {
    var cv = U.$('#scaleCanvas');
    if (!cv) return;
    var slider = U.$('#scaleSlider');
    var ticks = U.$('#scaleTicks');
    var nameEl = U.$('#scaleName'), lenEl = U.$('#scaleLen'), noteEl = U.$('#scaleNote');
    var list = DATA.SCALE;
    var idx = parseInt(slider.value, 10) || 0;
    var view = { ppm: 60, target: 60 };   /* pixels per metre, eased */
    var fit = U.fitCanvas(cv, 2), ctx = fit.ctx, W = fit.w, H = fit.h;
    var t = 0, last = 0;

    slider.max = String(list.length - 1);
    ticks.innerHTML = list.map(function (c, i) {
      return '<li data-i="' + i + '">' + (c.len < 1 ? Math.round(c.len * 100) + 'cm' : c.len + 'm') + '</li>';
    }).join('');
    U.$$('li', ticks).forEach(function (li) {
      U.on(li, 'click', function () { slider.value = li.dataset.i; select(+li.dataset.i); });
    });

    function resize() {
      fit = U.fitCanvas(cv, 2); ctx = fit.ctx; W = fit.w; H = fit.h;
      recompute();
    }
    U.on(window, 'resize', U.debounce(resize, 180));

    function recompute() {
      var c = list[idx];
      var sp = DATA.byId(c.art);
      var b = sp ? FishArt.bounds(sp.art) : { x0: -60, x1: 55, y0: -20, y1: 20 };
      /* px per metre that makes the fish fill its half of the frame … */
      var bw = b.x1 - b.x0, bh = b.y1 - b.y0;
      /* the quoted length is total length — nose to tail tip — so the whole
         drawn shape, fins included, has to measure c.len metres */
      var byFishW = (W * .56) / c.len;
      var byFishH = (H * .6) / (c.len * (bh / bw));
      var byFish = Math.min(byFishW, byFishH);
      /* … and the one that keeps the 1.8 m diver on screen. Smaller wins,
         so nothing ever runs off the canvas. */
      var byDiver = (H * .74) / 1.8;
      view.target = Math.min(byFish, byDiver);
    }

    function select(i) {
      idx = U.clamp(i, 0, list.length - 1);
      var c = list[idx];
      nameEl.textContent = c.name;
      lenEl.textContent = c.len < 1 ? (c.len * 100).toFixed(1) + ' cm' : c.len.toFixed(1) + ' m';
      noteEl.textContent = c.note;
      U.$$('li', ticks).forEach(function (li, n) { li.classList.toggle('is-on', n === idx); });
      recompute();
    }

    U.on(slider, 'input', function () { select(parseInt(slider.value, 10)); });

    /* a simple scuba diver, drawn in metres and scaled at paint time */
    function drawDiver(ppm, baseY, x) {
      var h = 1.8 * ppm;
      ctx.save();
      ctx.translate(x, baseY);
      ctx.fillStyle = 'rgba(190,230,245,.55)';
      ctx.strokeStyle = 'rgba(190,230,245,.55)';
      ctx.lineCap = 'round';
      var u = h / 100;               /* diver is 100 units tall */
      ctx.beginPath(); ctx.arc(0, -88 * u, 8 * u, 0, U.TAU); ctx.fill();           /* head */
      ctx.lineWidth = 11 * u;
      ctx.beginPath(); ctx.moveTo(0, -80 * u); ctx.lineTo(0, -44 * u); ctx.stroke(); /* torso */
      ctx.lineWidth = 5 * u;
      ctx.beginPath(); ctx.moveTo(0, -72 * u); ctx.lineTo(-15 * u, -54 * u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -72 * u); ctx.lineTo(16 * u, -60 * u); ctx.stroke();
      ctx.lineWidth = 6.5 * u;
      ctx.beginPath(); ctx.moveTo(0, -46 * u); ctx.lineTo(-7 * u, -4 * u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -46 * u); ctx.lineTo(7 * u, -4 * u); ctx.stroke();
      /* fins */
      ctx.lineWidth = 3 * u;
      ctx.beginPath(); ctx.moveTo(-7 * u, -4 * u); ctx.lineTo(-16 * u, 2 * u); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(7 * u, -4 * u); ctx.lineTo(16 * u, 2 * u); ctx.stroke();
      /* tank */
      ctx.fillRect(-13 * u, -80 * u, 7 * u, 26 * u);
      ctx.restore();
      return h;
    }

    function frame(now) {
      var dt = Math.min(.05, (now - last) / 1000 || .016);
      last = now;
      if (!reduced) t += dt;
      view.ppm = U.damp(view.ppm, view.target, .0009, dt);

      ctx.clearRect(0, 0, W, H);

      var baseY = H * .86;
      var ppm = view.ppm;

      /* metre grid */
      ctx.save();
      ctx.strokeStyle = 'rgba(150,210,235,.13)';
      ctx.lineWidth = 1;
      ctx.font = '10px ' + getComputedStyle(document.body).fontFamily;
      ctx.fillStyle = 'rgba(150,210,235,.4)';
      var step = ppm < 12 ? 5 : ppm < 40 ? 1 : ppm < 200 ? .5 : .1;
      for (var m = 0; m * ppm < H * 1.1; m += step) {
        var y = baseY - m * ppm;
        if (y < 0) break;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        if (m > 0 && y > 16) ctx.fillText(m < 1 ? (m * 100).toFixed(0) + ' cm' : m + ' m', 6, y - 4);
      }
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(150,210,235,.35)';
      ctx.moveTo(0, baseY); ctx.lineTo(W, baseY); ctx.stroke();
      ctx.restore();

      var c = list[idx];
      var diverH = drawDiver(ppm, baseY, W * .9);

      /* the fish, drawn as a silhouette at true relative length */
      var sp = DATA.byId(c.art);
      if (sp) {
        var b = FishArt.bounds(sp.art);
        var totalPx = c.len * ppm;                  /* nose-to-tail-tip in px */
        var u = totalPx / (b.x1 - b.x0);            /* px per design unit     */
        var bob = reduced ? 0 : Math.sin(t * .8) * Math.min(9, totalPx * .02);
        var midX = W * .46;
        /* sit the whole drawn shape just above the seabed line */
        var fx = midX + ((b.x0 + b.x1) / 2) * u;
        var fy = Math.max(u * -b.y0 + 14, baseY - 28 - u * b.y1) + bob;

        FishArt.draw(ctx, sp.art, {
          x: fx, y: fy, size: u * 100, angle: Math.PI,
          phase: t * 2.4, silhouette: true, color: 'rgba(226,248,255,.92)', lod: 1
        });

        /* dimension line spanning the whole animal */
        var lenPx = totalPx;
        var x0 = midX - totalPx / 2, x1 = midX + totalPx / 2;
        ctx.save();
        ctx.strokeStyle = 'rgba(63,224,208,.8)';
        ctx.fillStyle = 'rgba(63,224,208,.95)';
        ctx.lineWidth = 1.2;
        var dy = baseY - 9;
        ctx.beginPath();
        ctx.moveTo(x0, dy - 5); ctx.lineTo(x0, dy + 5);
        ctx.moveTo(x0, dy); ctx.lineTo(x1, dy);
        ctx.moveTo(x1, dy - 5); ctx.lineTo(x1, dy + 5);
        ctx.stroke();
        ctx.font = '600 12px ' + getComputedStyle(document.body).fontFamily;
        ctx.textAlign = 'center';
        ctx.fillText(c.len < 1 ? (c.len * 100).toFixed(1) + ' cm' : c.len.toFixed(1) + ' m',
          (x0 + x1) / 2, dy - 10);
        ctx.restore();

        /* When the fish is only a few pixels long, that IS the honest answer —
           so keep it, and add a magnified inset rather than cheat the scale. */
        var insSize = Math.min(W * .26, H * .42);
        if (lenPx < 26 && (insSize * .8) / Math.max(1, lenPx) >= 3) {
          var ins = insSize;
          var ix = W * .22, iy = H * .3;
          ctx.save();
          ctx.strokeStyle = 'rgba(63,224,208,.55)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(fx, fy, Math.max(14, lenPx), 0, U.TAU);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(fx - Math.max(14, lenPx), fy);
          ctx.lineTo(ix + ins / 2, iy);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.beginPath();
          ctx.arc(ix, iy, ins / 2, 0, U.TAU);
          ctx.fillStyle = 'rgba(8,40,58,.6)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(63,224,208,.5)';
          ctx.stroke();
          ctx.restore();

          /* showcase() fits to a box at the origin, so move the origin */
          ctx.save();
          ctx.beginPath();
          ctx.arc(ix, iy, ins / 2 - 1, 0, U.TAU);
          ctx.clip();
          ctx.translate(ix - ins / 2, iy - ins / 2);
          FishArt.showcase(ctx, sp.art, ins, ins, t, .82);
          ctx.restore();

          ctx.save();
          ctx.fillStyle = 'rgba(63,224,208,.9)';
          ctx.font = '600 11px ' + getComputedStyle(document.body).fontFamily;
          ctx.textAlign = 'center';
          ctx.fillText('magnified ×' + Math.round((ins * .8) / Math.max(1, lenPx)), ix, iy + ins / 2 + 16);
          ctx.restore();
        }
      }

      /* diver caption */
      ctx.save();
      ctx.fillStyle = 'rgba(190,230,245,.5)';
      ctx.font = '11px ' + getComputedStyle(document.body).fontFamily;
      ctx.textAlign = 'right';
      ctx.fillText('diver · 1.8 m', W - 6, baseY + 16);
      ctx.restore();

      requestAnimationFrame(frame);
    }

    select(idx);
    requestAnimationFrame(frame);
  };

  /* ================================================================= feed */
  S.feed = function (toast) {
    var dropped = U.$('#pelletsDropped'), eaten = U.$('#pelletsEaten'), frenzy = U.$('#feedFrenzy');
    var pool = U.$('#feedPool');
    var burst = U.$('#feedBurst'), calm = U.$('#calmBtn');
    var milestone = false;

    Tank.on('feed', function (s) {
      if (dropped) dropped.textContent = s.dropped;
      if (eaten) eaten.textContent = s.eaten;
      if (frenzy) {
        var f = Tank.stats().frenzy;
        frenzy.textContent = f > .6 ? 'frenzy' : f > .25 ? 'interested' : 'calm';
      }
      if (!milestone && s.eaten >= 25) {
        milestone = true;
        toast('25 pellets eaten — the shoal has learned where you are');
      }
    });

    if (burst) U.on(burst, 'click', function () { Tank.scatterFood(); });
    if (calm) U.on(calm, 'click', function () { Tank.calm(); toast('Water calmed'); });
    if (pool) U.on(pool, 'pointerdown', function (e) { Tank.feed(e.clientX, e.clientY, 5); });
  };

  /* ================================================================= quiz */
  S.quiz = function (toast) {
    var stage = U.$('#quizStage');
    if (!stage) return;
    var qEl = U.$('#quizQ'), aEl = U.$('#quizAnswers');
    var prog = U.$('#quizProgress'), label = U.$('#quizStepLabel');
    var resultBox = U.$('#quizResult'), card = U.$('.quiz__card');
    var scores = {}, step = 0;
    var resultShowcase = null;

    function render() {
      var q = DATA.QUIZ[step];
      qEl.textContent = q.q;
      aEl.innerHTML = '';
      q.a.forEach(function (a) {
        var b = U.el('button', 'answer', a.t + '<small>' + a.s + '</small>');
        U.on(b, 'click', function () {
          b.classList.add('is-picked');
          Object.keys(a.w).forEach(function (k) { scores[k] = (scores[k] || 0) + a.w[k]; });
          setTimeout(next, reduced ? 0 : 230);
        });
        aEl.appendChild(b);
      });
      prog.style.width = (step / DATA.QUIZ.length * 100) + '%';
      label.textContent = 'Question ' + (step + 1) + ' of ' + DATA.QUIZ.length;
      var wrap = U.$('.quiz__step', stage);
      if (wrap && !reduced) { wrap.classList.remove('quiz__step'); void wrap.offsetWidth; wrap.classList.add('quiz__step'); }
    }

    function next() {
      step++;
      if (step >= DATA.QUIZ.length) return finish();
      render();
    }

    function finish() {
      prog.style.width = '100%';
      label.textContent = 'Result';
      var best = null, bestV = -1;
      Object.keys(scores).forEach(function (k) { if (scores[k] > bestV) { bestV = scores[k]; best = k; } });
      var sp = DATA.byId(best) || DATA.SPECIES[0];

      stage.hidden = true;
      resultBox.hidden = false;
      U.$('#resultName').textContent = sp.name;
      U.$('#resultText').textContent = DATA.RESULT_TEXT[sp.id] || sp.blurb;

      if (!resultShowcase) resultShowcase = addShowcase(U.$('#resultCanvas'), sp.art, { always: true });
      else { resultShowcase.spec = sp.art; }
      setTimeout(function () { resultShowcase.fit(); }, 50);

      Tank.release(sp.id, 2);
      toast('Your <b>' + sp.name + '</b> joined the tank');
    }

    U.on(U.$('#quizRetry'), 'click', function () {
      scores = {}; step = 0;
      stage.hidden = false;
      resultBox.hidden = true;
      render();
      card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    render();
  };

  /* ================================================================== faq */
  S.faq = function () {
    var list = U.$('#faqList');
    if (!list) return;
    DATA.FAQ.forEach(function (f, i) {
      var item = U.el('div', 'faq__item');
      var id = 'faq-' + i;
      item.innerHTML =
        '<button class="faq__q" aria-expanded="false" aria-controls="' + id + '">' +
          '<span>' + f.q + '</span><span class="faq__sign" aria-hidden="true"></span>' +
        '</button>' +
        '<div class="faq__a" id="' + id + '"><p>' + f.a + '</p></div>';
      list.appendChild(item);

      var btn = U.$('.faq__q', item), body = U.$('.faq__a', item);
      U.on(btn, 'click', function () {
        var open = item.classList.contains('is-open');
        U.$$('.faq__item', list).forEach(function (o) {
          if (o === item) return;
          o.classList.remove('is-open');
          U.$('.faq__q', o).setAttribute('aria-expanded', 'false');
          U.$('.faq__a', o).style.height = '0px';
        });
        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
        body.style.height = open ? '0px' : body.scrollHeight + 'px';
      });
    });
    U.on(window, 'resize', U.debounce(function () {
      U.$$('.faq__item.is-open', list).forEach(function (o) {
        U.$('.faq__a', o).style.height = U.$('.faq__a', o).scrollHeight + 'px';
      });
    }, 200));
  };

  /* ================================================================= form */
  S.form = function (toast) {
    var form = U.$('#joinForm');
    if (!form) return;
    var email = U.$('#joinEmail'), err = U.$('#joinErr'), done = U.$('#joinDone');
    var RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    U.on(form, 'submit', function (e) {
      e.preventDefault();
      var field = email.closest('.field');
      if (!RE.test(email.value.trim())) {
        field.classList.add('has-error');
        err.textContent = 'That address does not look quite right.';
        err.classList.add('is-on');
        email.focus();
        return;
      }
      field.classList.remove('has-error');
      err.classList.remove('is-on');

      var name = (U.$('#joinName').value || '').trim();
      U.$('#joinDoneName').textContent = name ? name.split(' ')[0] : 'friend';
      done.hidden = false;

      var interest = (form.querySelector('input[name=interest]:checked') || {}).value;
      var pick = interest === 'deep' ? 'anglerfish' : interest === 'reef' ? 'clownfish' : 'sailfish';
      Tank.release(pick, 2);
      toast('Subscribed — and a fish was released in your honour');
    });

    U.on(email, 'input', function () {
      email.closest('.field').classList.remove('has-error');
      err.classList.remove('is-on');
    });
  };

  /* =============================================================== toasts */
  S.toaster = function () {
    var host = U.$('#toasts');
    return function (html) {
      if (!host) return;
      var t = U.el('div', 'toast', html);
      host.appendChild(t);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4200);
    };
  };

  /* ============================================================= magnetic */
  S.magnetic = function () {
    if (U.isTouch()) return;
    U.$$('.magnetic').forEach(function (b) {
      var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
      function loop() {
        cx = U.lerp(cx, tx, .18); cy = U.lerp(cy, ty, .18);
        b.style.transform = 'translate(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px)';
        if (Math.abs(cx - tx) > .1 || Math.abs(cy - ty) > .1) raf = requestAnimationFrame(loop);
        else { raf = null; b.style.transform = tx || ty ? b.style.transform : ''; }
      }
      U.on(b, 'pointermove', function (e) {
        if (reduced) return;
        var r = b.getBoundingClientRect();
        var mx = e.clientX - r.left, my = e.clientY - r.top;
        b.style.setProperty('--mx', (mx / r.width * 100) + '%');
        tx = (mx - r.width / 2) * .22;
        ty = (my - r.height / 2) * .3;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      U.on(b, 'pointerleave', function () {
        tx = 0; ty = 0;
        if (!raf) raf = requestAnimationFrame(loop);
      });
    });
  };

  /* ================================================================ sound */
  /* A tiny generated soundscape — filtered noise swells plus occasional
     bubble blips. No audio files, and nothing starts without a click. */
  S.sound = function () {
    var btn = U.$('#soundBtn');
    if (!btn) return;
    var actx = null, master = null, on = false, timer = null;

    function build() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      actx = new AC();
      master = actx.createGain();
      master.gain.value = 0;
      master.connect(actx.destination);

      /* brown-ish noise bed */
      var len = actx.sampleRate * 4;
      var buf = actx.createBuffer(1, len, actx.sampleRate);
      var d = buf.getChannelData(0), last = 0;
      for (var i = 0; i < len; i++) {
        var white = Math.random() * 2 - 1;
        last = (last + .02 * white) / 1.02;
        d[i] = last * 3.2;
      }
      var src = actx.createBufferSource();
      src.buffer = buf; src.loop = true;

      var lp = actx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = .7;

      var swell = actx.createGain(); swell.gain.value = .5;
      var lfo = actx.createOscillator(); lfo.frequency.value = .06;
      var lfoGain = actx.createGain(); lfoGain.gain.value = 180;
      lfo.connect(lfoGain); lfoGain.connect(lp.frequency);

      src.connect(lp); lp.connect(swell); swell.connect(master);
      src.start(); lfo.start();
      return true;
    }

    function blip() {
      if (!actx || !on) return;
      var o = actx.createOscillator(), g = actx.createGain();
      var t = actx.currentTime;
      o.type = 'sine';
      o.frequency.setValueAtTime(220 + Math.random() * 500, t);
      o.frequency.exponentialRampToValueAtTime(90 + Math.random() * 120, t + .18);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.05, t + .01);
      g.gain.exponentialRampToValueAtTime(.0001, t + .3);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t + .35);
      timer = setTimeout(blip, 900 + Math.random() * 4200);
    }

    U.on(btn, 'click', function () {
      if (!actx && !build()) return;
      on = !on;
      btn.setAttribute('aria-pressed', String(on));
      if (actx.state === 'suspended') actx.resume();
      var t = actx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(on ? .32 : 0, t + 1.1);
      if (on) timer = setTimeout(blip, 1200);
      else clearTimeout(timer);
    });
  };

  global.Sections = S;
})(window);
