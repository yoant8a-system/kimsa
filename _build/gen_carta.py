import sys, json, re, subprocess
sys.path.insert(0, "_build")
from partials import head, footer, breadcrumb

# Leer la carta desde la MISMA fuente que usa la web, para que nunca se desincronicen
src = open("js/menu-data.js", encoding="utf-8").read()
node = subprocess.run(
    ["node", "-e", src + "\nconsole.log(JSON.stringify({MENU, BUSINESS}))"],
    capture_output=True, text=True, check=True)
data = json.loads(node.stdout)
MENU = data["MENU"]

URL = "https://kimsapizza.com/carta.html"

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# --- HTML visible ---
secs = []
nav = []
for i, cat in enumerate(MENU):
    nav.append(f'<a href="#cat-{i}" class="menu-tab">{esc(cat["category"])}</a>')
    rows = []
    for it in cat["items"]:
        desc = f'<p class="carta-desc">{esc(it["desc"])}</p>' if it.get("desc") else ""
        rows.append(f'''        <li class="carta-item">
          <div>
            <h3>{esc(it["name"])}</h3>
            {desc}
          </div>
          <span class="carta-precio">S/ {it["price"]:.2f}</span>
        </li>''')
    secs.append(f'''    <section class="carta-cat" id="cat-{i}">
      <h2>{esc(cat["category"])}</h2>
      <ul class="carta-lista">
{chr(10).join(rows)}
      </ul>
    </section>''')

# --- JSON-LD del menu, generado de los mismos datos ---
menu_ld = {
  "@context": "https://schema.org",
  "@type": "Menu",
  "name": "Carta KIMSA Pizza & Pasta",
  "inLanguage": "es-PE",
  "hasMenuSection": [
    {"@type": "MenuSection", "name": c["category"],
     "hasMenuItem": [
        {k: v for k, v in {
            "@type": "MenuItem",
            "name": i["name"],
            "description": i.get("desc"),
            "offers": {"@type": "Offer", "price": i["price"], "priceCurrency": "PEN"}
        }.items() if v is not None}
        for i in c["items"]]}
    for c in MENU]
}

ld = breadcrumb("Carta y precios", URL) + \
     '\n<script type="application/ld+json">\n' + \
     json.dumps(menu_ld, ensure_ascii=False, indent=2) + '\n</script>'

total = sum(len(c["items"]) for c in MENU)

body = f'''
<section class="page-hero">
  <div class="container">
    <p class="breadcrumb"><a href="/">Inicio</a> / Carta y precios</p>
    <h1>Carta y Precios - KIMSA Pizza &amp; Pasta Ayacucho</h1>
    <p>Los {total} platos de nuestra carta con sus precios actualizados. Pizzas artesanales, pastas, alitas y piqueos, para comer en local o con delivery a domicilio en Huamanga.</p>
    <div class="hero-actions">
      <a href="/" class="btn btn-primary">Armar mi pedido</a>
      <a href="#" class="btn btn-whatsapp" data-wsp-generic="carta-hero" data-wsp-msg="Hola KIMSA! Vi la carta en la web y quisiera hacer un pedido.">Pedir por WhatsApp</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="menu-tabs">{"".join(nav)}</div>
{chr(10).join(secs)}

    <div class="cta-box">
      <h3>Arma tu pedido sin escribir nada</h3>
      <p>En la página principal marcas cantidades y el pedido se manda solo por WhatsApp, con el total ya calculado.</p>
      <a href="/" class="btn btn-primary">Ir a armar mi pedido</a>
    </div>
  </div>
</section>
'''

html = head(
  "Carta y Precios | KIMSA Pizza &amp; Pasta Ayacucho",
  f"Carta completa de KIMSA Pizza & Pasta en Ayacucho: {total} platos con precios. Pizzas familiares desde S/30, medianas desde S/18, pastas, alitas y piqueos. Delivery en Huamanga.",
  URL,
  "carta kimsa ayacucho, precios pizza ayacucho, menu pizzeria ayacucho, cuanto cuesta pizza ayacucho, carta pizzas precios huamanga, precio pizza familiar ayacucho",
  ld) + body + footer()

open("carta.html","w",encoding="utf-8").write(html)
print(f"carta.html generado con {total} platos")
