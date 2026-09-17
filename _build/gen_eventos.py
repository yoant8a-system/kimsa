import sys; sys.path.insert(0, "_build")
from partials import head, footer, breadcrumb

URL = "https://kimsapizza.com/pizza-para-eventos.html"

ld = breadcrumb("Pizza para eventos", URL) + '''
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type":"Question","name":"¿Cuántas pizzas necesito para 20 personas?",
     "acceptedAnswer":{"@type":"Answer","text":"Una pizza familiar rinde para 3 o 4 personas como plato principal. Para 20 personas calcula entre 5 y 7 pizzas familiares. Si hay piqueos o alitas de por medio, con 5 suele alcanzar."}},
    {"@type":"Question","name":"¿Con cuánta anticipación debo pedir para un evento?",
     "acceptedAnswer":{"@type":"Answer","text":"Para pedidos de más de 5 pizzas recomendamos avisar con al menos 24 horas. Así preparamos la masa suficiente y coordinamos la hora exacta de entrega."}},
    {"@type":"Question","name":"¿Hacen entrega a una hora específica para cumpleaños?",
     "acceptedAnswer":{"@type":"Answer","text":"Sí, los pedidos para eventos se programan a la hora que necesites dentro de nuestro horario de atención, de 6:00 pm a 11:00 pm."}},
    {"@type":"Question","name":"¿Tienen descuento por cantidad?",
     "acceptedAnswer":{"@type":"Answer","text":"La promo de 2 pizzas familiares por S/ 60 aplica también en pedidos grandes. Para cantidades mayores, escríbenos por WhatsApp y coordinamos."}}
  ]
}
</script>'''

