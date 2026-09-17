import sys; sys.path.insert(0, "_build")
from partials import head, footer, breadcrumb

URL = "https://kimsapizza.com/delivery-ayacucho.html"

ld = breadcrumb("Delivery en Ayacucho", URL) + '''
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"¿Cuánto demora el delivery en Ayacucho?",
     "acceptedAnswer":{"@type":"Answer","text":"Entre 30 y 45 minutos en zonas cercanas a nuestros locales. En horas punta, viernes y sábados por la noche, puede extenderse. Al confirmar el pedido por WhatsApp te damos el tiempo estimado real de ese momento."}},
    {"@type":"Question","name":"¿A qué distritos de Ayacucho llega el delivery?",
     "acceptedAnswer":{"@type":"Answer","text":"Llegamos a Ayacucho Cercado, San Juan Bautista, Carmen Alto, Jesús Nazareno, Andrés Avelino Cáceres Dorregaray, Yanama, Yanamilla, San José y la Vía Los Libertadores."}},
    {"@type":"Question","name":"¿Hay monto mínimo para el delivery?",
     "acceptedAnswer":{"@type":"Answer","text":"Consúltanos por WhatsApp al hacer tu pedido. El costo de envío depende de la distancia desde el local más cercano a tu dirección."}},
    {"@type":"Question","name":"¿Hasta qué hora puedo pedir delivery?",
     "acceptedAnswer":{"@type":"Answer","text":"Tomamos pedidos hasta las 11:00 pm todos los días. Para pedidos grandes conviene escribir con anticipación."}}
  ]
}
</script>'''

body = '''
<section class="page-hero">
  <div class="container">
    <p class="breadcrumb"><a href="/">Inicio</a> / Delivery en Ayacucho</p>
    <h1>Delivery de Pizza en Ayacucho</h1>
    <p>Pedir pizza a domicilio en Huamanga sin llamadas ni esperas: eliges, mandas el pedido por WhatsApp y te llega caliente.</p>
    <div class="hero-actions">
      <a href="/carta.html" class="btn btn-primary">Ver la carta</a>
      <a href="#" class="btn btn-whatsapp" data-wsp-generic="delivery-hero" data-wsp-msg="Hola KIMSA! Quisiera pedir delivery. Mi direccion es:">Pedir delivery</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow-content">
    <h2>Cómo pedir, paso a paso</h2>
    <ol class="steps-list">
      <li><strong>Elige en la carta.</strong> Marca las cantidades de cada plato en <a href="/">la página principal</a>. El total se calcula solo.</li>
      <li><strong>Escribe tu dirección y distrito.</strong> Aparecen justo encima del botón de enviar.</li>
      <li><strong>Envía por WhatsApp.</strong> El pedido llega escrito y completo, no hay que dictarlo.</li>
      <li><strong>Confirmamos.</strong> Te decimos el tiempo estimado y desde qué local sale tu pedido.</li>
    </ol>

    <h2>Zonas de reparto</h2>
    <p>Repartimos a domicilio en todo Huamanga y alrededores. Estas son las zonas que cubrimos habitualmente:</p>
    <ul class="coverage-list">
      <li>Ayacucho (Cercado)</li>
      <li>San Juan Bautista</li>
      <li>Carmen Alto</li>
      <li>Jesús Nazareno</li>
      <li>Andrés Avelino Cáceres Dorregaray</li>
      <li>Yanama</li>
      <li>Yanamilla</li>
      <li>San José</li>
      <li>Vía Los Libertadores</li>
    </ul>
    <p class="note">¿Tu zona no está en la lista? Consúltanos igual por WhatsApp. Si estás cerca de alguno de nuestros tres locales, es muy probable que lleguemos.</p>

    <h2>Tiempos de entrega</h2>
    <p>En zonas cercanas a nuestros locales el pedido suele llegar entre <strong>30 y 45 minutos</strong>. Viernes y sábados por la noche, que es cuando más pedidos entran, puede demorar algo más. Al confirmarte el pedido te damos el tiempo real de ese momento, no una promesa genérica.</p>
    <p>Un consejo práctico: si es para una hora específica (una reunión, un cumpleaños), escríbenos antes y lo dejamos programado.</p>

    <h2>Desde qué local sale tu pedido</h2>
    <p>Tenemos tres locales en Huamanga y el pedido sale del más cercano a tu dirección, para que llegue lo más rápido posible:</p>
    <div class="info-grid" id="branches-simple"></div>

    <h2>Preguntas sobre el delivery</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>¿Cuánto cuesta el envío?</summary>
        <p>Depende de la distancia desde el local más cercano hasta tu dirección. Te lo confirmamos por WhatsApp antes de despachar, nunca hay sorpresas al momento de pagar.</p>
      </details>
      <details class="faq-item">
        <summary>¿Hasta qué hora puedo pedir?</summary>
        <p>Tomamos pedidos hasta las 11:00 pm todos los días de la semana.</p>
      </details>
      <details class="faq-item">
        <summary>¿Puedo pagar con Yape o Plin?</summary>
        <p>Consúltanos al confirmar el pedido y te indicamos las formas de pago disponibles en ese momento.</p>
      </details>
      <details class="faq-item">
        <summary>¿Las promociones valen para delivery?</summary>
        <p>Sí. La promo de 2 pizzas familiares por S/ 60 es válida tanto en local como en delivery.</p>
      </details>
    </div>

    <div class="cta-box">
      <h3>¿Listo para pedir?</h3>
      <p>Arma tu pedido en un minuto y termínalo por WhatsApp.</p>
      <a href="/" class="btn btn-primary">Ir a la carta</a>
    </div>
  </div>
</section>
'''

html = head(
  "Delivery de Pizza en Ayacucho | KIMSA Pizza &amp; Pasta",
  "Delivery de pizza a domicilio en Ayacucho: Cercado, San Juan Bautista, Carmen Alto, Jesús Nazareno y más. Entrega en 30-45 min hasta las 11 pm. Pide por WhatsApp.",
  URL,
  "delivery pizza ayacucho, pizza a domicilio ayacucho, delivery comida ayacucho, pizza delivery huamanga, reparto pizza ayacucho, delivery de noche ayacucho, pizza domicilio san juan bautista",
  ld) + body + footer()

open("delivery-ayacucho.html","w",encoding="utf-8").write(html)
print("delivery-ayacucho.html generado")
