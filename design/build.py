# -*- coding: utf-8 -*-
"""Generates design/index.html - Skin Deep Beauty Salon homepage concept.
Direction 01 'Gold Leaf': ui-ux-pro-max palette #90 + font pairing #32."""
import json

A = json.load(open("design/.assets.json"))
FRESHA = "https://www.fresha.com/a/skin-deep-beauty-salon-bray-44-main-street-rp7gdkj0"

# --- treatment menu, transcribed from the salon's Fresha listing -------------
MENU = [
 ("Brows &amp; Lashes", "Patch test required on tinting, lamination and lifts.", [
   ("Eyebrow Shape &amp; Tint","15 min","17"),("Eye Combo","brow tidy, tint &amp; eyelash tint &middot; 30 min","30"),
   ("Brow Lamination","45 min","45"),("Lash Glo Lash Lift &amp; Serum","45 min","65"),
   ("Lash Glo Lash Lift","no serum &middot; 45 min","50"),("Eyelash Tint","20 min","17"),
   ("Eyebrow Tint","15 min","10"),("Eyebrow Wax","15 min","12"),
   ("Brow Tweeze","15 min","12"),("Eyebrow &amp; Lip Wax","15 min","18"),
   ("Patch Test","lash / brow tint, lamination &middot; 5 min","0")]),
 ("Facials", "MATIS Paris. Prescriptive consultation with every treatment.", [
   ("LED Dermisonic Light Therapy","45 min incl. facial massage &middot; 1 hr","75"),
   ("Deep Cleanse Facial","1 hr 15","80"),("Prescriptive Facial","1 hr 15","80"),
   ("Classic Facial","1 hr 15","65"),("Mini Facial","45 min","45"),
   ("Eye Contour Treatment","30 min","45"),("Add on &mdash; Eye Treatment","15 min","25"),
   ("Add on &mdash; Extraction","15 min","20")]),
 ("Waxing", "Patch test required. Men&rsquo;s waxing listed separately below.", [
   ("Full Leg &amp; Hollywood","1 hr 15","70"),("Full Leg &amp; Brazilian","1 hr","65"),
   ("Full Leg &amp; Hollywood","maintenance &middot; 1 hr","65"),
   ("Full Leg &amp; Brazilian","maintenance &middot; 1 hr","60"),
   ("Half Leg &amp; Californian","30 min","37"),("Thigh &amp; Californian","30 min","32"),
   ("Thigh Wax","20 min","20"),("Lip &amp; Chin Wax","10 min","12"),
   ("Chin / Nose / Ear / Nipple","5 min","7"),("Patch Test","5 min","0")]),
 ("Nails", "Gelish two-week polish, manicures and pedicures.", [
   ("Manicure with Gelish","1 hr","40"),("Gelish Polish Removal &amp; Reapply","1 hr","35"),
   ("Gelish &mdash; 2 Week Polish, Fingers","45 min","30"),("Gelish &mdash; 2 Week Polish, Toes","45 min","30"),
   ("Gelish Removal with File &amp; Regular Polish","45 min","25"),
   ("File &amp; Paint","hands or toes &middot; 30 min","20"),
   ("Gelish Removal &amp; Nail Treatment","30 min","15"),
   ("Toe or Finger Nail Cut &amp; File","15 min","15"),
   ("Princess Paint","20 min","15"),("Add on &mdash; Gelish to Pedicure","5 min","5")]),
 ("Threading", "Brows, lip and chin.", [
   ("Thread Combo","30 min","35"),("Lip, Chin &amp; Sides","20 min","25"),
   ("Brow Thread &amp; Tint","15 min","20"),("Lip &amp; Chin Thread","15 min","18"),
   ("Eyebrow Thread","15 min","15"),("Lip or Chin Thread","10 min","10")]),
 ("Massage", "Aromatherapy, Swedish and reflexology.", [
   ("Aromatherapy Full Body","1 hr 15","70"),("Light Swedish Full Body","1 hr 15","70"),
   ("Reflexology","45 min","50"),("Dead Sea Salt Brushing","45 min","45"),
   ("Aromatherapy Back Massage","30 min","35"),("Light Swedish Back Massage","30 min","35")]),
 ("Waxing for Men", "Patch test required.", [
   ("Full Back Wax","30 min","35"),("Chest &amp; Abdomen Wax","30 min","35"),
   ("Half Back Wax","20 min","20")]),
 ("Also", "", [("Ear Piercing","15 min","35"),("MATIS Paris Products","in salon","20")]),
]

