# -*- coding: utf-8 -*-
"""design/editorial.html - Hero + Showcase at full high-fashion editorial treatment.
Type pairing #50 'Luxury Minimalist' (Bodoni Moda + Jost) from ui-ux-pro-max.
Palette carried over from the approved cream-and-bronze direction."""
import json
A = json.load(open("design/.ed-assets.json"))
FRESHA = "https://www.fresha.com/a/skin-deep-beauty-salon-bray-44-main-street-rp7gdkj0"

SHOW = [
 ("01","24K Gold Leaf","Facial", "matis",
  "Pure gold leaf application, luxury facial massage, glow-boosting serum and ultimate skin rejuvenation. Limited appointments, and never yet bookable online.",
  "By arrangement","Enquire","rowA",
  "MATIS Paris skincare on the shelf in a Skin Deep treatment room.",
  ("Gold leaf","Facial massage","Glow serum","Limited"), ("foliage","chair")),
 ("02","LED Dermisonic","Light Therapy", "foliage",
  "Forty-five minutes of light therapy with facial massage included. The newest treatment on the menu, and the one the team are proudest of.",
  "1 hour &middot; &euro;75","Book","rowB",
  "Dried eucalyptus draped over the ornate teardrop mirror in the salon.",
  ("LED therapy","45 minutes","Incl. massage"), ("matis","chair")),
 ("03","Brow Lamination","&amp; Lash Lift", "chair",
  "Brow lamination at &euro;45, Lash Glo lift with serum at &euro;65. Patch test takes five minutes, costs nothing, and can be done on any visit beforehand.",
  "45 minutes &middot; from &euro;45","Book","rowC",
  "Cream pillar candles in rose-gold holders on the white ribbed cabinet at Skin Deep.",
  ("Lamination","Lash lift","Patch test free"), ("hero","matis")),
]

def rows():
    out=[]
    for i,(num,l1,l2,img,body,meta,cta,cls,alt,chip,thm) in enumerate(SHOW):
        chips=''.join('<li>%s</li>'%c for c in chip)
        thumbs=''.join('<img src="%s" alt="">'%A[k] for k in thm)
        out.append(f'''
<article class="row {cls}">
  <figure class="row-fig">
    <div class="imgmask"><img src="{A[img]}" alt="{alt}"></div>
    <span class="fignum" aria-hidden="true">{num}</span>
  </figure>
  <div class="row-txt">
    <span class="idx" aria-hidden="true">{num}</span>
    <h3 class="rv-mask"><span>{l1}</span><span class="it">{l2}</span></h3>
    <p class="row-body rv">{body}</p>
    <ul class="chips rv">{chips}</ul>
    <p class="row-meta rv">{meta}</p>
    <a class="ulink rv" href="{FRESHA}" target="_blank" rel="noopener"><span>{cta}</span></a>
    <div class="thumbs rv">{thumbs}</div>
  </div>
</article>''')
    return "".join(out)

