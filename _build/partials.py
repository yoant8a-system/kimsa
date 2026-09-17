# Encabezado y pie compartidos por las subpaginas.
# root_prefix: "" desde la raiz, "../" si la pagina estuviera en subcarpeta.

def head(title, description, canonical, keywords, extra_ld=""):
    return f'''<!DOCTYPE html>
<html lang="es-PE">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{canonical}">

<meta property="og:type" content="article">
<meta property="og:site_name" content="KIMSA Pizza &amp; Pasta">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:image" content="https://kimsapizza.com/assets/og/og-image.jpg">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="es_PE">

<link rel="icon" href="/assets/logo/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0d0d0d">
<link rel="stylesheet" href="/css/style.css">

<!-- Google Analytics 4 - TODO: reemplazar G-XXXXXXXXXX por el ID real -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
{extra_ld}
</head>
<body>

<header class="site-header">
  <div class="container">
    <a href="/" class="logo"><img src="/assets/logo/logo-badge.jpg" alt="KIMSA Pizza y Pasta" class="logo-img">KIMSA<span>Pizza &amp; Pasta</span></a>

    <button class="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav">
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    </button>

    <nav class="main-nav" id="main-nav">
      <ul>
        <li><a href="/carta.html">Carta</a></li>
        <li><a href="/delivery-ayacucho.html">Delivery</a></li>
        <li><a href="/pizza-para-eventos.html">Eventos</a></li>
        <li><a href="/#sucursales">Sucursales</a></li>
        <li class="nav-cta"><a href="#" data-wsp-generic="nav">Pedir por WhatsApp</a></li>
      </ul>
    </nav>

    <a href="#" class="btn btn-whatsapp btn-wsp-header" data-wsp-generic="header">Pedir por WhatsApp</a>
  </div>
</header>
'''

def footer():
    return '''
<footer class="site-footer">
  <div class="container">
    <div>
      <h4>KIMSA Pizza &amp; Pasta</h4>
      <p>Pizzas, pastas y alitas con delivery a todo Ayacucho.</p>
    </div>
    <div>
      <h4>Secciones</h4>
      <p><a href="/carta.html">Carta y precios</a></p>
      <p><a href="/delivery-ayacucho.html">Delivery en Ayacucho</a></p>
      <p><a href="/pizza-para-eventos.html">Pizza para eventos</a></p>
      <p><a href="/#sucursales">Nuestras sucursales</a></p>
    </div>
    <div>
      <h4>Contacto</h4>
      <p>Horario: 6:00 pm - 11:00 pm</p>
      <a href="#" data-wsp-generic="footer">Pedir por WhatsApp</a>
    </div>
  </div>
  <p class="footer-bottom">&copy; <span id="year"></span> KIMSA Pizza &amp; Pasta - Ayacucho, Per&uacute;</p>
  <p class="footer-bottom">Desarrollado por Yoant Ochoa - 902 322 766</p>
</footer>

<a href="#" class="wsp-float" data-wsp-generic="float" aria-label="Pedir por WhatsApp" title="Pedir por WhatsApp">
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15c-1.53 0-3.03-.41-4.34-1.19l-.31-.18-3.22.84.86-3.14-.2-.32a8.16 8.16 0 01-1.25-4.35c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.55-3.7 8.24-8.24 8.24z"/></svg>
</a>

<script src="/js/menu-data.js"></script>
<script src="/js/subpage.js"></script>
</body>
</html>
'''

def breadcrumb(name, url):
    return f'''
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {{"@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://kimsapizza.com/"}},
    {{"@type": "ListItem", "position": 2, "name": "{name}", "item": "{url}"}}
  ]
}}
</script>'''