TEAM = [
 ("lise","Lise","Owner","20 years",
  "I&rsquo;ve been working as a Beautician for 20 years, but have grown up in the beauty industry &mdash; my mum was pregnant with me while studying to be a Beauty Therapist, so it&rsquo;s in my DNA. I love giving clients an &ldquo;experience&rdquo;.",
  "&ldquo;You are doing an amazing job.&rdquo;","Kenza K."),
 ("janice","Janice","Beauty Therapist","20+ years",
  "With well over 20 years of experience in the beauty industry, I have built my career on a true passion for all aspects of beauty therapy and helping people look and feel their very best. I love welcoming both new and familiar faces into the salon.",
  "&ldquo;Just love this Beauty Salon, the girls are so friendly and professional. I would have absolutely no hesitation in recommending any of the girls in Skin Deep.&rdquo;","Roisin R."),
 ("karen","Karen","Beauty Therapist","20 years &middot; 7 at Skin Deep",
  "I have 20 years experience in the industry and have been lucky to have worked in various salons in Dublin. I am with Skin Deep 7 years.",
  "&ldquo;On time, always pleasant, very professional.&rdquo;","Barbara F."),
 ("orla","Orla","Beauty Therapist","22+ years",
  "With over 22 years of experience in the beauty industry, I&rsquo;ve had the pleasure of meeting so many amazing clients and helping them feel their best. Last November I joined the incredible team at Skin Deep and it already feels like home.",
  "&ldquo;Orla is excellent at her job, very efficient and a great beautician. Next appointment won&rsquo;t be long.&rdquo;","Mary D."),
]

HOURS = [("Monday","Closed",1),("Tuesday","10:00 &ndash; 18:00",0),("Wednesday","10:00 &ndash; 20:00",0),
         ("Thursday","10:00 &ndash; 20:00",0),("Friday","10:00 &ndash; 18:00",0),
         ("Saturday","10:00 &ndash; 17:00",0),("Sunday","Closed",1)]

FIX = [
 ("Your website doesn&rsquo;t load",
  "<strong>skindeepbray.ie</strong> is printed on your Facebook page, but the domain doesn&rsquo;t resolve &mdash; everyone who clicks it gets nothing. First job: bring it back and point it here."),
 ("2,922 reviews Google can&rsquo;t see",
  "You have a 5.0 from 2,922 clients on Fresha and 38 reviews on Google. Google is where Bray searches. Surfacing the real number is the single cheapest win available to you."),
 ("An old address still ranking",
  "<strong>7 Florence Road</strong> is still live on Yelp and half a dozen directories, carrying this same phone number. Every stale listing splits your search ranking with a shop that isn&rsquo;t there."),
 ("A &euro;500 facial with nowhere to book",
  "The 24K Gold Leaf Facial is advertised at &euro;500 on Facebook and appears nowhere on Fresha. If the price is right it deserves a page of its own. If it&rsquo;s a typo, it has been turning people away for months."),
]

# --------------------------------------------------------------------------
def menu_html():
    out=[]
    for i,(cat,note,items) in enumerate(MENU):
        rows="".join(
          f'<li><span class="t-n">{n}</span><span class="t-d">{d}</span>'
          f'<span class="t-p">{"&mdash;" if p=="0" else "&euro;"+p}</span></li>'
          for n,d,p in items)
        out.append(f'''<article class="cat" style="--i:{i}">
  <header><h3>{cat}</h3>{f"<p>{note}</p>" if note else ""}</header>
  <ul class="tlist">{rows}</ul></article>''')
    return "".join(out)

