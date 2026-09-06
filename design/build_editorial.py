# -*- coding: utf-8 -*-
"""design/editorial.html - Hero + Showcase at full high-fashion editorial treatment.
Type pairing #50 'Luxury Minimalist' (Bodoni Moda + Jost) from ui-ux-pro-max.
Palette carried over from the approved cream-and-bronze direction."""
import json
A = json.load(open("design/.ed-assets.json"))
FRESHA = "https://www.fresha.com/a/skin-deep-beauty-salon-bray-44-main-street-rp7gdkj0"

SHOW = [
 ("01","24K Gold Leaf","Facial", A["matis"],
  "Pure gold leaf application, luxury facial massage, glow-boosting serum and ultimate skin rejuvenation. Limited appointments.",
  "By arrangement","Enquire","rowA",
  "MATIS Paris skincare on the shelf in a Skin Deep treatment room."),
 ("02","LED Dermisonic","Light Therapy", A["foliage"],
  "Forty-five minutes of light therapy, facial massage included. The newest treatment on the menu and the one the team are proudest of.",
  "1 hour &middot; &euro;75","Book","rowB",
  "Dried eucalyptus draped over the ornate teardrop mirror in the salon."),
 ("03","Brow Lamination","&amp; Lash Lift", A["chair"],
  "Brow lamination at &euro;45, Lash Glo lift with serum at &euro;65. Patch test five minutes, free, any visit beforehand.",
  "45 minutes &middot; from &euro;45","Book","rowC",
  "Cream pillar candles in rose-gold holders on the white ribbed cabinet at Skin Deep."),
]

def rows():
    out=[]
    for i,(num,l1,l2,img,body,meta,cta,cls,alt) in enumerate(SHOW):
        out.append(f'''
<article class="row {cls}">
  <figure class="row-fig">
    <div class="imgmask"><img src="{img}" alt="{alt}"></div>
  </figure>
  <div class="row-txt">
    <span class="idx" aria-hidden="true">{num}</span>
    <h3 class="rv-mask"><span>{l1}</span><span class="it">{l2}</span></h3>
    <p class="row-body rv">{body}</p>
    <p class="row-meta rv">{meta}</p>
    <a class="ulink rv" href="{FRESHA}" target="_blank" rel="noopener"><span>{cta}</span></a>
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
  --pad:clamp(28px,6vw,110px);
  --col:minmax(0,1fr);
}}
*{{box-sizing:border-box}}
html{{scroll-behavior:smooth;-webkit-text-size-adjust:100%}}
body{{margin:0;background:var(--paper);color:var(--body);font-family:var(--ui);
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
.hero-type{{grid-column:1/8}}
.hero .label{{margin-bottom:clamp(26px,4vw,52px)}}
.hero h1{{font-family:var(--disp);font-weight:400;margin:0;color:var(--ink);
  font-size:clamp(46px,9vw,124px);line-height:.9;letter-spacing:-.018em}}
.hero h1 .it{{font-style:italic;font-weight:400;color:var(--bronze);
  display:block;margin-left:.06em}}
.hero-sub{{margin:clamp(32px,4.6vw,60px) 0 0;max-width:34ch;font-size:clamp(15px,1.5vw,17.5px);
  line-height:1.9;color:var(--body)}}
.hero-cta{{margin-top:clamp(24px,3vw,40px)}}
.hero-fig{{grid-column:8/13;position:relative;margin-top:clamp(28px,5vw,0px)}}
.hero-fig .imgmask{{overflow:hidden}}
.hero-fig img{{width:100%;height:clamp(320px,44vw,540px);object-fit:cover;object-position:52% 34%}}
.hero-fig figcaption{{font-size:10px;letter-spacing:.3em;text-transform:uppercase;
  color:var(--bronze);margin-top:16px;text-align:right}}
@media(max-width:900px){{
  .hero-type{{grid-column:1/13}}
  .hero-fig{{grid-column:1/13;margin-top:52px}}
}}
/* hairline metadata rail */
.rail{{margin-top:clamp(48px,7vw,104px)}}
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
    <figure class="hero-fig" style="margin:0">
      <div class="imgmask" style="--d:320ms">
        <img src="{A["hero"]}" alt="A Skin Deep treatment room: an ornate teardrop mirror hung with dried eucalyptus against blush fluted panelling.">
      </div>
      <figcaption class="rv" style="--d:900ms">The treatment room &mdash; 44 Main Street</figcaption>
    </figure>
  </div>

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
