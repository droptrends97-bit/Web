/* ==========================================================================
   fish-art.js — procedural fish rendering
   ---------------------------------------------------------------------------
   Every fish is a flexible spine of segments. A travelling sine wave runs from
   head to tail; the body outline is rebuilt around that spine each frame, then
   filled, patterned, finned and given an eye. The caudal fin is simply the
   spine continued past the body, so the tail sweep falls out of the same wave
   instead of being animated separately.

   Design space: nose at x = +50, tail base at x = -50 (100 units long),
   the fish faces +x, and y grows downwards (canvas convention).
   ========================================================================== */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  var FishArt = {};

  /* ------------------------------------------------------------- profiles */
  /* Half-height of the body at spine position s (0 = nose, 1 = tail base). */
  function profile(s, shape, head) {
    var v;
    switch (shape) {
      case 'disc':
        v = Math.pow(Math.sin(Math.PI * Math.pow(s, 0.88)), 0.55); break;
      case 'eel':
        v = Math.pow(Math.sin(Math.PI * Math.pow(s, 0.42)), 0.3) * (1 - 0.5 * s); break;
      case 'shark':
        v = Math.pow(Math.sin(Math.PI * Math.pow(s, 0.6)), 0.72) * (1 - 0.36 * s); break;
      default: /* fusiform */
        v = Math.pow(Math.sin(Math.PI * Math.pow(s, 0.72)), 0.82);
    }
    /* blunter or more pointed head, applied over the first third */
    if (s < 0.34) {
      var k = s / 0.34;
      v *= (1 - k) * (0.45 + head * 0.95) + k;
    }
    return v;
  }

  /* --------------------------------------------------------------- spine */
  /* Returns sampled points along the spine, including the stretch past the
     body that the caudal fin is built on. */
  function buildSpine(sp, phase, segs, tailReach) {
    var pts = [], i, s, x, y;
    var waves = (sp.shape === 'eel' ? 1.5 : 0.85) * (sp.waveFreq || 1);
    var amp = 7.5 * (sp.waveAmp || 1);
    var lastS = 1 + tailReach;
    var n = segs + Math.round(segs * tailReach);

    for (i = 0; i <= n; i++) {
      s = (i / n) * lastS;
      x = 50 - s * 100;
      /* amplitude grows towards the tail — heads barely move */
      var a = amp * Math.pow(Math.min(s, 1.4), 1.9) * (sp.shape === 'eel' ? 1.25 : 1);
      y = a * Math.sin(s * waves * TAU - phase);
      pts.push({ x: x, y: y, s: s });
    }
    /* tangents + normals */
    for (i = 0; i <= n; i++) {
      var p0 = pts[Math.max(0, i - 1)], p1 = pts[Math.min(n, i + 1)];
      var tx = p1.x - p0.x, ty = p1.y - p0.y;
      var len = Math.hypot(tx, ty) || 1;
      tx /= len; ty /= len;
      pts[i].tx = tx; pts[i].ty = ty;
      pts[i].nx = ty; pts[i].ny = -tx;   /* "up" normal */
    }
    return pts;
  }

  /* point on the spine at arbitrary s (linear search is fine: <40 points) */
  function at(pts, s) {
    for (var i = 1; i < pts.length; i++) {
      if (pts[i].s >= s) {
        var a = pts[i - 1], b = pts[i];
        var t = (s - a.s) / ((b.s - a.s) || 1);
        return {
          x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
          nx: a.nx + (b.nx - a.nx) * t, ny: a.ny + (b.ny - a.ny) * t,
          tx: a.tx + (b.tx - a.tx) * t, ty: a.ty + (b.ty - a.ty) * t, s: s
        };
      }
    }
    return pts[pts.length - 1];
  }

  /* smooth closed path through a list of points */
  function smoothPath(ctx, list, close) {
    if (list.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(list[0].x, list[0].y);
    for (var i = 1; i < list.length - 1; i++) {
      var mx = (list[i].x + list[i + 1].x) / 2;
      var my = (list[i].y + list[i + 1].y) / 2;
      ctx.quadraticCurveTo(list[i].x, list[i].y, mx, my);
    }
    var last = list[list.length - 1];
    ctx.lineTo(last.x, last.y);
    if (close !== false) ctx.closePath();
  }

  function hsl(c, l, a) {
    return 'hsla(' + c[0] + ',' + c[1] + '%,' + Math.max(0, Math.min(100, c[2] + (l || 0))) + '%,' + (a == null ? 1 : a) + ')';
  }

  /* --------------------------------------------------------------- outline */
  function bodyOutline(sp, pts, depth) {
    var up = [], down = [], i, p, h;
    var bodyEnd = 0;
    for (i = 0; i < pts.length; i++) if (pts[i].s <= 1.0001) bodyEnd = i;

    for (i = 0; i <= bodyEnd; i++) {
      p = pts[i];
      /* the peduncle never tapers to nothing, so the caudal fin has
         something to attach to */
      h = Math.max(profile(p.s, sp.shape, sp.head), p.s > 0.5 ? 0.062 : 0) * depth;
      up.push({ x: p.x + p.nx * h, y: p.y + p.ny * h });
      down.push({ x: p.x - p.nx * h * 1.06, y: p.y - p.ny * h * 1.06 });
    }
    return up.concat(down.reverse());
  }

  /* ----------------------------------------------------------------- fins */
  function drawFin(ctx, poly, fill, stroke, alpha) {
    ctx.globalAlpha = alpha;
    smoothPath(ctx, poly);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 0.7; ctx.stroke(); }
    ctx.globalAlpha = 1;
  }

  /* body half-height at s, including the peduncle minimum */
  function edge(sp, s, depth) {
    return Math.max(profile(s, sp.shape, sp.head), s > 0.5 ? 0.062 : 0) * depth * 0.92;
  }

  /* A fin running along the body between s0 and s1. Its inner edge sits on
     the body outline, so `height` is how far it stands proud of the fish. */
  function ribbonFin(sp, pts, depth, s0, s1, height, dir, curve) {
    var poly = [], i, n = 10, p, s, k, h, e;
    for (i = 0; i <= n; i++) {
      s = s0 + (s1 - s0) * (i / n);
      p = at(pts, s);
      e = edge(sp, s, depth) * dir;
      poly.push({ x: p.x + p.nx * e, y: p.y + p.ny * e });
    }
    for (i = n; i >= 0; i--) {
      s = s0 + (s1 - s0) * (i / n);
      p = at(pts, s);
      k = i / n;
      h = edge(sp, s, depth) + height * Math.sin(Math.PI * Math.pow(k, curve || 1));
      poly.push({ x: p.x + p.nx * h * dir, y: p.y + p.ny * h * dir });
    }
    return poly;
  }

  function drawSpinyFin(ctx, sp, pts, depth, s0, s1, height, dir, colFill, colRay, alpha) {
    var n = 8, i, s, p, h, e;
    var poly = [], inner = [], outer = [];
    for (i = 0; i <= n; i++) {
      s = s0 + (s1 - s0) * (i / n);
      p = at(pts, s);
      e = edge(sp, s, depth);
      h = e + height * (0.45 + 0.55 * Math.sin(Math.PI * (i / n)));
      inner.push({ x: p.x + p.nx * e * dir, y: p.y + p.ny * e * dir });
      outer.push({ x: p.x + p.nx * h * dir, y: p.y + p.ny * h * dir });
    }
    poly = inner.concat(outer.slice().reverse());
    drawFin(ctx, poly, colFill, null, alpha);

    /* the rays that stiffen the membrane */
    ctx.globalAlpha = alpha * 0.85;
    ctx.strokeStyle = colRay || colFill;
    ctx.lineWidth = 1.1;
    ctx.lineCap = 'round';
    for (i = 0; i <= n; i++) {
      ctx.beginPath();
      ctx.moveTo(inner[i].x, inner[i].y);
      ctx.lineTo(outer[i].x, outer[i].y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawTail(ctx, sp, pts, depth, fill, stroke, alpha) {
    /* start just inside the body so the fin and the peduncle overlap */
    var base = at(pts, 0.93);
    var tip = pts[pts.length - 1];
    var dx = tip.x - base.x, dy = tip.y - base.y;
    var nx = tip.nx, ny = tip.ny;
    var w = depth * (0.55 + sp.tailSize * 0.9);
    var poly;

    switch (sp.tail) {
      case 'lunate':
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 1.05 + nx * w * 1.5, y: base.y + dy * 1.05 + ny * w * 1.5 },
          { x: base.x + dx * 1.15 + nx * w * 1.15, y: base.y + dy * 1.15 + ny * w * 1.15 },
          { x: base.x + dx * 0.4, y: base.y + dy * 0.4 },
          { x: base.x + dx * 1.15 - nx * w * 1.15, y: base.y + dy * 1.15 - ny * w * 1.15 },
          { x: base.x + dx * 1.05 - nx * w * 1.5, y: base.y + dy * 1.05 - ny * w * 1.5 }
        ];
        break;
      case 'round':
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 0.72 + nx * w * 1.05, y: base.y + dy * 0.72 + ny * w * 1.05 },
          { x: base.x + dx * 1.12 + nx * w * 0.5, y: base.y + dy * 1.12 + ny * w * 0.5 },
          { x: base.x + dx * 1.2, y: base.y + dy * 1.2 },
          { x: base.x + dx * 1.12 - nx * w * 0.5, y: base.y + dy * 1.12 - ny * w * 0.5 },
          { x: base.x + dx * 0.72 - nx * w * 1.05, y: base.y + dy * 0.72 - ny * w * 1.05 }
        ];
        break;
      case 'fan':
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 0.55 + nx * w * 1.05, y: base.y + dy * 0.55 + ny * w * 1.05 },
          { x: base.x + dx * 1.1 + nx * w * 0.95, y: base.y + dy * 1.1 + ny * w * 0.95 },
          { x: base.x + dx * 1.4 + nx * w * 0.3, y: base.y + dy * 1.4 + ny * w * 0.3 },
          { x: base.x + dx * 1.4 - nx * w * 0.3, y: base.y + dy * 1.4 - ny * w * 0.3 },
          { x: base.x + dx * 1.1 - nx * w * 0.95, y: base.y + dy * 1.1 - ny * w * 0.95 },
          { x: base.x + dx * 0.55 - nx * w * 1.05, y: base.y + dy * 0.55 - ny * w * 1.05 }
        ];
        break;
      case 'truncate':
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 0.9 + nx * w * 0.95, y: base.y + dy * 0.9 + ny * w * 0.95 },
          { x: base.x + dx * 1.0 + nx * w * 0.9, y: base.y + dy * 1.0 + ny * w * 0.9 },
          { x: base.x + dx * 1.0 - nx * w * 0.9, y: base.y + dy * 1.0 - ny * w * 0.9 },
          { x: base.x + dx * 0.9 - nx * w * 0.95, y: base.y + dy * 0.9 - ny * w * 0.95 }
        ];
        break;
      case 'shark': /* heterocercal — long upper lobe */
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 0.9 + nx * w * 1.9, y: base.y + dy * 0.9 + ny * w * 1.9 },
          { x: base.x + dx * 1.35 + nx * w * 1.55, y: base.y + dy * 1.35 + ny * w * 1.55 },
          { x: base.x + dx * 0.55 + nx * w * 0.15, y: base.y + dy * 0.55 + ny * w * 0.15 },
          { x: base.x + dx * 1.1 - nx * w * 0.85, y: base.y + dy * 1.1 - ny * w * 0.85 },
          { x: base.x + dx * 0.85 - nx * w * 0.95, y: base.y + dy * 0.85 - ny * w * 0.95 }
        ];
        break;
      default: /* fork */
        poly = [
          { x: base.x, y: base.y },
          { x: base.x + dx * 0.95 + nx * w * 1.25, y: base.y + dy * 0.95 + ny * w * 1.25 },
          { x: base.x + dx * 1.15 + nx * w * 1.05, y: base.y + dy * 1.15 + ny * w * 1.05 },
          { x: base.x + dx * 0.55, y: base.y + dy * 0.55 },
          { x: base.x + dx * 1.15 - nx * w * 1.05, y: base.y + dy * 1.15 - ny * w * 1.05 },
          { x: base.x + dx * 0.95 - nx * w * 1.25, y: base.y + dy * 0.95 - ny * w * 1.25 }
        ];
    }
    /* fins are membranes: dense where they leave the body, sheer at the tip */
    if (typeof fill === 'string' && fill.indexOf('hsla') === 0) {
      var g = ctx.createLinearGradient(base.x, base.y, base.x + dx * 1.25, base.y + dy * 1.25);
      g.addColorStop(0, fill);
      g.addColorStop(1, fill.replace(/,\s*([\d.]+)\)$/, function (m, a) {
        return ',' + (parseFloat(a) * 0.42).toFixed(3) + ')';
      }));
      fill = g;
    }
    drawFin(ctx, poly, fill, stroke, alpha);
  }

  /* -------------------------------------------------------------- patterns */
  function drawPattern(ctx, sp, pts, depth) {
    var i, s, p, h, poly, n;
    var col = sp.patternColor;
    ctx.globalAlpha = sp.patternAlpha;

    if (sp.pattern === 'bars' || sp.pattern === 'stripes') {
      n = sp.patternCount;
      var thick = sp.pattern === 'bars' ? 0.075 : 0.018;
      for (i = 0; i < n; i++) {
        s = 0.13 + (i + 0.5) / n * 0.74;
        poly = [];
        var a = at(pts, Math.max(0.02, s - thick)), b = at(pts, Math.min(0.99, s + thick));
        h = depth * 1.3;
        /* slight backwards slant, like real bars */
        poly.push({ x: a.x + a.nx * h, y: a.y + a.ny * h });
        poly.push({ x: b.x + b.nx * h * 0.9, y: b.y + b.ny * h * 0.9 });
        poly.push({ x: b.x - b.nx * h, y: b.y - b.ny * h });
        poly.push({ x: a.x - a.nx * h * 0.9, y: a.y - a.ny * h * 0.9 });
        smoothPath(ctx, poly);
        ctx.fillStyle = hsl(col, 0);
        ctx.fill();
      }
    } else if (sp.pattern === 'dots') {
      n = sp.patternCount;
      for (i = 0; i < n; i++) {
        s = 0.14 + (i / n) * 0.8;
        p = at(pts, s);
        /* photophores hug the belly line, freckles scatter */
        var side = sp.glow > 0 ? -1 : (i % 3 - 1) * 0.55;
        h = depth * profile(s, sp.shape, sp.head) * (sp.glow > 0 ? 0.78 : 0.55) * side;
        ctx.beginPath();
        ctx.arc(p.x + p.nx * h, p.y + p.ny * h, sp.glow > 0 ? 1.15 : 1.5, 0, TAU);
        ctx.fillStyle = hsl(col, 0);
        ctx.fill();
      }
    } else if (sp.pattern === 'net') {
      ctx.strokeStyle = hsl(col, 0);
      ctx.lineWidth = 0.8;
      for (i = 0; i < sp.patternCount; i++) {
        s = 0.2 + (i / sp.patternCount) * 0.7;
        var q = at(pts, s);
        h = depth * 1.2;
        ctx.beginPath();
        ctx.moveTo(q.x + q.nx * h, q.y + q.ny * h);
        ctx.lineTo(q.x - q.nx * h, q.y - q.ny * h);
        ctx.stroke();
      }
      for (i = -2; i <= 2; i++) {
        ctx.beginPath();
        for (var j = 0; j <= 10; j++) {
          var pp = at(pts, 0.1 + j / 10 * 0.85);
          var hh = depth * profile(pp.s, sp.shape, sp.head) * (i * 0.36);
          var px = pp.x + pp.nx * hh, py = pp.y + pp.ny * hh;
          if (j === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    } else if (sp.pattern === 'palette') {
      /* the blue tang's black "palette" marking */
      var a2 = at(pts, 0.34), m2 = at(pts, 0.58), b2 = at(pts, 0.8);
      var h2 = depth * 0.95;
      poly = [
        { x: a2.x + a2.nx * h2 * 0.42, y: a2.y + a2.ny * h2 * 0.42 },
        { x: m2.x + m2.nx * h2 * 0.62, y: m2.y + m2.ny * h2 * 0.62 },
        { x: b2.x + b2.nx * h2 * 0.52, y: b2.y + b2.ny * h2 * 0.52 },
        { x: b2.x + b2.nx * h2 * 0.24, y: b2.y + b2.ny * h2 * 0.24 },
        { x: m2.x + m2.nx * h2 * 0.06, y: m2.y + m2.ny * h2 * 0.06 },
        { x: a2.x + a2.nx * h2 * 0.16, y: a2.y + a2.ny * h2 * 0.16 }
      ];
      smoothPath(ctx, poly);
      ctx.fillStyle = hsl(col, 0);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ----------------------------------------------------------------- main */
  /*  draw(ctx, spec, o)
   *  o = { x, y, size, angle, phase, alpha, silhouette, color, lod, glow }
   */
  FishArt.draw = function (ctx, sp, o) {
    var size = o.size || 100;
    var lod = o.lod == null ? 1 : o.lod;               /* 0 = cheap, 1 = full */
    var segs = lod > .5 ? 22 : 12;
    var depth = sp.bodyDepth * 50;
    var tailReach = 0.12 + sp.tailSize * 0.16;
    var pts = buildSpine(sp, o.phase || 0, segs, tailReach);
    var alpha = o.alpha == null ? 1 : o.alpha;

    ctx.save();
    ctx.translate(o.x, o.y);
    ctx.rotate(o.angle || 0);
    /* keep the fish upright when swimming leftwards */
    if (Math.abs(((o.angle || 0) % TAU + TAU) % TAU - Math.PI) < Math.PI / 2) ctx.scale(1, -1);
    ctx.scale(size / 100, size / 100);
    ctx.globalAlpha = alpha;

    var finFill, finRay, bodyGrad;
    if (o.silhouette) {
      finFill = o.color || '#000';
      finRay = null;
    } else {
      var fc = sp.finColor || sp.mid;
      finFill = hsl(fc, 0, sp.finAlpha);
      finRay = hsl(fc, -14, Math.min(1, sp.finAlpha + .2));
    }

    /* --- bioluminescent halo ------------------------------------------- */
    var glow = (sp.glow || 0) * (o.glow == null ? 1 : o.glow);
    if (glow > 0 && !o.silhouette && lod > .5) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var g = ctx.createRadialGradient(0, 0, 2, 0, 0, 95);
      g.addColorStop(0, 'rgba(120,240,255,' + (0.22 * glow).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(80,200,255,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, 95, 0, TAU); ctx.fill();
      ctx.restore();
    }

    /* --- fins behind the body ------------------------------------------ */
    drawTail(ctx, sp, pts, depth, finFill, finRay, alpha);

    if (sp.dorsalStyle === 'sail') {
      drawSpinyFin(ctx, sp, pts, depth, 0.16, 0.72, depth * 2.2 * sp.dorsal, 1, finFill, finRay, alpha * .9);
    } else if (sp.dorsalStyle === 'spiny') {
      drawSpinyFin(ctx, sp, pts, depth, 0.2, 0.66, depth * 0.62 * sp.dorsal, 1, finFill, finRay, alpha * .95);
    } else if (sp.dorsalStyle === 'wing') {
      drawFin(ctx, ribbonFin(sp, pts, depth, 0.6, 0.97, depth * 1.2 * sp.dorsal, 1, 1.7), finFill, finRay, alpha);
    } else if (sp.dorsalStyle === 'long') {
      drawFin(ctx, ribbonFin(sp, pts, depth, 0.16, 0.9, depth * 0.36 * sp.dorsal, 1, 1), finFill, finRay, alpha * .9);
    } else {
      drawFin(ctx, ribbonFin(sp, pts, depth, 0.28, 0.62, depth * 0.6 * sp.dorsal, 1, 1.2), finFill, finRay, alpha);
    }

    /* anal / lower fin */
    if (sp.dorsalStyle === 'wing') {
      drawFin(ctx, ribbonFin(sp, pts, depth, 0.6, 0.97, depth * 1.1 * sp.anal, -1, 1.7), finFill, finRay, alpha);
    } else {
      drawFin(ctx, ribbonFin(sp, pts, depth, 0.6, 0.88, depth * 0.5 * sp.anal, -1, 1.2), finFill, finRay, alpha * .9);
    }
    /* pelvic */
    if (lod > .5) drawFin(ctx, ribbonFin(sp, pts, depth, 0.38, 0.52, depth * 0.34 * sp.anal, -1, 1.3), finFill, finRay, alpha * .8);

    /* --- body ----------------------------------------------------------- */
    var outline = bodyOutline(sp, pts, depth);
    smoothPath(ctx, outline);

    if (o.silhouette) {
      ctx.fillStyle = o.color || '#000';
      ctx.fill();
    } else {
      bodyGrad = ctx.createLinearGradient(0, -depth, 0, depth * 1.05);
      bodyGrad.addColorStop(0, hsl(sp.top, 0));
      bodyGrad.addColorStop(0.44, hsl(sp.mid, 0));
      bodyGrad.addColorStop(0.78, hsl(sp.belly, 0));
      bodyGrad.addColorStop(1, hsl(sp.belly, 6));
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      /* specular sheen along the upper flank */
      ctx.save();
      ctx.clip();
      var sheen = ctx.createLinearGradient(0, -depth, 0, 0);
      sheen.addColorStop(0, 'rgba(255,255,255,0.16)');
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(-70, -depth * 1.2, 140, depth * 1.4);
      if (lod > .5) drawPattern(ctx, sp, pts, depth);
      ctx.restore();
    }

    /* --- pectoral fin (oscillates) --------------------------------------- */
    var pecP = at(pts, 0.3);
    var flap = Math.sin((o.phase || 0) * 0.9) * 0.42;
    ctx.save();
    ctx.translate(pecP.x, pecP.y);
    ctx.rotate(flap);
    var pw = depth * 1.5 * sp.pectoral, ph = depth * 0.5 * sp.pectoral;
    var pec = [
      { x: 0, y: 0 },
      { x: -pw * 0.55, y: ph * 1.5 },
      { x: -pw, y: ph * 2.1 },
      { x: -pw * 0.35, y: ph * 0.7 }
    ];
    if (sp.spines) {
      /* lionfish — a fan of banded rays instead of a single blade */
      for (var r = 0; r < 6; r++) {
        var ang = 0.35 + r * 0.22;
        var len = pw * (1.5 + Math.sin(r) * 0.25);
        ctx.globalAlpha = alpha * 0.4;
        ctx.strokeStyle = finFill;
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-len * 0.5, Math.sin(ang) * len * 0.5, -Math.cos(ang) * len * 0.75, Math.sin(ang) * len);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    } else {
      drawFin(ctx, pec, finFill, finRay, alpha * 0.75);
    }
    ctx.restore();

    if (o.silhouette) { ctx.restore(); return; }

    /* --- head details ---------------------------------------------------- */
    var nose = at(pts, 0.015);
    var eyeP = at(pts, 0.12);
    var eh = depth * profile(0.12, sp.shape, sp.head);

    /* bill (sailfish) */
    if (sp.bill) {
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y - 1.6);
      ctx.lineTo(nose.x + 34, nose.y - 0.6);
      ctx.lineTo(nose.x, nose.y + 2.2);
      ctx.closePath();
      ctx.fillStyle = hsl(sp.top, -6);
      ctx.fill();
    }

    /* jaw + teeth */
    if (lod > .5) {
      ctx.strokeStyle = hsl(sp.top, -18, .55);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(nose.x - 1, nose.y + eh * 0.15);
      ctx.quadraticCurveTo(nose.x - 9, nose.y + eh * 0.62, nose.x - 17, nose.y + eh * 0.66);
      ctx.stroke();

      /* gill cover */
      var gp = at(pts, 0.26);
      var gh = depth * profile(0.26, sp.shape, sp.head);
      ctx.beginPath();
      ctx.moveTo(gp.x + gp.nx * gh * 0.72, gp.y + gp.ny * gh * 0.72);
      ctx.quadraticCurveTo(gp.x - 4, gp.y, gp.x + gp.nx * -gh * 0.8, gp.y + gp.ny * -gh * 0.8);
      ctx.strokeStyle = hsl(sp.top, -12, .4);
      ctx.stroke();
    }

    if (sp.teeth && lod > .5) {
      ctx.fillStyle = 'rgba(240,255,255,.9)';
      for (var t = 0; t < 5; t++) {
        var tx = nose.x - 3 - t * 3.2;
        var ty = nose.y + eh * (0.2 + t * 0.09);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 1.6, ty - 4.6 - (sp.shape === 'eel' ? 3 : 0));
        ctx.lineTo(tx + 1.6, ty - 0.4);
        ctx.closePath();
        ctx.fill();
      }
    }

    /* lure (anglerfish) */
    if (sp.lure) {
      var lx = nose.x + 6, ly = nose.y - eh * 1.9 - 8;
      var bob = Math.sin((o.phase || 0) * 0.7) * 3;
      ctx.strokeStyle = hsl(sp.top, 22, .9);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(nose.x - 16, nose.y - eh * 0.85);
      ctx.quadraticCurveTo(nose.x + 2, ly + bob - 6, lx, ly + bob);
      ctx.stroke();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var lg = ctx.createRadialGradient(lx, ly + bob, 0, lx, ly + bob, 22);
      lg.addColorStop(0, 'rgba(190,255,250,.95)');
      lg.addColorStop(.35, 'rgba(90,235,255,.55)');
      lg.addColorStop(1, 'rgba(60,190,255,0)');
      ctx.fillStyle = lg;
      ctx.beginPath(); ctx.arc(lx, ly + bob, 22, 0, TAU); ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(225,255,255,.98)';
      ctx.beginPath(); ctx.arc(lx, ly + bob, 3.1, 0, TAU); ctx.fill();
    }

    /* photophore glow for deep-sea bodies */
    if (glow > 0 && lod > .5 && sp.pattern === 'dots') {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (var d = 0; d < 14; d++) {
        var dp = at(pts, 0.16 + (d / 14) * 0.78);
        var dh = depth * profile(dp.s, sp.shape, sp.head) * -0.8;
        var px2 = dp.x + dp.nx * dh, py2 = dp.y + dp.ny * dh;
        var pg = ctx.createRadialGradient(px2, py2, 0, px2, py2, 6);
        pg.addColorStop(0, 'rgba(150,250,255,' + (.5 * glow) + ')');
        pg.addColorStop(1, 'rgba(90,220,255,0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(px2, py2, 6, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }

    /* eye */
    var ex = eyeP.x - 2, ey = eyeP.y - eh * 0.34;
    var er = 2.2 + sp.eye * 3.4;
    ctx.fillStyle = 'rgba(245,253,255,.92)';
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(6,14,20,.95)';
    ctx.beginPath(); ctx.arc(ex - er * 0.12, ey, er * 0.62, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.arc(ex - er * 0.42, ey - er * 0.36, er * 0.22, 0, TAU); ctx.fill();

    ctx.restore();
  };

  /* --------------------------------------------------------------- bounds */
  /* Everything the fish will actually cover, in design units, so callers can
     fit it into a box instead of guessing. */
  FishArt.bounds = function (sp) {
    var d = sp.bodyDepth * 50;
    var up = d, down = d * 1.06;

    switch (sp.dorsalStyle) {
      case 'sail': up += d * 2.2 * sp.dorsal; break;
      case 'wing': up += d * 1.2 * sp.dorsal; break;
      case 'spiny': up += d * 0.62 * sp.dorsal; break;
      case 'long': up += d * 0.36 * sp.dorsal; break;
      default: up += d * 0.6 * sp.dorsal;
    }
    down += d * (sp.dorsalStyle === 'wing' ? 1.1 * sp.anal : 0.5 * sp.anal);
    down = Math.max(down, d * 1.06 + d * 1.5 * sp.pectoral * 0.7);
    if (sp.lure) up = Math.max(up, d * 1.9 + 34);

    var tailReach = 0.12 + sp.tailSize * 0.16;
    var tailW = d * (0.55 + sp.tailSize * 0.9) * (sp.tail === 'shark' ? 1.95 : 1.55);
    up = Math.max(up, tailW);
    down = Math.max(down, tailW);

    /* the swimming wave itself throws the tail around a little */
    var wave = 12 * (sp.waveAmp || 1);
    return {
      x0: -50 - tailReach * 100 * 1.4,
      x1: 50 + (sp.bill ? 36 : 4),
      y0: -(up + wave * .5),
      y1: down + wave * .5
    };
  };

  /* Convenience: draw a fish swimming on the spot, fitted to the given box.
     Used by the species cards, the drawer and the quiz result. */
  FishArt.showcase = function (ctx, sp, w, h, t, scale) {
    var b = FishArt.bounds(sp);
    var bw = b.x1 - b.x0, bh = b.y1 - b.y0;
    var s = Math.min((w * 0.88) / bw, (h * 0.86) / bh) * (scale || 1);
    var cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    var bob = Math.sin(t * 0.9) * h * 0.03;
    var tilt = Math.sin(t * 0.55) * 0.06;
    FishArt.draw(ctx, sp, {
      /* local (lx,ly) lands at (x - s·lx, y + s·ly), so centre the box */
      x: w / 2 + cx * s,
      y: h / 2 - cy * s + bob,
      size: s * 100,
      angle: Math.PI + tilt,            /* facing left, the classic pose */
      phase: t * 3.2 * (sp.waveFreq || 1),
      lod: 1
    });
  };

  FishArt.profile = profile;
  global.FishArt = FishArt;
})(window);