body = '''
<section class="page-hero">
  <div class="container narrow-content">
    <p class="breadcrumb"><a href="/">Inicio</a> / Pizza para eventos</p>
    <h1>Pizza para Eventos, Cumpleaños y Reuniones en Ayacucho</h1>
    <p>Pedidos grandes coordinados con anticipación, entregados a la hora que necesitas. Sin quedarte corto de comida ni pagar de más.</p>
    <div class="hero-actions">
      <a href="#" class="btn btn-whatsapp" data-wsp-generic="eventos-hero" data-wsp-msg="Hola KIMSA! Quisiera cotizar pizzas para un evento. Somos aproximadamente ___ personas, para el dia ___ a las ___.">Cotizar mi evento</a>
      <a href="/carta.html" class="btn btn-primary">Ver la carta</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow-content">
    <h2>¿Cuántas pizzas pedir? La cuenta rápida</h2>
    <p>Es la duda de siempre, y quedarse corto arruina la reunión. La regla que usamos:</p>
    <div class="calc-table">
      <table>
        <thead>
          <tr><th>Personas</th><th>Solo pizza</th><th>Con piqueos o alitas</th></tr>
        </thead>
        <tbody>
          <tr><td>4 a 6</td><td>2 familiares</td><td>1 familiar + 1 piqueo</td></tr>
          <tr><td>10</td><td>3 familiares</td><td>2 familiares + alitas</td></tr>
          <tr><td>15</td><td>4 a 5 familiares</td><td>4 familiares + 2 piqueos</td></tr>
          <tr><td>20</td><td>5 a 7 familiares</td><td>5 familiares + Ronda Kimsa</td></tr>
          <tr><td>30</td><td>8 a 10 familiares</td><td>8 familiares + 2 Rondas</td></tr>
        </tbody>
      </table>
    </div>
    <p class="note">Una pizza familiar rinde para 3 o 4 personas como plato principal. Si es picoteo de acompañamiento, rinde para 6.</p>

    <h2>Para qué tipo de evento</h2>
    <div class="info-grid">
      <article class="info-card">
        <h3>Cumpleaños</h3>
        <p>Entregamos a la hora exacta que nos indiques. Lo más pedido: pizzas familiares variadas para que cada uno encuentre su sabor, más una Ronda Kimsa para picar mientras llega el resto de invitados.</p>
      </article>
      <article class="info-card">
        <h3>Reuniones de trabajo y after office</h3>
        <p>Pizza mediana por cada 2 o 3 personas funciona bien si es después de la jornada. Coordinamos entrega en oficina dentro de nuestras zonas de reparto.</p>
      </article>
      <article class="info-card">
        <h3>Reuniones familiares</h3>
        <p>La promo de 2 familiares por S/ 60 es la opción más conveniente. Si son más de 10, conviene combinar pizzas con pastas para variar.</p>
      </article>
      <article class="info-card">
        <h3>Eventos con anticipación</h3>
        <p>Para pedidos de más de 8 pizzas escríbenos con un día de anticipación. Así preparamos la masa necesaria y aseguramos la hora de entrega.</p>
      </article>
    </div>

    <h2>Cómo coordinamos tu pedido</h2>
    <ol class="steps-list">
      <li><strong>Escríbenos por WhatsApp</strong> con la cantidad de personas, el día y la hora.</li>
      <li><strong>Te proponemos una combinación</strong> de pizzas, piqueos y bebidas según el presupuesto que manejes.</li>
      <li><strong>Confirmamos el pedido</strong> y queda agendado para esa hora.</li>
      <li><strong>Entregamos a tiempo</strong>, en tu domicilio o local dentro de nuestras zonas de reparto.</li>
    </ol>

    <h2>Lo que más se pide para grupos</h2>
    <ul class="pick-list">
      <li><strong>Ronda Kimsa (S/ 70)</strong> - piqueo combinado, ideal para abrir la reunión.</li>
      <li><strong>Promo 2 familiares por S/ 60</strong> - Americana, Peperoni o Hawaiana 1.</li>
      <li><strong>Pizza Kimsa Especial Familiar (S/ 45)</strong> - la más completa, la que gusta a todos.</li>
      <li><strong>Alitas por sabores (desde S/ 22)</strong> - clásicas, BBQ, búfalo, acevichadas.</li>
      <li><strong>Tequeños Kimsa (S/ 20)</strong> - para picar mientras llega el resto.</li>
    </ul>

    <h2>Preguntas frecuentes</h2>
    <div class="faq-list">
      <details class="faq-item">
        <summary>¿Con cuánta anticipación debo pedir?</summary>
        <p>Para más de 5 pizzas, avísanos con al menos 24 horas. Pedidos más chicos los atendemos en el momento como cualquier delivery.</p>
      </details>
      <details class="faq-item">
        <summary>¿Entregan a una hora exacta?</summary>
        <p>Sí. Los pedidos de eventos se programan a la hora que necesites, dentro de nuestro horario de 6:00 pm a 11:00 pm.</p>
      </details>
      <details class="faq-item">
        <summary>¿Hacen descuento por cantidad?</summary>
        <p>La promo de 2 familiares por S/ 60 también aplica en pedidos grandes. Para cantidades mayores conversemos por WhatsApp.</p>
      </details>
      <details class="faq-item">
        <summary>¿Puedo pedir mitad y mitad de dos sabores?</summary>
        <p>Consúltanos al momento de coordinar. En pedidos grandes solemos poder acomodar combinaciones.</p>
      </details>
    </div>

    <div class="cta-box">
      <h3>Cuéntanos de tu evento</h3>
      <p>Dinos cuántos son y para cuándo, y te armamos el pedido.</p>
      <a href="#" class="btn btn-whatsapp" data-wsp-generic="eventos-cta" data-wsp-msg="Hola KIMSA! Quisiera cotizar pizzas para un evento. Somos aproximadamente ___ personas, para el dia ___ a las ___.">Cotizar por WhatsApp</a>
    </div>
  </div>
</section>
'''

html = head(
  "Pizza para Eventos y Cumpleaños en Ayacucho | KIMSA Pizza &amp; Pasta",
  "Pizza para cumpleaños, reuniones y eventos en Ayacucho. Te decimos cuántas pizzas pedir según el número de personas. Pedidos grandes con entrega a hora exacta.",
  URL,
  "pizza para eventos ayacucho, pizza cumpleanos ayacucho, pizza para reuniones ayacucho, catering pizza ayacucho, pedidos grandes pizza ayacucho, cuantas pizzas para 20 personas, pizza para fiestas huamanga",
  ld) + body + footer()

open("pizza-para-eventos.html","w",encoding="utf-8").write(html)
print("pizza-para-eventos.html generado")
