// ==========================================
// FASE 1: Selección del DOM y Estado Inicial
// ==========================================
const zonaVerde = document.querySelector("#zona-verde");
const aguja = document.querySelector("#aguja");
const botonParar = document.querySelector("#boton-parar");
const botonRetirarse = document.querySelector("#boton-retirarse");
const botonReintentar = document.querySelector("#boton-reintentar");
const respuesta = document.querySelector("#respuesta");

// Elementos del Marcador
const statRacha = document.querySelector("#stat-racha");
const statBotin = document.querySelector("#stat-botin");
const statBanco = document.querySelector("#stat-banco");
const statVelocidad = document.querySelector("#stat-velocidad");

// Variables de estado persistentes
let botinAcumuladoTotal = 0; // Se conserva entre partidas

// Variables de estado de la ronda
let posicionAguja = 0;
let velocidadBase = 1.8; 
let velocidadActual = velocidadBase;
let direccion = 1;
let enJuego = true;

// Variables de dificultad por ronda
let anchoZonaVerde = 25;
let inicioZonaVerde = 37.5;
let racha = 0;
let recompensaEnJuego = 0;

// ==========================================
// FASE 2: Bucle de Animación
// ==========================================
function animar() {
  if (enJuego) {
    posicionAguja += velocidadActual * direccion;
    
    // Invertir dirección al tocar las esquinas
    if (posicionAguja >= 100 || posicionAguja <= 0) {
      direccion *= -1;
    }
    
    aguja.style.left = `${posicionAguja}%`;
  }
  requestAnimationFrame(animar);
}

// Iniciar bucle de animación
animar();

// ==========================================
// FASE 3 Y 4: Lógica de Juego y Botones
// ==========================================
function evaluarZona() {
  const finZonaVerde = inicioZonaVerde + anchoZonaVerde;

  if (posicionAguja >= inicioZonaVerde && posicionAguja <= finZonaVerde) {
    // Reducción progresiva de la zona verde (15% por acierto)
    anchoZonaVerde = Math.max(4, anchoZonaVerde * 0.85);
    
    // Aumento de velocidad controlado (+7% por acierto)
    velocidadActual = velocidadActual * 1.07;
    
    // Posicionar aleatoriamente la nueva zona verde
    inicioZonaVerde = Math.floor(Math.random() * (90 - anchoZonaVerde - 10)) + 10;
    
    // Actualizar renderizado
    zonaVerde.style.width = `${anchoZonaVerde}%`;
    zonaVerde.style.left = `${inicioZonaVerde}%`;
    
    return true;
  }
  return false;
}

function procesarIntento() {
  if (!enJuego) return;

  const acierto = evaluarZona();

  if (acierto) {
    racha++;
    recompensaEnJuego = racha === 1 ? 100 : recompensaEnJuego * 2;
    
    // Habilitar botón de retirarse tras el primer acierto
    botonRetirarse.disabled = false;

    // Actualización segura del DOM
    respuesta.textContent = "¡EXCELENTE! La velocidad aumenta. ¿Apuestas o te retiras?";
    statRacha.textContent = racha;
    statBotin.textContent = `$${recompensaEnJuego.toLocaleString()}`;
    
    const multiplicador = (velocidadActual / velocidadBase).toFixed(1);
    statVelocidad.textContent = `${multiplicador}x`;
  } else {
    respuesta.textContent = `¡FALLASTE! Perdiste los $${recompensaEnJuego.toLocaleString()} en juego.`;
    
    racha = 0;
    recompensaEnJuego = 0;
    statRacha.textContent = "0";
    statBotin.textContent = "$0";
    
    finalizarPartida();
  }
}

function retirarse() {
  if (!enJuego || recompensaEnJuego === 0) return;

  // Transferir el dinero en juego al banco acumulado
  botinAcumuladoTotal += recompensaEnJuego;
  statBanco.textContent = `$${botinAcumuladoTotal.toLocaleString()}`;

  respuesta.textContent = `¡TE HAS RETIRADO! Guardaste $${recompensaEnJuego.toLocaleString()} en tu banco.`;
  
  recompensaEnJuego = 0;
  statBotin.textContent = "$0";
  
  finalizarPartida();
}

function reiniciarPartida() {
  // Resetear variables de la ronda
  posicionAguja = 0;
  velocidadActual = velocidadBase;
  direccion = 1;
  anchoZonaVerde = 25;
  inicioZonaVerde = 37.5;
  racha = 0;
  recompensaEnJuego = 0;
  enJuego = true;

  // Restaurar estado visual
  zonaVerde.style.width = `${anchoZonaVerde}%`;
  zonaVerde.style.left = `${inicioZonaVerde}%`;
  aguja.style.left = "0%";

  statRacha.textContent = "0";
  statBotin.textContent = "$0";
  statVelocidad.textContent = "1.0x";
  respuesta.textContent = "Presiona '¡PARAR!' o la barra espaciadora para comenzar.";

  // Ajustar estado de botones
  botonParar.disabled = false;
  botonRetirarse.disabled = true;
  botonReintentar.disabled = true;
}

function finalizarPartida() {
  enJuego = false;
  botonParar.disabled = true;
  botonRetirarse.disabled = true;
  botonReintentar.disabled = false; // Se activa para volver a jugar sin recargar
}

// ==========================================
// FASE 5: Eventos del DOM
// ==========================================
botonParar.addEventListener("click", procesarIntento);
botonRetirarse.addEventListener("click", retirarse);
botonReintentar.addEventListener("click", reiniciarPartida);

document.addEventListener("keydown", (evento) => {
  if (evento.code === "Space") {
    evento.preventDefault();
    if (enJuego) {
      procesarIntento();
    } else {
      reiniciarPartida(); // La barra espaciadora sirve para reintentar si la partida terminó
    }
  }
  
  // BONUS: Modo Oscuro con tecla 'D'
  if (evento.code === "KeyD") {
    document.body.classList.toggle("dark-mode");
  }
});