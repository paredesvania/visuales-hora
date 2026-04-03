let spacing = 15; // Distancia entre puntos (más grande = más rápido)
let cols, rows;
let xoff, yoff;
let zoff = 0; // Tercera dimensión de ruido para animación
let targetX, targetY;
let currentX, currentY;
let isInteracting = false;

// Paletas inspiradas en tus referencias
let palettes = [
  { bg: '#FFFFFF', dot: '#D4E157' }, // Lime Green sobre Blanco (img 1)
  { bg: '#fed5e7', dot: '#fe06d3' }  // (img 2)
];
let activePalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(displayDensity());
  
  // Elegir una paleta aleatoria al inicio
  activePalette = random(palettes);
  
  targetX = width / 4;
  targetY = height / 5;
  currentX = targetX;
  currentY = targetY;

  // Calculamos la cuadrícula una vez
  calculateGrid();
}

function draw() {
  background(activePalette.bg);

  // Suavizado del input para un movimiento elegante
  currentX = lerp(currentX, targetX, 0.08);
  currentY = lerp(currentY, targetY, 0.08);

  // Variación lenta del ruido de fondo (animación pasiva)
  zoff += 0.005;

  noFill();
  stroke(activePalette.dot);
  strokeWeight(1); // Línea muy fina para definición

  // Dibujar la grilla de semitono
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * spacing + spacing / 2;
      let y = j * spacing + spacing / 2;

      // Usamos ruido de Perlin para determinar el tamaño del punto.
      // Modificamos el ruido basándonos en la posición de interacción.
      let d = dist(x, y, currentX, currentY);
      
      // 'noiseVal' crea las formas orgánicas. Es sensible a la posición (x, y),
      // a la animación (zoff) y al punto de interacción (currentX, currentY).
      let noiseVal = noise(
        (x + currentX) * 0.003, 
        (y + currentY) * 0.003, 
        zoff
      );

      // Usamos el ruido para definir el diámetro del círculo.
      // Map(valor_entrada, min_in, max_in, min_out, max_out)
      // Definimos los rangos para que los puntos sean pequeños pero visibles.
      let diameter = map(noiseVal, 0.2, 0.8, 1, spacing * 0.85);
      
      // Un efecto extra: los puntos cerca del cursor se hacen más pequeños
      // para "abrir" el patrón.
      if (d < 200) {
        diameter *= map(d, 0, 200, 0.2, 1);
      }

      // Dibujar el punto (semitono)
      if (diameter > 1) { // No dibujar si es muy pequeño
        ellipse(x, y, diameter, diameter);
      }
    }
  }
}

// ----------------------
// RESPONSIVE Y RENDIMIENTO
// ----------------------

function calculateGrid() {
  cols = floor(width / spacing);
  rows = floor(height / spacing);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateGrid();
}

// ----------------------
// GESTIÓN DE INTERACCIÓN (PC Y MÓVIL)
// ----------------------

function mouseMoved() {
  targetX = mouseX;
  targetY = mouseY;
}

function touchStarted() {
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  return false; // Prevenir scroll accidental
}

function touchMoved() {
  if (touches.length > 0) {
    targetX = touches[0].x;
    targetY = touches[0].y;
  }
  return false;
}