HTML = f'''<title>Skin Deep Editorial</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Jost:wght@200;300;400;500&display=swap">
<style>
:root{{
  --paper:#F7F2EA; --paper2:#F1EADD; --ink:#221D19; --body:#4A423A;
  --bronze:#7D5A39; --blush:#E8CFC8; --blush2:#EBD9CE;
  --hair:rgba(34,29,25,.16); --hair-soft:rgba(34,29,25,.09);
  --disp:"Bodoni Moda",Didot,"Bodoni MT",Georgia,serif;
  --ui:"Jost",ui-sans-serif,system-ui,-apple-system,sans-serif;
  /* cinematic easing */
  --cine:cubic-bezier(.16,1,.3,1);
  --soft:cubic-bezier(.22,.61,.36,1);
  --micro:220ms; --sweep:420ms; --reveal:1100ms; --expand:1500ms;
  --pad:clamp(24px,5vw,92px);
  --grain:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.42'/%3E%3C/svg%3E");
  --col:minmax(0,1fr);
}}
*{{box-sizing:border-box}}
.grain{{position:fixed;inset:0;z-index:60;pointer-events:none;opacity:.34;
  background-image:var(--grain);background-size:180px 180px;mix-blend-mode:multiply}}
html{{scroll-behavior:smooth;-webkit-text-size-adjust:100%}}
body{{margin:0;background:
   radial-gradient(90% 55% at 12% 0%,rgba(232,207,200,.44) 0%,rgba(232,207,200,0) 62%),
   radial-gradient(70% 50% at 96% 22%,rgba(125,90,57,.10) 0%,rgba(125,90,57,0) 60%),
   radial-gradient(80% 46% at 50% 100%,rgba(235,217,206,.5) 0%,rgba(235,217,206,0) 70%),
   var(--paper);background-attachment:fixed;color:var(--body);font-family:var(--ui);
  font-weight:300;font-size:16px;line-height:1.85;-webkit-font-smoothing:antialiased;
  overflow-x:hidden}}
img{{display:block;max-width:100%}}
figure{{margin:0}}
a{{color:inherit;text-decoration:none}}
:focus-visible{{outline:1px solid var(--bronze);outline-offset:6px}}
.grid{{display:grid;grid-template-columns:repeat(12,var(--col));
  gap:0 clamp(14px,2.2vw,30px);max-width:1440px;margin:0 auto;padding:0 var(--pad)}}
.label{{font-family:var(--ui);font-size:10.5px;font-weight:400;letter-spacing:.42em;
  text-transform:uppercase;color:var(--bronze);margin:0}}
.hair{{height:1px;background:var(--hair);border:0;margin:0}}
@media (min-resolution:2dppx){{.hair{{height:.5px}}}}

/* ============ MOTION ============
   Everything is visible by default. The .motion class is only added by the
   inline script when the visitor has NOT asked for reduced motion, so a
   no-JS or reduced-motion visitor gets the finished page immediately. */
.motion .rv{{opacity:0;transform:translateY(20px)}}
.motion .rv.in{{opacity:1;transform:none;
  transition:opacity 900ms var(--soft) var(--d,0ms),transform 900ms var(--cine) var(--d,0ms)}}
.motion .rv-mask span{{display:block;transform:translateY(108%)}}
.motion .rv-mask.in span{{transform:none;
  transition:transform var(--reveal) var(--cine) var(--d,0ms)}}
.rv-mask span{{display:block}}
.rv-mask{{overflow:hidden}}
.motion .imgmask img{{transform:scale(1.14);clip-path:inset(0 0 100% 0)}}
.motion .imgmask.in img{{transform:scale(1);clip-path:inset(0 0 0 0);
  transition:transform var(--expand) var(--cine) var(--d,0ms),
             clip-path var(--expand) var(--cine) var(--d,0ms)}}
@media (prefers-reduced-motion:reduce){{
  *{{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
  .motion .rv,.motion .rv-mask span,.motion .imgmask img{{opacity:1;transform:none;clip-path:none}}
}}

/* ============ CHROME ============ */
.ribbon{{background:var(--ink);color:var(--paper);font-family:var(--ui);font-size:9.5px;
  letter-spacing:.34em;text-transform:uppercase;text-align:center;padding:9px 16px;font-weight:300}}
.topbar{{display:flex;align-items:center;justify-content:space-between;gap:24px;
  padding:26px var(--pad);border-bottom:1px solid var(--hair-soft)}}
.mark{{font-family:var(--disp);font-size:15px;letter-spacing:.36em;color:var(--ink);font-weight:400}}
.topnav{{display:flex;gap:clamp(18px,3vw,44px);list-style:none;margin:0;padding:0}}
.topnav a{{font-size:10.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--body)}}
@media(max-width:800px){{.topnav{{display:none}}}}

/* expanding-underline link, used for nav and CTAs */
.ulink{{position:relative;display:inline-block;font-size:10.5px;letter-spacing:.34em;
  text-transform:uppercase;color:var(--ink);padding:14px 0;min-height:44px;
  transition:color var(--micro) var(--soft)}}
.ulink::after{{content:"";position:absolute;left:0;bottom:10px;width:100%;height:1px;
  background:var(--bronze);transform:scaleX(0);transform-origin:left;
  transition:transform var(--sweep) var(--cine)}}
.ulink:hover{{color:var(--bronze)}}
.ulink:hover::after,.ulink:focus-visible::after{{transform:scaleX(1)}}
.topnav a{{position:relative;padding:6px 0;display:inline-block}}
.topnav a::after{{content:"";position:absolute;left:0;bottom:0;width:100%;height:1px;
  background:var(--bronze);transform:scaleX(0);transform-origin:left;
  transition:transform var(--sweep) var(--cine)}}
.topnav a:hover{{color:var(--bronze)}}
.topnav a:hover::after{{transform:scaleX(1)}}

/* ============ HERO ============ */
.hero{{position:relative;padding:clamp(44px,6vw,86px) 0 clamp(40px,6vw,84px);overflow:hidden}}
.blob{{position:absolute;z-index:0;pointer-events:none;filter:blur(.4px)}}
.blob-a{{width:min(58vw,760px);aspect-ratio:1/.92;left:-14vw;top:2vw;
  background:radial-gradient(120% 120% at 32% 28%,var(--blush) 0%,var(--blush2) 46%,rgba(235,217,206,0) 74%);
  border-radius:64% 36% 43% 57%/52% 45% 55% 48%;opacity:.62}}
.blob-b{{width:min(34vw,420px);aspect-ratio:1/1.1;right:-6vw;bottom:-14vw;
  background:radial-gradient(130% 130% at 58% 42%,rgba(125,90,57,.085) 0%,rgba(125,90,57,0) 62%);
  border-radius:41% 59% 62% 38%/47% 39% 61% 53%}}
.hero .grid{{position:relative;z-index:2;align-items:end}}
.pourwrap{{grid-column:5/9;position:relative;align-self:stretch;min-height:clamp(420px,52vw,700px);
  display:flex;flex-direction:column;justify-content:flex-end}}
#pour{{width:100%;height:clamp(400px,50vw,664px);display:block;
  filter:drop-shadow(0 22px 34px rgba(125,90,57,.22))}}
.pourcap{{font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--bronze);
  text-align:center;margin:14px 0 0;opacity:.8}}
@media(max-width:900px){{.pourwrap{{grid-column:1/13;order:3;min-height:0;margin-top:44px}}
  #pour{{height:340px}}}}
.hero-type{{grid-column:1/5}}
.hero .label{{margin-bottom:clamp(26px,4vw,52px)}}
.hero h1{{font-family:var(--disp);font-weight:400;margin:0;color:var(--ink);
  font-size:clamp(46px,9vw,124px);line-height:.9;letter-spacing:-.018em}}
.hero h1 .it{{font-style:italic;font-weight:400;color:var(--bronze);
  display:block;margin-left:.06em}}
.hero-sub{{margin:clamp(32px,4.6vw,60px) 0 0;max-width:34ch;font-size:clamp(15px,1.5vw,17.5px);
  line-height:1.9;color:var(--body)}}
.hero-cta{{margin-top:clamp(24px,3vw,40px)}}
.hero-fig{{grid-column:9/13;position:relative;margin-top:clamp(28px,5vw,0px)}}
.hero-fig .imgmask{{overflow:hidden}}
.hero-fig img{{width:100%;height:clamp(320px,44vw,540px);object-fit:cover;object-position:52% 34%}}
.hero-fig figcaption{{font-size:10px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--bronze);margin-top:16px;text-align:right}}
@media(max-width:900px){{
  .hero-type{{grid-column:1/13}}
  .hero-fig{{grid-column:1/13;margin-top:52px}}
}}
/* hairline metadata rail */
.orn{{display:flex;align-items:center;gap:16px;margin:clamp(40px,6vw,78px) 0 0}}
.orn::before,.orn::after{{content:"";flex:1;height:1px;background:linear-gradient(90deg,
  rgba(125,90,57,0),rgba(125,90,57,.42),rgba(125,90,57,0))}}
.orn span{{width:7px;height:7px;transform:rotate(45deg);background:var(--bronze);opacity:.6;flex:none}}
.ticker{{overflow:hidden;border-block:1px solid var(--hair);
  background:linear-gradient(180deg,rgba(232,207,200,.34),rgba(232,207,200,.10));
  padding:20px 0;margin-top:clamp(44px,6vw,84px)}}
.tick-track{{display:flex;width:max-content;gap:0;animation:tick 46s linear infinite}}
.tick-track span{{font-family:var(--disp);font-style:italic;font-size:clamp(19px,2.5vw,31px);
  color:var(--bronze);opacity:.82;padding:0 clamp(20px,3vw,44px);white-space:nowrap}}
.tick-track span{{position:relative;display:inline-block}}
.tick-track span::after{{content:"";position:absolute;right:-3px;top:50%;width:5px;height:5px;margin-top:-2.5px;background:var(--bronze);border-radius:50%;opacity:.45}}
@keyframes tick{{from{{transform:translateX(0)}}to{{transform:translateX(-50%)}}}}
@media (prefers-reduced-motion:reduce){{.tick-track{{animation:none}}}}
.rail{{margin-top:clamp(40px,5vw,72px)}}
.rail .grid{{padding-top:0}}
.railrow{{grid-column:1/13;display:grid;grid-template-columns:repeat(4,1fr);
  border-top:1px solid var(--hair)}}
@media(max-width:760px){{.railrow{{grid-template-columns:repeat(2,1fr)}}}}
.railrow div{{padding:26px 22px 28px;border-right:1px solid var(--hair-soft)}}
.railrow div:first-child{{padding-left:0}}
.railrow div:last-child{{border-right:0}}
.railrow dt{{font-size:9.5px;letter-spacing:.32em;text-transform:uppercase;
  color:var(--bronze);margin:0 0 12px}}
.railrow dd{{margin:0;font-family:var(--disp);font-size:clamp(21px,2.6vw,30px);
  color:var(--ink);line-height:1;font-variant-numeric:tabular-nums}}

/* ============ SHOWCASE ============ */
.showcase{{padding:clamp(96px,15vw,220px) 0 clamp(80px,12vw,180px);position:relative}}
.sc-open{{margin-bottom:clamp(72px,11vw,168px)}}
.sc-open .lead{{grid-column:2/9}}
@media(max-width:900px){{.sc-open .lead{{grid-column:1/13}}}}
.sc-open h2{{font-family:var(--disp);font-weight:400;color:var(--ink);margin:26px 0 0;
  font-size:clamp(32px,6.2vw,80px);line-height:1.02;letter-spacing:-.012em}}
.sc-open h2 .it{{font-style:italic;color:var(--bronze)}}
.sc-open p{{grid-column:9/13;align-self:end;margin:0;font-size:14.5px;line-height:1.95;color:var(--body)}}
@media(max-width:900px){{.sc-open p{{grid-column:1/13;margin-top:34px}}}}

.row{{display:grid;grid-template-columns:repeat(12,var(--col));
  gap:0 clamp(14px,2.2vw,30px);max-width:1440px;margin:0 auto clamp(96px,14vw,200px);
  padding:0 var(--pad);position:relative;align-items:center}}
.row:last-child{{margin-bottom:0}}
.imgmask{{overflow:hidden;position:relative}}
.imgmask img{{width:100%;height:clamp(300px,40vw,540px);object-fit:cover;
  transition:transform 1200ms var(--cine)}}
.row:hover .imgmask.in img{{transform:scale(1.045)}}
.row-txt{{position:relative}}
.idx{{position:absolute;font-family:var(--disp);font-style:italic;font-weight:400;
  font-size:clamp(96px,15vw,210px);line-height:.7;color:var(--bronze);opacity:.12;
  top:-.28em;left:-.1em;z-index:0;pointer-events:none;user-select:none}}
.row-txt > *:not(.idx){{position:relative;z-index:1}}
.row h3{{font-family:var(--disp);font-weight:400;color:var(--ink);margin:0;
  font-size:clamp(30px,4.4vw,60px);line-height:1.02;letter-spacing:-.01em}}
.row h3 .it{{font-style:italic;color:var(--bronze)}}
.row-body{{margin:clamp(22px,2.6vw,34px) 0 0;max-width:38ch;font-size:15px;line-height:1.95}}
.row-meta{{margin:22px 0 0;font-size:10.5px;letter-spacing:.32em;text-transform:uppercase;
  color:var(--bronze);padding-top:20px;border-top:1px solid var(--hair)}}
.row .ulink{{margin-top:8px}}
.chips{{display:flex;flex-wrap:wrap;gap:8px;margin:22px 0 0;padding:0;list-style:none}}
.chips li{{font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--bronze);
  border:1px solid rgba(125,90,57,.34);border-radius:100px;padding:7px 13px;background:rgba(255,255,255,.34)}}
.thumbs{{display:flex;gap:10px;margin-top:26px}}
.thumbs img{{width:74px;height:88px;object-fit:cover;flex:none;
  border:1px solid var(--hair);transition:transform 900ms var(--cine),filter 900ms var(--cine)}}
.thumbs img:hover{{transform:translateY(-4px);filter:saturate(1.08)}}
.row-fig{{position:relative}}
.fignum{{position:absolute;right:14px;bottom:12px;font-family:var(--disp);font-style:italic;
  font-size:13px;letter-spacing:.2em;color:rgba(255,250,240,.92);
  text-shadow:0 1px 10px rgba(34,29,25,.5);z-index:2}}

/* three different asymmetries - never a mirrored alternation */
.rowA .row-fig{{grid-column:1/8;margin-left:calc(var(--pad) * -1)}}
.rowA .row-txt{{grid-column:9/13}}
.rowB .row-txt{{grid-column:2/6}}
.rowB .row-fig{{grid-column:7/13;margin-right:calc(var(--pad) * -1);margin-top:clamp(0px,7vw,96px)}}
.rowC .row-fig{{grid-column:4/12;grid-row:1}}
.rowC .row-txt{{grid-column:1/6;grid-row:1;align-self:center;z-index:2;
  background:linear-gradient(90deg,var(--paper) 62%,rgba(247,242,234,0));
  padding:clamp(24px,3vw,44px) clamp(30px,4vw,60px) clamp(24px,3vw,44px) 0}}
@media(max-width:900px){{
  .row{{display:block}}
  .rowA .row-fig,.rowB .row-fig,.rowC .row-fig{{margin:0 0 36px}}
  .rowC .row-txt{{background:none;padding:0}}
  .rowB .row-fig{{margin-top:0}}
}}
.sc-foot{{padding-top:clamp(56px,8vw,96px)}}
.sc-foot .grid{{border-top:1px solid var(--hair);padding-top:34px}}
.sc-foot .a{{grid-column:1/7;font-size:13.5px}}
.sc-foot .b{{grid-column:9/13;text-align:right;font-size:13.5px}}
@media(max-width:760px){{.sc-foot .a,.sc-foot .b{{grid-column:1/13;text-align:left}}
  .sc-foot .b{{margin-top:18px}}}}
</style>

<script>
  /* Opt in to motion only when it is welcome. Without this class every element
     below renders in its finished state, so the page is never blank. */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {{
    document.documentElement.classList.add('motion');
  }}
</script>

<div class="ribbon">Design concept &middot; not a live website &middot; Skin Deep Beauty Salon, Bray</div>
<header class="topbar">
  <span class="mark">SKIN DEEP</span>
  <nav><ul class="topnav">
    <li><a href="#showcase">Signature</a></li><li><a href="#showcase">Treatments</a></li>
    <li><a href="#showcase">The Team</a></li><li><a href="#showcase">Visit</a></li>
  </ul></nav>
  <a class="ulink" href="{FRESHA}" target="_blank" rel="noopener"><span>Book</span></a>
</header>

<main>
<section class="hero">
  <div class="blob blob-a" aria-hidden="true"></div>
  <div class="blob blob-b" aria-hidden="true"></div>
  <div class="grid">
    <div class="hero-type">
      <p class="label rv" style="--d:80ms">Bray &middot; Est. c.&thinsp;1986</p>
      <h1>
        <span class="rv-mask" style="--d:120ms"><span>Skin</span></span>
        <span class="rv-mask" style="--d:230ms"><span>Deep</span></span>
        <span class="rv-mask it" style="--d:340ms"><span>Beauty Salon</span></span>
      </h1>
      <p class="hero-sub rv" style="--d:560ms">Nearly forty years on Main Street. Four therapists, eighty years between them, and a five&#8209;star record from almost three thousand clients.</p>
      <div class="hero-cta rv" style="--d:660ms">
        <a class="ulink" href="{FRESHA}" target="_blank" rel="noopener"><span>Book an appointment</span></a>
      </div>
    </div>
    <div class="pourwrap">
      <canvas id="pour" role="img" aria-label="An illustration of golden serum pouring from a bottle into a shallow pool."></canvas>
      <p class="pourcap rv" style="--d:1000ms">MATIS Paris &middot; in every facial</p>
    </div>
    <figure class="hero-fig" style="margin:0">
      <div class="imgmask" style="--d:320ms">
        <img src="{A["hero"]}" alt="A Skin Deep treatment room: an ornate teardrop mirror hung with dried eucalyptus against blush fluted panelling.">
      </div>
      <figcaption class="rv" style="--d:900ms">The treatment room &mdash; 44 Main Street</figcaption>
    </figure>
  </div>

  <div class="grid"><div style="grid-column:1/13"><div class="orn rv" style="--d:760ms"><span></span></div></div></div>
  <div class="rail">
    <div class="grid">
      <dl class="railrow rv" style="--d:820ms">
        <div><dt>Established</dt><dd>c.&thinsp;1986</dd></div>
        <div><dt>Rating</dt><dd>5.0</dd></div>
        <div><dt>Reviews</dt><dd>2,922</dd></div>
        <div><dt>Treatments</dt><dd>84</dd></div>
      </dl>
    </div>
  </div>
  <div class="ticker" aria-hidden="true"><div class="tick-track"><span>Brow Lamination</span><span>Lash Glo Lift</span><span>24K Gold Leaf Facial</span><span>LED Dermisonic</span><span>Deep Cleanse</span><span>Aromatherapy Massage</span><span>Gelish Manicure</span><span>Threading</span><span>Reflexology</span><span>MATIS Prescriptive Facial</span><span>Brow Lamination</span><span>Lash Glo Lift</span><span>24K Gold Leaf Facial</span><span>LED Dermisonic</span><span>Deep Cleanse</span><span>Aromatherapy Massage</span><span>Gelish Manicure</span><span>Threading</span><span>Reflexology</span><span>MATIS Prescriptive Facial</span></div></div>
</section>

<section class="showcase" id="showcase">
  <div class="sc-open grid">
    <div class="lead">
      <p class="label rv">The Signature Three</p>
      <h2 class="rv-mask" style="--d:90ms"><span>Not everything</span></h2>
      <h2 class="rv-mask it" style="--d:200ms"><span>we are known for.</span></h2>
    </div>
    <p class="rv" style="--d:420ms">Eighty-four treatments sit on the menu. These are the three the team would put their name to &mdash; and the one at the top has never been bookable anywhere online.</p>
  </div>
  {rows()}
  <div class="sc-foot">
    <div class="grid">
      <p class="a rv">All eighty-four treatments, with prices, book through Fresha with instant confirmation.</p>
      <p class="b rv" style="--d:110ms"><a class="ulink" href="{FRESHA}" target="_blank" rel="noopener"><span>See the full menu</span></a></p>
    </div>
  </div>
</section>
</main>

<script>
/* ── Serum pour ────────────────────────────────────────────────────────────
   A tilted apothecary bottle pouring a stream of warm gold serum into a
   pool that ripples. Canvas 2D, one rAF loop, ~60 lines of real geometry:
   the stream narrows as it accelerates under gravity and flares where it
   lands, which is what makes a pour read as liquid rather than as a ribbon. */
(function () {{
  var cv = document.getElementById('pour');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var reduced = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches);
  var W = 0, H = 0, DPR = 1;

  function size() {{
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }}
  size();
  if (window.ResizeObserver) new ResizeObserver(size).observe(cv);
  else window.addEventListener('resize', size);

  var GOLD = ['#FFF6E2', '#F3DCA4', '#DFBB63', '#BE9036', '#8A6A2E'];
  var drops = [], ripples = [], nextDrop = 0;

  function mouth() {{ return {{ x: W * 0.50, y: H * 0.365 }}; }}
  function poolY()  {{ return H * 0.925; }}

  /* the bottle, drawn in a local frame whose origin is the mouth */
  function bottle(t) {{
    var m = mouth();
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(-0.42 + Math.sin(t * 0.5) * 0.012);   /* a slow, barely-there sway */
    var s = Math.min(1.05, W / 300);
    ctx.scale(s, s);

    var g = ctx.createLinearGradient(-35, -180, 35, 0);
    g.addColorStop(0, 'rgba(255,246,226,.92)');
    g.addColorStop(.42, 'rgba(233,206,151,.80)');
    g.addColorStop(1, 'rgba(160,120,58,.55)');

    ctx.beginPath();                       /* neck → shoulder → body → base */
    ctx.moveTo(-10, 2);
    ctx.lineTo(-10, -40);
    ctx.bezierCurveTo(-11, -54, -34, -58, -35, -76);
    ctx.lineTo(-35, -184);
    ctx.quadraticCurveTo(-35, -196, -23, -196);
    ctx.lineTo(23, -196);
    ctx.quadraticCurveTo(35, -196, 35, -184);
    ctx.lineTo(35, -76);
    ctx.bezierCurveTo(34, -58, 11, -54, 10, -40);
    ctx.lineTo(10, 2);
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(125,90,57,.68)'; ctx.stroke();

    ctx.beginPath();                       /* glass highlight down one side */
    ctx.moveTo(-24, -184); ctx.lineTo(-24, -86);
    ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,252,244,.72)'; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(25, -176); ctx.lineTo(25, -98);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255,252,244,.34)'; ctx.stroke();

    ctx.beginPath();                       /* collar */
    ctx.rect(-12.5, -6, 25, 12);
    ctx.fillStyle = 'rgba(125,90,57,.9)'; ctx.fill();
    ctx.beginPath(); ctx.rect(-12.5, -6, 25, 3.4);
    ctx.fillStyle = 'rgba(210,178,120,.85)'; ctx.fill();
    ctx.restore();
  }}

  /* centreline + half-width of the falling stream at depth p (0..1) */
  function streamAt(p, t, m, py) {{
    var y = m.y + (py - m.y) * p;
    var v = Math.sqrt(0.12 + p * 2.4);                 /* gravity */
    var w = (7.2 / v) * (1 + 5.2 * Math.pow(p, 9));    /* narrows, then flares */
    var sway = Math.sin(p * 6.1 - t * 2.0) * 5.4 * p * (1 - p * 0.55)
             + Math.sin(p * 12.7 - t * 3.1) * 1.9 * p;
    return {{ x: m.x + 5 * p + sway, y: y, w: Math.max(1.1, w) }};
  }}

  function stream(t) {{
    var m = mouth(), py = poolY(), N = 58, i, a, L = [], R = [];
    for (i = 0; i <= N; i++) {{ a = streamAt(i / N, t, m, py); L.push([a.x - a.w, a.y]); R.push([a.x + a.w, a.y]); }}

    ctx.beginPath();
    ctx.moveTo(L[0][0], L[0][1]);
    for (i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1]);
    for (i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
    ctx.closePath();

    var g = ctx.createLinearGradient(m.x - 16, 0, m.x + 18, 0);
    g.addColorStop(0, GOLD[1]); g.addColorStop(.28, GOLD[0]);
    g.addColorStop(.55, GOLD[2]); g.addColorStop(1, GOLD[4]);
    ctx.fillStyle = g; ctx.fill();

    ctx.save();                             /* specular rail inside the stream */
    ctx.clip();
    ctx.beginPath();
    for (i = 0; i <= N; i++) {{ a = streamAt(i / N, t, m, py); ctx.lineTo(a.x - a.w * 0.34, a.y); }}
    ctx.lineWidth = 2.4; ctx.strokeStyle = 'rgba(255,253,246,.78)'; ctx.stroke();

    var gp = (t * 0.26) % 1.35 - 0.18;      /* a gloss travelling down the pour */
    var gy = m.y + (py - m.y) * gp;
    var gg = ctx.createLinearGradient(0, gy - 74, 0, gy + 74);
    gg.addColorStop(0, 'rgba(255,255,255,0)');
    gg.addColorStop(.5, 'rgba(255,255,255,.5)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gg; ctx.fillRect(m.x - 40, gy - 74, 80, 148);
    ctx.restore();
  }}

  function pool(t) {{
    var py = poolY(), rx = Math.min(W * 0.34, 132), i, r;
    var breathe = 1 + Math.sin(t * 1.5) * 0.018;
    ctx.beginPath();
    ctx.ellipse(W * 0.52, py + 4, rx * breathe, 15 * breathe, 0, 0, Math.PI * 2);
    var g = ctx.createLinearGradient(W * 0.52 - rx, 0, W * 0.52 + rx, 0);
    g.addColorStop(0, GOLD[3]); g.addColorStop(.34, GOLD[1]);
    g.addColorStop(.6, GOLD[2]); g.addColorStop(1, GOLD[4]);
    ctx.fillStyle = g; ctx.fill();

    ctx.beginPath();
    ctx.ellipse(W * 0.485, py, rx * 0.42, 4.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,252,242,.6)'; ctx.fill();

    for (i = ripples.length - 1; i >= 0; i--) {{
      r = ripples[i]; r.r += 34 * r.dt; r.a -= 0.62 * r.dt;
      if (r.a <= 0) {{ ripples.splice(i, 1); continue; }}
      ctx.beginPath();
      ctx.ellipse(W * 0.52, py + 3, r.r, r.r * 0.19, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,248,231,' + r.a.toFixed(3) + ')';
      ctx.stroke();
    }}
  }}

  function droplets(t, dt) {{
    var m = mouth(), py = poolY(), i, d;
    if (t > nextDrop) {{
      nextDrop = t + 1.5 + Math.random() * 2.2;
      drops.push({{ y: m.y + 34, x: m.x + 3 + (Math.random() - 0.5) * 4, v: 42, r: 2.4 + Math.random() * 2 }});
    }}
    for (i = drops.length - 1; i >= 0; i--) {{
      d = drops[i]; d.v += 620 * dt; d.y += d.v * dt;
      if (d.y >= py) {{ drops.splice(i, 1); ripples.push({{ r: 5, a: 0.5, dt: dt }}); continue; }}
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.r, d.r * 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = GOLD[2]; ctx.fill();
      ctx.beginPath();
      ctx.ellipse(d.x - 0.8, d.y - d.r * 0.4, d.r * 0.32, d.r * 0.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,252,242,.75)'; ctx.fill();
    }}
  }}

  var last = 0;
  function frame(ms) {{
    var t = ms / 1000, dt = Math.min(0.05, t - last || 0.016); last = t;
    ctx.clearRect(0, 0, W, H);
    stream(t); droplets(t, dt); pool(t); bottle(t);
    if (!reduced) requestAnimationFrame(frame);
  }}
  ripples.push({{ r: 40, a: 0.28, dt: 0.016 }});
  requestAnimationFrame(frame);   /* one frame even under reduced motion */
}})();
</script>

<script>
(function () {{
  var root = document.documentElement;
  if (!root.classList.contains('motion')) return;
  var targets = document.querySelectorAll('.rv, .rv-mask, .imgmask');
  var show = function (el) {{ el.classList.add('in'); }};

  if (!('IntersectionObserver' in window)) {{
    targets.forEach(show); return;
  }}
  var io = new IntersectionObserver(function (entries) {{
    entries.forEach(function (e) {{
      if (e.isIntersecting) {{ show(e.target); io.unobserve(e.target); }}
    }});
  }}, {{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }});
  targets.forEach(function (el) {{ io.observe(el); }});

  /* Safety net: whatever happens, nothing stays hidden. */
  setTimeout(function () {{ targets.forEach(show); }}, 2600);
}})();
</script>
'''
open("design/editorial.html","w").write(HTML)
print("written", len(HTML)//1024, "KB")
