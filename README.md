# WEB-Mision-1

# Doble o Nada

Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre `index.html` directamente en tu navegador (o con Live Server en VS Code). Presiona la barra espaciadora o haz clic en el botón 'PARAR' para detener la línea sobre la zona verde. Si aciertas, puedes seguir arriesgando para duplicar la recompensa o retirarte pulsando 'RETIRARSE' para asegurar el dinero en tu banco. Si fallas, pierdes lo acumulado en esa ronda.
'Atajo secreto:' Pulsa `D` en el teclado para activar/desactivar el modo oscuro.

## Uso de IA
Usé Gemini como apoyo en el desarrollo de la web aproximado un 60% código guiado con IA y 40% código/diseño propio.

## Ejemplos de prompts reales utilizados:
1. "Ayudame a estructurar la función procesarIntento en JS para un juego de timing sin usar onclick en el HTML y asegurando que las actualizaciones de texto usen textContent por seguridad XSS."
2. "Dime sin escribir el codigo directamente como puedo hacer un bucle de animación suave de la linea rebotando de izquierda a derecha usando requestAnimationFrame en lugar de setInterval."
3. "Como puedo ponerle un estilo vintage con sombras para dar efecto dimensionado y texturas de fondo utilizando solo css sin usar imágenes externas? dime varias formas y distintos estilos."
4. "Quiero hacer una funcion en JavaScript para reducir el tamaño de la zona verde de forma exponencial en cada acierto sin que baje de un límite mínimo para que no sea imposible de jugar, dame pistas de como empezarla."

## Probar funcionalidad:
Probé cada módulo manualmente en el navegador comprobando los casos límite: presionar la barra espaciadora antes de arrancar, pulsar el botón de retirarse en racha 0 (comprobando que estuviera deshabilitado), probar la aceleración en rachas altas y verificar que la tecla del bonus no influyera en nada externo a la pagina. 

## Desarrollo del codigo:
- Todo el apartado estético y maquetación CSS: Implemente y modifique todas las variables de color CSS (`:root`), la tipografía importada de Google Fonts, los bordes redondeados clásicos y la posición e implementación de decoración extra para la pagina, utilizando `::before` y `::after`, para esto ultimo me apoye en la IA tanto para preguntas del codigo como para ideas del diseño.
- Funciones JS: Para estas funciones fui desarrollando las primeras partes y utilice la IA para preguntar dudas de como llevar a cabo el funcionamiento, errores cometidos tras implementar nuevas funciones etc. 

## Autopsia
1. Manejo del bucle de la aguja con `requestAnimationFrame` en vez de `setInterval`:
   - Decisión tomada: Use un bucle continuo con `requestAnimationFrame` que consulta la variable `enJuego` en cada frame.
   - Alternativa descartada: Usar `setInterval` para mover la aguja cada X milisegundos. La descarte porque los intervalos en JavaScript no son precisos, producen micro-tirones visuales si el navegador se satura y ralentiza la pagina dependiendo de la pantalla/ordenador.

2. Reinicio de partida mediante reseteo de variables de estado vs. `location.reload()`:
   - Decisión tomada: Crear una función `reiniciarPartida()` que restablece manualmente el juego, la posicion, zona verde etc.
   - Alternativa descartada: Hacer que el botón de reintentar ejecutara un `location.reload()` para refrescar la página completa. La descarte por que al añadir un botin/puntuacion total al recargar la pagina esta se reseteaba a 0.

3. Cálculo de la colisión:
   - Decisión tomada: Calcular si la aguja está dentro de la zona verde usando porcentajes matemáticos (`posicionAguja >= inicioZonaVerde && posicionAguja <= finZonaVerde`).
   - Alternativa descartada: Leer las coordenadas píxel por píxel en tiempo real del DOM usando `getBoundingClientRect()`. La descarte porque forzar al navegador a recalcular el layout (reflow) en cada frame consume más recursos del sistema y acopla la lógica matemática del juego al tamaño en píxeles del monitor del usuario y es una funcion compleja la cual no sabria explicar.
