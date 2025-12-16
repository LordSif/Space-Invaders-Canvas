const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const leftBtn = document.getElementById('leftBtn')
const rightBtn = document.getElementById('rightBtn')
const scoreBoard = document.getElementById('scoreBoard')

let score = 0

// Player Object (Navecita)
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 30,
  width: 30,
  height: 10,
  speed: 5
}

// Enemy Object (Extraterrestres xd)
const enemies = []
//setInterval(spawnEnemy, 1000)

// Input Tracking
let leftPressed = false
let rightPressed = false

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') leftPressed = true
  if (e.key === 'ArrowRight') rightPressed = true
})
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') leftPressed = false
  if (e.key === 'ArrowRight') rightPressed = false
})



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw Player (Navecita)
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(player.x, player.y, player.width, player.height)
}

// Logic for game
function update() {
  // Move player
  if (leftPressed) player.x = Math.max(0, player.x - player.speed)
  if (rightPressed) player.x = Math.min(canvas.width - player.width, player.x + player.speed)
}
  /* 
  # requestAnimationFrame(function);
  
  Función de JavaScript que le dice al navegador que quieres
  hacer una animación, solicitando que ejecute una función específica
  (callback) antes del siguiente repintado de la pantalla,
  sincronizándose con la tasa de refresco del monitor */
  function gameLoop() {
    update()
    draw()
    requestAnimationFrame(gameLoop)
  }

  gameLoop();