def team_html():
    out=[]
    for i,(k,name,role,yrs,bio,quote,who) in enumerate(TEAM):
        out.append(f'''<article class="member" style="--i:{i}">
  <div class="portrait"><img src="{A[k]}" alt="{name}, {role} at Skin Deep Beauty Salon, Bray."></div>
  <div class="mbody">
    <h3>{name}</h3><p class="mrole">{role} <span>&middot;</span> {yrs}</p>
    <p class="mbio">{bio}</p>
    <blockquote class="mquote">{quote}<cite>{who}</cite></blockquote>
  </div></article>''')
    return "".join(out)

HTML = f'''<title>Skin Deep Bray</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Josefin+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap">
<style>
:root{{
  --ground:#171717; --raised:#1F1D1B; --raised2:#262320;
  --gold:#D4AF37; --gold-dim:#9C7F28;
  --oat:#F7F2EA; --blush:#E8CFC8; --mute:#A79E92; --rule:#332F2B;
  --disp:"Cinzel",Georgia,"Times New Roman",serif;
  --ui:"Josefin Sans",ui-sans-serif,system-ui,-apple-system,sans-serif;
  --max:1180px; --gut:clamp(20px,4vw,48px);
}}
*{{box-sizing:border-box}}
html{{scroll-behavior:smooth}}
body{{margin:0;background:var(--ground);color:var(--oat);font-family:var(--ui);
  font-size:17px;font-weight:300;line-height:1.7;-webkit-font-smoothing:antialiased}}
img{{max-width:100%;display:block}}
a{{color:inherit;text-decoration:none}}
:focus-visible{{outline:2px solid var(--gold);outline-offset:3px}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important;scroll-behavior:auto}}}}
.wrap{{max-width:var(--max);margin:0 auto;padding:0 var(--gut)}}
.eyebrow{{font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);
  font-weight:600;margin:0 0 18px}}
h1,h2,h3{{font-family:var(--disp);font-weight:400;letter-spacing:.03em;text-wrap:balance;margin:0}}
.skip{{position:absolute;left:-9999px}}
.skip:focus{{left:16px;top:16px;z-index:99;background:var(--gold);color:var(--ground);padding:10px 16px;font-weight:600}}

/* ---------- concept ribbon ---------- */
.ribbon{{background:var(--gold);color:#171717;font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;font-weight:600;text-align:center;padding:7px 16px}}

/* ---------- nav ---------- */
.nav{{position:sticky;top:0;z-index:40;background:rgba(23,23,23,.92);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--rule)}}
.nav .wrap{{display:flex;align-items:center;justify-content:space-between;gap:20px;
  min-height:64px;padding-top:8px;padding-bottom:8px}}
.brand{{font-family:var(--disp);font-size:16px;letter-spacing:.24em;color:var(--oat)}}
.nlinks{{display:flex;gap:26px;list-style:none;margin:0;padding:0}}
.nlinks a{{font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute);
  font-weight:400;transition:color .25s ease;padding:6px 0;display:block}}
.nlinks a:hover{{color:var(--gold)}}
@media(max-width:860px){{.nlinks{{display:none}}}}
.nbook{{font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;
  border:1px solid var(--gold);color:var(--gold);padding:11px 20px;min-height:44px;
  display:inline-flex;align-items:center;transition:background .3s ease,color .3s ease;cursor:pointer}}
.nbook:hover{{background:var(--gold);color:var(--ground)}}

/* ---------- hero : asymmetric, image bleeds left ---------- */
.hero{{position:relative;overflow:hidden;border-bottom:1px solid var(--rule)}}
.hero-img{{position:absolute;inset:0 auto 0 0;width:58%;background-size:cover;
  background-position:32% 46%;filter:brightness(.46) saturate(.72) contrast(1.04)}}
.hero-img::after{{content:"";position:absolute;inset:0;
  background:linear-gradient(96deg,rgba(23,23,23,.34) 0%,rgba(23,23,23,.06) 42%,rgba(23,23,23,.92) 96%)}}
.hero .wrap{{position:relative;z-index:2;padding-top:clamp(88px,15vw,160px);
  padding-bottom:clamp(56px,8vw,88px);display:grid;grid-template-columns:1fr;justify-items:end}}
.hero-inner{{width:min(560px,100%);text-align:left}}
.hero h1{{font-size:clamp(40px,7.4vw,84px);line-height:1;letter-spacing:.055em;
  color:var(--oat);margin:0 0 4px}}
.hero h1 .gold{{display:block;color:var(--gold)}}
.hero .sub{{font-family:var(--disp);font-size:clamp(11px,1.5vw,13px);letter-spacing:.42em;
  text-transform:uppercase;color:var(--blush);margin:16px 0 26px}}
.hero p.lede{{font-size:clamp(16px,1.9vw,19px);color:#E4DDD2;max-width:44ch;margin:0 0 34px;font-weight:300}}
.hero-cta{{display:flex;flex-wrap:wrap;gap:14px;align-items:center}}
.btn{{display:inline-flex;align-items:center;justify-content:center;min-height:48px;
  padding:14px 30px;font-size:12.5px;letter-spacing:.2em;text-transform:uppercase;
  font-weight:600;cursor:pointer;transition:background .3s ease,color .3s ease,border-color .3s ease}}
.btn-gold{{background:var(--gold);color:#171717;border:1px solid var(--gold)}}
.btn-gold:hover{{background:#E3C25A;border-color:#E3C25A}}
.btn-ghost{{border:1px solid var(--rule);color:var(--oat);background:none}}
.btn-ghost:hover{{border-color:var(--gold);color:var(--gold)}}
@media(max-width:900px){{
  .hero-img{{width:100%;opacity:.5}}
  .hero .wrap{{justify-items:start}}
}}

/* ---------- figures strip ---------- */
.figs{{border-bottom:1px solid var(--rule);background:var(--raised)}}
.figs .wrap{{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--rule)}}
.figs div{{background:var(--raised);padding:30px 18px 32px}}
.figs b{{display:block;font-family:var(--disp);font-size:clamp(26px,3.6vw,40px);
  color:var(--gold);font-weight:400;line-height:1;font-variant-numeric:tabular-nums}}
.figs span{{display:block;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--mute);margin-top:10px;line-height:1.5}}
@media(max-width:760px){{.figs .wrap{{grid-template-columns:repeat(2,1fr)}}}}

/* ---------- generic section ---------- */
section{{padding:clamp(64px,9vw,112px) 0}}
.sechead{{max-width:60ch;margin-bottom:clamp(40px,5vw,64px)}}
.sechead h2{{font-size:clamp(28px,4.6vw,46px);line-height:1.1;color:var(--oat)}}
.sechead p{{color:var(--mute);margin:18px 0 0;max-width:56ch}}

/* ---------- story : offset, overlapping ---------- */
.story{{background:var(--raised);border-block:1px solid var(--rule);position:relative}}
.story .wrap{{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(32px,5vw,72px);align-items:center}}
.story blockquote{{margin:0;font-family:var(--disp);font-size:clamp(21px,2.9vw,33px);
  line-height:1.34;color:var(--oat);letter-spacing:.012em}}
.story blockquote::first-letter{{color:var(--gold)}}
.story cite{{display:block;font-family:var(--ui);font-style:normal;font-size:12px;
  letter-spacing:.2em;text-transform:uppercase;color:var(--mute);margin-top:26px}}
.story .card{{position:relative}}
.story .card img{{border:1px solid var(--rule)}}
.story .badge{{position:absolute;left:-26px;bottom:-22px;background:var(--ground);
  border:1px solid var(--gold);padding:16px 20px;max-width:210px}}
.story .badge b{{display:block;font-family:var(--disp);color:var(--gold);font-size:13px;
  letter-spacing:.14em;line-height:1.4}}
.story .badge span{{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--mute);margin-top:7px}}
@media(max-width:880px){{
  .story .wrap{{grid-template-columns:1fr}}
  .story .badge{{left:auto;right:16px;bottom:-18px}}
}}

/* ---------- treatments : editorial price list, not cards ---------- */
.menu{{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(34px,4.5vw,60px) clamp(38px,6vw,84px)}}
@media(max-width:840px){{.menu{{grid-template-columns:1fr}}}}
.cat header{{border-bottom:1px solid var(--gold-dim);padding-bottom:12px;margin-bottom:6px}}
.cat h3{{font-size:19px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}}
.cat header p{{font-size:13px;color:var(--mute);margin:8px 0 0;line-height:1.55}}
.tlist{{list-style:none;margin:0;padding:0}}
.tlist li{{display:grid;grid-template-columns:auto 1fr auto;align-items:baseline;gap:0 10px;
  padding:11px 0;border-bottom:1px solid var(--rule)}}
.t-n{{font-size:15.5px;color:var(--oat);font-weight:400}}
.t-d{{border-bottom:1px dotted #4A443E;transform:translateY(-4px);min-width:14px}}
.t-p{{font-size:15.5px;color:var(--gold);font-variant-numeric:tabular-nums;font-weight:500}}
.catnote{{grid-column:1/-1;border:1px solid var(--rule);padding:22px 26px;margin-top:8px;
  font-size:14px;color:var(--mute);display:flex;gap:16px;align-items:flex-start}}
.catnote svg{{flex:none;margin-top:2px}}
.durwrap{{display:block;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;
  color:var(--mute);margin-top:3px}}

/* ---------- team : staggered, unequal ---------- */
.team-grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(34px,4.5vw,64px)}}
@media(max-width:840px){{.team-grid{{grid-template-columns:1fr}}}}
.member{{display:grid;grid-template-columns:168px 1fr;gap:28px;align-items:start}}
.member:nth-child(even){{margin-top:clamp(0px,4vw,52px)}}
@media(max-width:520px){{.member{{grid-template-columns:1fr}}}}
.portrait{{position:relative;overflow:hidden;
  border-radius:999px 999px 6px 6px;border:1px solid var(--rule)}}
.portrait img{{width:100%;height:224px;object-fit:cover;object-position:50% 22%;
  filter:saturate(.86) contrast(1.03);transition:filter .45s ease,transform .6s ease}}
.member:hover .portrait img{{filter:saturate(1) contrast(1.05);transform:scale(1.035)}}
.member h3{{font-size:24px;letter-spacing:.1em;color:var(--oat)}}
.mrole{{font-size:11.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin:8px 0 14px}}
.mrole span{{color:var(--rule)}}
.mbio{{font-size:14.5px;color:#CFC7BB;margin:0;line-height:1.65}}
.mquote{{margin:18px 0 0;padding-left:16px;border-left:1px solid var(--gold-dim);
  font-size:14px;color:var(--mute);font-style:italic;line-height:1.6}}
.mquote cite{{display:block;font-style:normal;font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;margin-top:8px;color:#7E766C}}

/* ---------- reviews ---------- */
.reviews{{background:var(--raised);border-block:1px solid var(--rule)}}
.rtop{{display:flex;flex-wrap:wrap;align-items:flex-end;gap:22px 42px;margin-bottom:44px}}
.rscore{{font-family:var(--disp);font-size:clamp(56px,9vw,96px);line-height:.9;color:var(--gold)}}
.rstars{{letter-spacing:.24em;color:var(--gold);font-size:15px}}
.rmeta{{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-top:10px}}
.rgrid{{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);
  border:1px solid var(--rule)}}
@media(max-width:880px){{.rgrid{{grid-template-columns:1fr}}}}
.rgrid figure{{background:var(--raised);margin:0;padding:28px 26px 26px}}
.rgrid blockquote{{margin:0;font-size:15.5px;color:#DED7CC;line-height:1.62}}
.rgrid figcaption{{margin-top:16px;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--mute)}}
.rgrid figcaption b{{color:var(--gold);font-weight:600}}

/* ---------- visit ---------- */
.visit .wrap{{display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(34px,5vw,72px)}}
@media(max-width:880px){{.visit .wrap{{grid-template-columns:1fr}}}}
.hrs{{list-style:none;margin:26px 0 0;padding:0;border-top:1px solid var(--rule)}}
.hrs li{{display:flex;justify-content:space-between;gap:20px;padding:12px 0;
  border-bottom:1px solid var(--rule);font-size:15px}}
.hrs li span:first-child{{letter-spacing:.1em;text-transform:uppercase;font-size:12.5px;color:var(--mute)}}
.hrs li span:last-child{{font-variant-numeric:tabular-nums}}
.hrs li.shut span:last-child{{color:#7E766C}}
.contact{{list-style:none;margin:0;padding:0}}
.contact li{{padding:15px 0;border-bottom:1px solid var(--rule)}}
.contact .lbl{{display:block;font-size:11px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);margin-bottom:6px}}
.contact a{{border-bottom:1px solid transparent;transition:border-color .25s ease}}
.contact a:hover{{border-color:var(--gold)}}

/* ---------- week one ---------- */
.wk{{border-top:1px solid var(--rule);background:var(--raised2)}}
.wkgrid{{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--rule);
  border:1px solid var(--rule)}}
@media(max-width:760px){{.wkgrid{{grid-template-columns:1fr}}}}
.wkgrid article{{background:var(--raised2);padding:28px 28px 30px}}
.wkgrid h3{{font-family:var(--ui);font-size:12px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--gold);font-weight:600;margin:0 0 12px}}
.wkgrid p{{margin:0;font-size:14.5px;color:#CFC7BB;line-height:1.62}}
.wkgrid strong{{color:var(--oat);font-weight:500}}

/* ---------- footer ---------- */
footer{{border-top:1px solid var(--rule);padding:52px 0 40px;font-size:13px;color:var(--mute)}}
.fgrid{{display:flex;flex-wrap:wrap;justify-content:space-between;gap:26px 40px;align-items:flex-start}}
.fbrand{{font-family:var(--disp);font-size:15px;letter-spacing:.24em;color:var(--oat);display:block;margin-bottom:10px}}
.fnote{{margin-top:34px;padding-top:22px;border-top:1px solid var(--rule);font-size:11.5px;
  line-height:1.7;color:#7E766C;max-width:78ch}}

/* ---------- sticky mobile book ---------- */
.stick{{position:fixed;left:0;right:0;bottom:0;z-index:50;display:none;
  background:rgba(23,23,23,.96);border-top:1px solid var(--rule);
  padding:11px 16px calc(11px + env(safe-area-inset-bottom))}}
.stick a{{display:flex;align-items:center;justify-content:center;min-height:48px;
  background:var(--gold);color:#171717;font-size:12.5px;letter-spacing:.2em;
  text-transform:uppercase;font-weight:600}}
@media(max-width:860px){{.stick{{display:block}} body{{padding-bottom:76px}}}}

/* entrance - from a visible resting state */
@keyframes rise{{from{{opacity:.001;transform:translateY(14px)}}to{{opacity:1;transform:none}}}}
.rise{{animation:rise .7s cubic-bezier(.22,.61,.36,1) both}}
</style>

<a class="skip" href="#main">Skip to content</a>
<div class="ribbon">Design concept &middot; not a live website &middot; prepared for Skin Deep Beauty Salon</div>

<nav class="nav">
  <div class="wrap">
    <a class="brand" href="#main">SKIN DEEP</a>
    <ul class="nlinks">
      <li><a href="#treatments">Treatments</a></li>
      <li><a href="#team">The Team</a></li>
      <li><a href="#reviews">Reviews</a></li>
      <li><a href="#visit">Visit</a></li>
    </ul>
    <a class="nbook" href="{FRESHA}" target="_blank" rel="noopener">Book</a>
  </div>
</nav>

<main id="main">

<header class="hero">
  <div class="hero-img" style="background-image:url('{A["room"]}')" role="img"
       aria-label="A therapist in a treatment room at Skin Deep: blush fluted panelling, an ornate teardrop mirror hung with dried eucalyptus, and MATIS Paris skincare on a white ribbed cabinet."></div>
  <div class="wrap">
    <div class="hero-inner rise">
      <p class="eyebrow">44 Main Street &middot; Bray &middot; Co. Wicklow</p>
      <h1>Skin Deep<span class="gold">Beauty Salon</span></h1>
      <p class="sub">Bray&rsquo;s longest-established salon</p>
      <p class="lede">Nearly forty years on Main Street. Four therapists, eighty years between them, and a five-star record from almost three thousand clients.</p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="{FRESHA}" target="_blank" rel="noopener">Book on Fresha</a>
        <a class="btn btn-ghost" href="#treatments">See the treatments</a>
      </div>
    </div>
  </div>
</header>

<section class="figs" style="padding:0" aria-label="Key figures">
  <div class="wrap">
    <div><b>40</b><span>Years on Main&nbsp;Street</span></div>
    <div><b>5.0</b><span>From 2,922 reviews</span></div>
    <div><b>84</b><span>Treatments</span></div>
    <div><b>80+</b><span>Years between four therapists</span></div>
  </div>
</section>

<section class="story">
  <div class="wrap">
    <div>
      <p class="eyebrow">About</p>
      <blockquote>As Bray&rsquo;s longest-established salon, Skin Deep has focused all its know-how on methods to enhance your beauty for nearly forty years.<cite>&mdash; Skin Deep Beauty Salon</cite></blockquote>
      <p style="color:var(--mute);margin-top:26px;max-width:52ch">When you choose Skin Deep you discover a philosophy based on a personalised approach to your beauty. Because your needs are unique, your therapist takes time to welcome you, listen to you and study your skin &mdash; offering all the attention required to give you the best treatment.</p>
    </div>
    <div class="card">
      <img src="{A["hours"]}" alt="Skin Deep's opening hours card: cream ground, bronze arch, letterspaced serif wordmark.">
      <div class="badge"><b>Nominated<br>Best Beauticians</b><span>Irish Hair &amp; Beauty Awards 2025</span></div>
    </div>
  </div>
</section>

<section id="treatments">
  <div class="wrap">
    <div class="sechead">
      <p class="eyebrow">The Menu</p>
      <h2>Eighty-four treatments,<br>from a &euro;7 chin wax<br>to a &euro;80 facial.</h2>
      <p>Prices start from the figures shown and vary by therapist. Booking is instant confirmation through Fresha.</p>
    </div>
    <div class="menu">
      {menu_html()}
      <div class="catnote">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" stroke-width="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.2v.2"/></svg>
        <span><strong style="color:var(--oat);font-weight:500">A patch test is required</strong> before any tinting, lash lift, lamination or waxing treatment &mdash; it takes five minutes, it&rsquo;s free, and it can be done on any visit beforehand.</span>
      </div>
    </div>
  </div>
</section>

<section id="team" style="background:var(--raised2);border-block:1px solid var(--rule)">
  <div class="wrap">
    <div class="sechead">
      <p class="eyebrow">The Team</p>
      <h2>Clients here book a person,<br>not a salon.</h2>
      <p>Every review left for Skin Deep names the therapist who did the work. So do we.</p>
    </div>
    <div class="team-grid">{team_html()}</div>
  </div>
</section>

<section class="reviews" id="reviews">
  <div class="wrap">
    <div class="rtop">
      <div>
        <p class="eyebrow" style="margin-bottom:10px">Verified on Fresha</p>
        <div class="rscore">5.0</div>
      </div>
      <div>
        <div class="rstars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <p class="rmeta">Best in class &middot; 2,922 reviews</p>
      </div>
    </div>
    <div class="rgrid">
      <figure><blockquote>Just love this Beauty Salon, the girls are so friendly and professional. I would have absolutely no hesitation in recommending any of the girls in Skin Deep.</blockquote><figcaption>Roisin R. &middot; with <b>Janice</b></figcaption></figure>
      <figure><blockquote>Orla is excellent at her job, very efficient and a great beautician. Next appointment won&rsquo;t be long.</blockquote><figcaption>Mary D. &middot; with <b>Orla</b></figcaption></figure>
      <figure><blockquote>Everything was perfect as usual.</blockquote><figcaption>Angela M. &middot; with <b>Janice</b></figcaption></figure>
      <figure><blockquote>Very good, always happy. Orla you done amazing job, thank you.</blockquote><figcaption>Lorraine M. &middot; with <b>Orla</b></figcaption></figure>
      <figure><blockquote>On time, always pleasant, very professional.</blockquote><figcaption>Barbara F. &middot; with <b>Orla</b></figcaption></figure>
      <figure><blockquote>Brilliant.</blockquote><figcaption>Michael L. &middot; with <b>Orla</b></figcaption></figure>
    </div>
  </div>
</section>

<section class="visit" id="visit">
  <div class="wrap">
    <div>
      <p class="eyebrow">Visit</p>
      <h2 style="font-size:clamp(28px,4.4vw,44px);line-height:1.1">44 Main Street,<br>Bray, Co.&nbsp;Wicklow</h2>
      <ul class="contact" style="margin-top:32px">
        <li><span class="lbl">Telephone</span><a href="tel:+35312866068">(01) 286 6068</a></li>
        <li><span class="lbl">Email</span><a href="mailto:skindeepbray@gmail.com">skindeepbray@gmail.com</a></li>
        <li><span class="lbl">Eircode</span>A98 F7X4</li>
        <li><span class="lbl">Skincare</span>MATIS Paris &mdash; stocked and used in every facial</li>
      </ul>
      <a class="btn btn-gold" style="margin-top:32px" href="{FRESHA}" target="_blank" rel="noopener">Book on Fresha</a>
    </div>
    <div>
      <p class="eyebrow">Opening Hours</p>
      <ul class="hrs">
        {"".join(f'<li class="{"shut" if s else ""}"><span>{d}</span><span>{h}</span></li>' for d,h,s in HOURS)}
      </ul>
      <p style="font-size:13px;color:var(--mute);margin-top:20px">Late until 8pm Wednesday and Thursday. Closed Sunday and Monday.</p>
    </div>
  </div>
</section>

<section class="wk">
  <div class="wrap">
    <div class="sechead">
      <p class="eyebrow">Beyond the site</p>
      <h2>Four things we&rsquo;d fix<br>in the first week.</h2>
      <p>None of these are design problems. They&rsquo;re all costing bookings right now, and all four are quick.</p>
    </div>
    <div class="wkgrid">
      {"".join(f"<article><h3>{t}</h3><p>{b}</p></article>" for t,b in FIX)}
    </div>
  </div>
</section>

</main>

<footer>
  <div class="wrap">
    <div class="fgrid">
      <div><span class="fbrand">SKIN DEEP</span>44 Main Street, Bray, Co. Wicklow, A98&nbsp;F7X4<br>(01) 286 6068</div>
      <div><span class="fbrand" style="font-size:11px;letter-spacing:.2em">HOURS</span>Tue &amp; Fri 10&ndash;6 &middot; Wed &amp; Thu 10&ndash;8<br>Sat 10&ndash;5 &middot; Closed Sun &amp; Mon</div>
      <div><span class="fbrand" style="font-size:11px;letter-spacing:.2em">BOOK</span><a href="{FRESHA}" target="_blank" rel="noopener" style="color:var(--gold)">Instant confirmation on Fresha</a></div>
    </div>
    <p class="fnote"><strong style="color:var(--mute)">Concept only.</strong> This page is a design proposal and is not a live website. Photography is taken from the salon&rsquo;s own public Facebook page for evaluation and would be replaced by a commissioned shoot. Treatment names, durations and prices are transcribed from the salon&rsquo;s Fresha listing and should be verified before publication. Typography: Cinzel and Josefin Sans. Palette derived from ui-ux-pro-max #90 with substitutions.</p>
  </div>
</footer>

<div class="stick"><a href="{FRESHA}" target="_blank" rel="noopener">Book on Fresha &mdash; instant confirmation</a></div>
'''
open("design/index.html","w").write(HTML)
print("written", len(HTML)//1024, "KB")
