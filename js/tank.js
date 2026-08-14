/* ==========================================================================
   tank.js — the live background aquarium
   ---------------------------------------------------------------------------
   A full-viewport canvas behind the page containing:
     · a depth-driven water gradient, caustics and light shafts
     · parallax marine snow and bubbles
     · a shoal of steered fish (separation / alignment / cohesion / feeding)
     · pointer interaction: fish scatter from fast movement, food sinks on click
   Everything is frame-rate independent and self-throttling.
   ========================================================================== */
(function (global) {
  'use strict';

  var Tank = {};
  var cv, ctx, W = 0, H = 0, DPR = 1;
  var fishes = [], snow = [], bubbles = [], food = [], ripples = [];
  var running = false, reduced = false, lastT = 0, time = 0;
  var quality = 1;                 /* 1 = full, .6 = trimmed, .35 = minimal   */
  var frameAvg = 16, frameSamples = 0;
  var depth = 0;                   /* 0 .. ZONES.length-1, fractional         */
  var zoneIdx = 0;
  var caustics = null;
  var stats = { dropped: 0, eaten: 0, frenzy: 0 };
  var pointer = { x: -9999, y: -9999, px: 0, py: 0, vel: 0, active: false, hold: 0 };
  var listeners = [];

  var AMBIENT = [
    ['clownfish', 'bluetang', 'lionfish', 'bluefin', 'piranha', 'betta'],
    ['bluefin', 'sailfish', 'mola', 'icefish', 'bluetang'],
    ['viperfish', 'anglerfish', 'icefish'],
    ['anglerfish', 'viperfish'],
    ['anglerfish'],
    ['clownfish', 'bluetang', 'bluefin', 'sailfish', 'lionfish']
  ];

  /* -------------------------------------------------------------- helpers */
  function emit(name, payload) {
    listeners.forEach(function (l) { if (l.name === name) l.fn(payload); });
  }
  Tank.on = function (name, fn) { listeners.push({ name: name, fn: fn }); };

  function targetPopulation() {
    var z = DATA.ZONES[Math.min(DATA.ZONES.length - 1, Math.round(depth))];
    var area = (W * H) / (1440 * 800);
    var base = 26 * Math.sqrt(Math.max(.35, Math.min(1.6, area)));
    return Math.round(base * z.density * quality);
  }

  /* --------------------------------------------------------------- agents */
  function makeFish(id, opts) {
    opts = opts || {};
    var s = DATA.byId(id);
    if (!s) return null;
    var z = opts.z != null ? opts.z : U.rand(.42, 1.12);
    var vpScale = U.clamp(Math.min(W, H) / 900, .55, 1.25);
    var len = U.map(s.stats.Size, 0, 100, 44, 168) * z * vpScale;
    var dir = Math.random() < .5 ? 0 : Math.PI;
    var f = {
      id: id, sp: s.art, data: s,
      x: opts.x != null ? opts.x : U.rand(-120, W + 120),
      y: opts.y != null ? opts.y : U.rand(H * .1, H * .92),
      z: z, size: len,
      angle: dir + U.rand(-.4, .4),
      speed: 0, cruise: U.map(s.stats.Speed, 0, 100, 16, 92) * (s.art.speed || 1) * .55 * z,
      phase: U.rand(0, 100),
      wander: U.rand(0, 1000),
      panic: 0, boost: 0,
      fade: opts.instant ? 1 : 0,
      dying: false,
      pinned: !!opts.pinned,
      shoal: Math.random() < .8
    };
    f.speed = f.cruise;
    return f;
  }

  function spawnAmbient(n) {
    var pool = AMBIENT[U.clamp(Math.round(depth), 0, AMBIENT.length - 1)];
    for (var i = 0; i < n; i++) {
      var f = makeFish(U.pick(pool), {});
      if (f) fishes.push(f);
    }
  }

  Tank.release = function (id, count, atPoint) {
    count = count || 1;
    for (var i = 0; i < count; i++) {
      var f = makeFish(id, {
        pinned: true,
        x: atPoint ? atPoint.x : (Math.random() < .5 ? -100 : W + 100),
        y: atPoint ? atPoint.y : U.rand(H * .25, H * .8),
        z: U.rand(.7, 1.1)
      });
      if (!f) return 0;
      fishes.push(f);
      for (var b = 0; b < 6; b++) {
        bubbles.push(makeBubble(f.x + U.rand(-20, 20), f.y + U.rand(-10, 10)));
      }
    }
    emit('count', Tank.count());
    return count;
  };

  /* Drop ambient fish down to the current target. Fish the visitor released
     are never touched here — only the "Reset tank" button clears those. */
  function trimAmbient() {
    var target = targetPopulation(), n = 0;
    for (var i = 0; i < fishes.length; i++) if (!fishes[i].pinned && !fishes[i].dying) n++;
    for (var j = fishes.length - 1; j >= 0 && n > target; j--) {
      if (!fishes[j].pinned && !fishes[j].dying) { fishes[j].dying = true; n--; }
    }
  }

  Tank.reset = function () {
    fishes = fishes.filter(function (f) { return !f.pinned; });
    trimAmbient();
    emit('count', Tank.count());
  };

  Tank.count = function () { return fishes.filter(function (f) { return !f.dying; }).length; };
  Tank.pinnedCount = function () { return fishes.filter(function (f) { return f.pinned; }).length; };

  /* ------------------------------------------------------------ particles */
  function makeSnow() {
    var z = U.rand(.15, 1);
    return {
      x: U.rand(0, W), y: U.rand(0, H), z: z,
      r: U.rand(.5, 2.2) * z + .3,
      vy: U.rand(4, 16) * z,
      vx: U.rand(-4, 4) * z,
      drift: U.rand(0, 100),
      a: U.rand(.12, .5)
    };
  }
  function makeBubble(x, y) {
    var r = U.rand(1.4, 5.5);
    return { x: x, y: y, r: r, vy: -(18 + r * 7), wob: U.rand(0, 10), life: 1 };
  }

  function makeFood(x, y) {
    return { x: x, y: y, vx: U.rand(-8, 8), vy: U.rand(14, 34), r: U.rand(1.6, 3.1), life: 1, taken: false };
  }

  Tank.feed = function (x, y, n) {
    n = n || 1;
    for (var i = 0; i < n; i++) food.push(makeFood(x + U.rand(-18, 18), y + U.rand(-14, 14)));
    stats.dropped += n;
    ripples.push({ x: x, y: y, r: 4, a: .5 });
    emit('feed', stats);
  };
  Tank.scatterFood = function () {
    for (var i = 0; i < 26; i++) Tank.feed(U.rand(W * .15, W * .85), U.rand(H * .12, H * .5), 1);
  };
  Tank.calm = function () {
    food.length = 0;
    fishes.forEach(function (f) { f.panic = 0; f.boost = 0; });
    stats.frenzy = 0;
    emit('feed', stats);
  };
  Tank.stats = function () { return stats; };

  /* -------------------------------------------------------------- caustics */
  function buildCaustics() {
    var s = 160;
    var c = document.createElement('canvas');
    c.width = c.height = s;
    var g = c.getContext('2d');
    var img = g.createImageData(s, s);
    for (var y = 0; y < s; y++) {
      for (var x = 0; x < s; x++) {
        /* layered value noise, sharpened into thin bright filaments */
        var n = U.noise2(x / 11, y / 11) * .55 + U.noise2(x / 5.5, y / 5.5) * .3 + U.noise2(x / 2.6, y / 2.6) * .15;
        var v = Math.pow(Math.max(0, 1 - Math.abs(n) * 3.1), 4.2);
        var i = (y * s + x) * 4;
        img.data[i] = 190; img.data[i + 1] = 245; img.data[i + 2] = 255;
        img.data[i + 3] = v * 190;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }

  /* ----------------------------------------------------------------- draw */
  function zoneBlend() {
    var i = U.clamp(Math.floor(depth), 0, DATA.ZONES.length - 1);
    var j = U.clamp(i + 1, 0, DATA.ZONES.length - 1);
    var t = U.clamp(depth - i, 0, 1);
    var a = DATA.ZONES[i], b = DATA.ZONES[j];
    return {
      top: U.mixHsl(a.top, b.top, t),
      bottom: U.mixHsl(a.bottom, b.bottom, t),
      fog: U.lerp(a.fog, b.fog, t),
      glow: U.lerp(a.glow, b.glow, t),
      light: U.lerp(1, 0, U.clamp(depth / 2.6, 0, 1))
    };
  }

  function drawWater(zb) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, U.hsl(zb.top[0], zb.top[1], zb.top[2] * .55 + 4));
    g.addColorStop(.42, U.hsl(zb.top[0], zb.top[1] * .9, zb.top[2] * .3 + 2));
    g.addColorStop(1, U.hsl(zb.bottom[0], zb.bottom[1], Math.max(2, zb.bottom[2] * .34)));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* surface shimmer + light shafts, only where there is still light */
    if (zb.light > .02 && quality > .4) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      if (caustics) {
        /* tiled, slowly drifting, and faded out with depth rather than
           stopping at a hard line */
        /* two incommensurate layers, drifting at different speeds, so the
           tiling never reads as a grid */
        var band = H * .78;
        var layers = quality > .7 ? [[172, 11, 6, .13], [263, -7, 4, .09]] : [[210, 9, 5, .13]];
        for (var L = 0; L < layers.length; L++) {
          var tile = layers[L][0];
          var ox = ((time * layers[L][1]) % tile + tile) % tile;
          var oy = ((time * layers[L][2]) % tile + tile) % tile;
          var base = layers[L][3] * zb.light * quality;
          for (var cy = -1; cy * tile - oy < band; cy++) {
            var ty = cy * tile - oy;
            /* row-by-row falloff — cheaper than a mask and never leaves a seam */
            var f = U.clamp(1 - (ty + tile * .5) / band, 0, 1);
            ctx.globalAlpha = base * f * f;
            if (ctx.globalAlpha < .004) continue;
            for (var cx = -1; cx * tile - ox < W; cx++) {
              ctx.drawImage(caustics, cx * tile - ox, ty, tile, tile);
            }
          }
        }
        ctx.globalAlpha = 1;
      }

      /* god rays */
      var rays = quality > .7 ? 6 : 3;
      for (var i = 0; i < rays; i++) {
        var seed = i * 137.7;
        var x = ((i + .5) / rays) * W + U.noise1(time * .07 + seed) * W * .12;
        var w = W * (.05 + .04 * ((i % 3) / 2)) * (1 + U.noise1(time * .12 + seed) * .25);
        var lean = U.noise1(time * .05 + seed * .3) * .22;
        var rg = ctx.createLinearGradient(x, -50, x + lean * H, H * .95);
        rg.addColorStop(0, 'rgba(200,248,255,' + (.10 * zb.light).toFixed(3) + ')');
        rg.addColorStop(.55, 'rgba(170,235,255,' + (.045 * zb.light).toFixed(3) + ')');
        rg.addColorStop(1, 'rgba(150,220,255,0)');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(x - w * .35, -50);
        ctx.lineTo(x + w * .35, -50);
        ctx.lineTo(x + lean * H + w * 1.5, H);
        ctx.lineTo(x + lean * H - w * 1.5, H);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawSnow(zb) {
    ctx.save();
    for (var i = 0; i < snow.length; i++) {
      var p = snow[i];
      var a = p.a * (0.35 + zb.fog * 2.2);
      ctx.fillStyle = 'rgba(214,244,255,' + Math.min(.6, a).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, U.TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawBubbles() {
    ctx.save();
    ctx.strokeStyle = 'rgba(220,250,255,.5)';
    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i];
      ctx.globalAlpha = b.life * .75;
      ctx.lineWidth = Math.max(.6, b.r * .22);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, U.TAU);
      ctx.stroke();
      ctx.globalAlpha = b.life * .25;
      ctx.fillStyle = 'rgba(235,253,255,.6)';
      ctx.beginPath();
      ctx.arc(b.x - b.r * .3, b.y - b.r * .35, b.r * .34, 0, U.TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawFood() {
    ctx.save();
    for (var i = 0; i < food.length; i++) {
      var f = food[i];
      ctx.globalAlpha = f.life;
      ctx.fillStyle = 'rgba(255,196,120,.95)';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, U.TAU);
      ctx.fill();
      ctx.globalAlpha = f.life * .3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 2.6, 0, U.TAU);
      ctx.fillStyle = 'rgba(255,180,90,.4)';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawRipples() {
    ctx.save();
    for (var i = 0; i < ripples.length; i++) {
      var r = ripples[i];
      ctx.globalAlpha = r.a;
      ctx.strokeStyle = 'rgba(190,245,255,.8)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, U.TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------------- steer */
  var grid = {}, CELL = 90;
  function hashKey(x, y) { return ((x / CELL) | 0) + ':' + ((y / CELL) | 0); }
  function rebuildGrid() {
    grid = {};
    for (var i = 0; i < fishes.length; i++) {
      var k = hashKey(fishes[i].x, fishes[i].y);
      (grid[k] || (grid[k] = [])).push(fishes[i]);
    }
  }
  function neighbours(f) {
    var out = [], gx = (f.x / CELL) | 0, gy = (f.y / CELL) | 0;
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        var c = grid[(gx + i) + ':' + (gy + j)];
        if (c) for (var k = 0; k < c.length; k++) if (c[k] !== f) out.push(c[k]);
      }
    }
    return out;
  }

  function steer(f, dt) {
    var sx = 0, sy = 0;            /* separation */
    var ax = 0, ay = 0, an = 0;    /* alignment  */
    var cx = 0, cy = 0, cn = 0;    /* cohesion   */
    var nb = neighbours(f), i, o, dx, dy, d2, d;

    for (i = 0; i < nb.length; i++) {
      o = nb[i];
      dx = f.x - o.x; dy = f.y - o.y;
      d2 = dx * dx + dy * dy;
      if (d2 < 1 || d2 > 130 * 130) continue;
      d = Math.sqrt(d2);
      /* personal space scales with body size */
      var near = (f.size + o.size) * .38;
      if (d < near) { sx += (dx / d) * (1 - d / near); sy += (dy / d) * (1 - d / near); }
      if (f.shoal && o.id === f.id) {
        ax += Math.cos(o.angle); ay += Math.sin(o.angle); an++;
        cx += o.x; cy += o.y; cn++;
      }
    }

    var wx = 0, wy = 0;
    /* wander — smooth noise, not random jitter */
    f.wander += dt * .55;
    var wa = U.noise1(f.wander) * Math.PI;
    wx += Math.cos(f.angle + wa) * .55;
    wy += Math.sin(f.angle + wa) * .55;

    /* gentle vertical preference: deep fish hang low, reef fish stay mid-water */
    var pref = H * (0.3 + (f.z * .35));
    wy += U.clamp((pref - f.y) / (H * .9), -.6, .6) * .35;

    /* food */
    var best = null, bestD = 999999;
    for (i = 0; i < food.length; i++) {
      o = food[i];
      if (o.taken) continue;
      dx = o.x - f.x; dy = o.y - f.y;
      d2 = dx * dx + dy * dy;
      if (d2 < bestD && d2 < 340 * 340) { bestD = d2; best = o; }
    }
    var hunger = 0;
    if (best) {
      d = Math.sqrt(bestD) || 1;
      hunger = U.clamp(1 - d / 340, 0, 1);
      wx += ((best.x - f.x) / d) * 2.6 * hunger;
      wy += ((best.y - f.y) / d) * 2.6 * hunger;
      if (d < 10 + f.size * .12) {
        best.taken = true;
        stats.eaten++;
        f.boost = 1;
        for (var b = 0; b < 2; b++) bubbles.push(makeBubble(f.x, f.y - 4));
        emit('feed', stats);
      }
    }

    /* pointer: fear when it moves fast, mild curiosity when it rests */
    dx = f.x - pointer.x; dy = f.y - pointer.y;
    d2 = dx * dx + dy * dy;
    if (d2 < 240 * 240 && pointer.active) {
      d = Math.sqrt(d2) || 1;
      var prox = 1 - d / 240;
      if (pointer.vel > 260) {
        f.panic = Math.min(1, f.panic + prox * .9);
        wx += (dx / d) * prox * 5.5;
        wy += (dy / d) * prox * 5.5;
      } else if (pointer.hold > .7 && d > 70) {
        wx -= (dx / d) * prox * .8;
        wy -= (dy / d) * prox * .8;
      } else if (d < 90) {
        wx += (dx / d) * (1 - d / 90) * 2.2;
        wy += (dy / d) * (1 - d / 90) * 2.2;
      }
    }

    /* flock weights */
    wx += sx * 2.2 + (an ? (ax / an) * .9 : 0) + (cn ? ((cx / cn - f.x) / 260) * .8 : 0);
    wy += sy * 2.2 + (an ? (ay / an) * .9 : 0) + (cn ? ((cy / cn - f.y) / 260) * .8 : 0);

    /* soft bounds — fish turn back before they leave the frame */
    var m = 90 + f.size * .5;
    if (f.x < m) wx += (1 - f.x / m) * 3.4;
    if (f.x > W - m) wx -= (1 - (W - f.x) / m) * 3.4;
    if (f.y < m * .7) wy += (1 - f.y / (m * .7)) * 3.4;
    if (f.y > H - m * .7) wy -= (1 - (H - f.y) / (m * .7)) * 3.4;

    /* --- convert the desired direction into a limited turn --------------- */
    var want = Math.atan2(wy, wx);
    var diff = U.angleDiff(f.angle, want);
    var agility = U.map(f.data.stats.Speed, 0, 100, 2.6, 1.5); /* fast fish turn wider */
    var maxTurn = (agility + f.panic * 3) * dt;
    f.angle += U.clamp(diff, -maxTurn, maxTurn);

    /* speed: cruise, plus urgency from panic / hunger / food boost */
    var wantSpeed = f.cruise * (1 + f.panic * 2.1 + hunger * 1.1 + f.boost * .8);
    f.speed = U.damp(f.speed, wantSpeed, .0015, dt);
    f.panic = U.damp(f.panic, 0, .22, dt);
    f.boost = U.damp(f.boost, 0, .04, dt);

    f.x += Math.cos(f.angle) * f.speed * dt;
    f.y += Math.sin(f.angle) * f.speed * dt;

    /* tail beats faster the harder it swims */
    f.phase += dt * (3.4 + f.speed * .085) * (f.sp.waveFreq || 1) * 2.2;
  }

  /* ----------------------------------------------------------------- step */
  function update(dt) {
    var i, p;

    /* population drift towards the current zone's mix */
    var target = targetPopulation();
    var ambient = 0;
    for (i = 0; i < fishes.length; i++) if (!fishes[i].pinned && !fishes[i].dying) ambient++;
    if (ambient < target && Math.random() < dt * 2.6) spawnAmbient(1);
    if (ambient > target + 2) {
      for (i = 0; i < fishes.length; i++) {
        if (!fishes[i].pinned && !fishes[i].dying) { fishes[i].dying = true; break; }
      }
    }

    rebuildGrid();
    for (i = fishes.length - 1; i >= 0; i--) {
      var f = fishes[i];
      steer(f, dt);
      f.fade = U.damp(f.fade, f.dying ? 0 : 1, .02, dt);
      if (f.dying && f.fade < .02) fishes.splice(i, 1);
    }

    /* marine snow */
    for (i = 0; i < snow.length; i++) {
      p = snow[i];
      p.drift += dt;
      p.x += (p.vx + Math.sin(p.drift * .6) * 6 * p.z) * dt;
      p.y += p.vy * dt;
      if (p.y > H + 6) { p.y = -6; p.x = U.rand(0, W); }
      if (p.x < -8) p.x = W + 8; else if (p.x > W + 8) p.x = -8;
    }

    /* bubbles */
    for (i = bubbles.length - 1; i >= 0; i--) {
      var b = bubbles[i];
      b.wob += dt * 3;
      b.y += b.vy * dt;
      b.x += Math.sin(b.wob) * 12 * dt;
      b.life -= dt * .16;
      if (b.y < -20 || b.life <= 0) bubbles.splice(i, 1);
    }
    if (Math.random() < dt * 1.1 && bubbles.length < 60 * quality) {
      bubbles.push(makeBubble(U.rand(0, W), H + 10));
    }

    /* food */
    for (i = food.length - 1; i >= 0; i--) {
      var fd = food[i];
      fd.vy = U.damp(fd.vy, 26, .3, dt);
      fd.x += fd.vx * dt;
      fd.vx *= (1 - dt * .8);
      fd.y += fd.vy * dt;
      if (fd.taken) fd.life -= dt * 6;
      else if (fd.y > H - 20) fd.life -= dt * .5;
      if (fd.life <= 0 || fd.y > H + 30) food.splice(i, 1);
    }
    stats.frenzy = U.damp(stats.frenzy, food.length ? Math.min(1, food.length / 14) : 0, .05, dt);

    /* ripples */
    for (i = ripples.length - 1; i >= 0; i--) {
      var r = ripples[i];
      r.r += dt * 190;
      r.a -= dt * .9;
      if (r.a <= 0) ripples.splice(i, 1);
    }

    /* pointer decay */
    pointer.vel = U.damp(pointer.vel, 0, .0005, dt);
    pointer.hold = pointer.vel < 40 ? Math.min(2, pointer.hold + dt) : 0;
  }

  function render() {
    var zb = zoneBlend();
    ctx.clearRect(0, 0, W, H);
    drawWater(zb);
    if (quality > .4) drawSnow(zb);

    /* far fish first so nearer ones overlap them */
    fishes.sort(function (a, b) { return a.z - b.z; });

    for (var i = 0; i < fishes.length; i++) {
      var f = fishes[i];
      /* atmospheric perspective: distant fish fade into the water colour */
      var far = U.clamp(1 - (f.z - .35) / .8, 0, 1);
      var alpha = f.fade * (1 - far * (.35 + zb.fog * 1.4));
      if (alpha < .02) continue;
      FishArt.draw(ctx, f.sp, {
        x: f.x, y: f.y, size: f.size, angle: f.angle, phase: f.phase,
        alpha: alpha,
        lod: (f.z > .7 && quality > .5) ? 1 : 0,
        glow: .5 + zb.glow * 1.4
      });
    }

    drawFood();
    drawBubbles();
    drawRipples();

    /* depth fog sitting over everything */
    if (zb.fog > .02) {
      ctx.fillStyle = U.hsl(zb.bottom[0], zb.bottom[1], zb.bottom[2] * .5, zb.fog * .85);
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ----------------------------------------------------------------- loop */
  function frame(now) {
    if (!running) return;
    var dt = Math.min(.05, (now - lastT) / 1000 || .016);
    lastT = now;
    time += dt;

    /* self-throttle: watch the rolling frame cost and drop quality tiers */
    frameAvg = frameAvg * .92 + (dt * 1000) * .08;
    if (++frameSamples > 90) {
      frameSamples = 0;
      if (frameAvg > 30 && quality > .36) { quality = Math.max(.35, quality - .25); trimAmbient(); }
      else if (frameAvg < 19 && quality < 1) quality = Math.min(1, quality + .15);
    }

    update(dt);
    render();
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- setup */
  function resize() {
    var fit = U.fitCanvas(cv, 2);
    W = fit.w; H = fit.h; DPR = fit.dpr; ctx = fit.ctx;
    var want = Math.round(U.clamp((W * H) / 9000, 40, 190) * quality);
    while (snow.length < want) snow.push(makeSnow());
    while (snow.length > want) snow.pop();
  }

  function bindPointer() {
    var lastMove = 0;
    function move(x, y) {
      var now = performance.now();
      var dt = Math.max(8, now - lastMove) / 1000;
      lastMove = now;
      var dx = x - pointer.x, dy = y - pointer.y;
      if (pointer.x > -9000) pointer.vel = U.clamp(Math.hypot(dx, dy) / dt, 0, 4000);
      pointer.x = x; pointer.y = y; pointer.active = true;
    }
    U.on(window, 'pointermove', function (e) { move(e.clientX, e.clientY); }, { passive: true });
    U.on(window, 'pointerleave', function () { pointer.active = false; pointer.x = pointer.y = -9999; });

    /* clicking the page — but not its controls — drops food */
    U.on(window, 'pointerdown', function (e) {
      if (e.target.closest('a,button,input,label,select,textarea,.drawer__panel,.chip,.answer,.faq__q')) return;
      Tank.feed(e.clientX, e.clientY, 3);
    });
  }

  Tank.setDepth = function (d) {
    depth = U.clamp(d, 0, DATA.ZONES.length - 1);
    var z = Math.round(depth);
    if (z !== zoneIdx) {
      zoneIdx = z;
      /* let the ambient population turn over towards the new zone */
      var pool = AMBIENT[U.clamp(z, 0, AMBIENT.length - 1)];
      fishes.forEach(function (f) {
        if (!f.pinned && pool.indexOf(f.id) === -1 && Math.random() < .9) f.dying = true;
      });
    }
  };
  Tank.getDepth = function () { return depth; };

  Tank.setReduced = function (on) {
    reduced = on;
    if (on) {
      running = false;
      /* one calm, still frame instead of an empty canvas */
      requestAnimationFrame(function () { update(.016); render(); });
    } else if (!running) {
      running = true; lastT = performance.now(); requestAnimationFrame(frame);
    }
  };

  Tank.init = function (canvas, opts) {
    cv = canvas;
    opts = opts || {};
    reduced = !!opts.reduced;
    quality = opts.quality || (U.isSmall() ? .6 : 1);
    resize();
    caustics = buildCaustics();
    spawnAmbient(targetPopulation());
    fishes.forEach(function (f) { f.fade = 1; });
    bindPointer();

    U.on(window, 'resize', U.debounce(resize, 180));
    U.on(document, 'visibilitychange', function () {
      if (document.hidden) { running = false; }
      else if (!reduced) { running = true; lastT = performance.now(); requestAnimationFrame(frame); }
    });

    if (reduced) { update(.016); render(); }
    else { running = true; lastT = performance.now(); requestAnimationFrame(frame); }
  };

  global.Tank = Tank;
})(window);
