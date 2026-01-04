const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const leftBtn = document.getElementById('leftBtn')
const rightBtn = document.getElementById('rightBtn')
const scoreBoard = document.getElementById('scoreBoard')
const explosionSound = new Audio('explosion1.mp3')
const healSound = new Audio('heal1.mp3')
const livesBoard = document.getElementById('livesBoard')

let score = 0
let lives = 3

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
setInterval(spawnEnemy, 1000)

// Bullets Object
const bullets = []
setInterval(fireBullet, 500)

// Lives Object
const livesObj = []
setInterval(spawnLivesObj, 15000)

// Input Tracking
let leftPressed = false
let rightPressed = false

// Keyboard Input
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') leftPressed = true
  if (e.key === 'ArrowRight') rightPressed = true
})
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft') leftPressed = false
  if (e.key === 'ArrowRight') rightPressed = false
})

// Button Input
leftBtn.addEventListener('touchstart', () => leftPressed = true)
leftBtn.addEventListener('touchend', () => leftPressed = false)
rightBtn.addEventListener('touchstart', () => rightPressed = true)
rightBtn.addEventListener('touchend', () => rightPressed = false)

// Mouse Input
leftBtn.addEventListener('mousedown', () => leftPressed = true)
leftBtn.addEventListener('mouseup', () => leftPressed = false)
rightBtn.addEventListener('mousedown', () => rightPressed = true)
rightBtn.addEventListener('mouseup', () => rightPressed = false)

// Fire Bullet
function fireBullet() {
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y - 10,
    width: 4,
    height: 10,
    speed: 7
  })
}

// Spawn Enemy
function spawnEnemy() {
  const enemyWidth = 30
  enemies.push({
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0,
    width: enemyWidth,
    height: 20,
    speed: 2
  })
}

function spawnLivesObj() {
  const lifeWidth = 10
  livesObj.push({
    x: Math.random() * (canvas.width - lifeWidth),
    y: 0,
    width: lifeWidth,
    height: lifeWidth,
    speed: 1.5
  })

}

// Collision Detection AABB algorithm
function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
}

// Update Lives Board
function updateLivesBoard(value) {
  lives += value
  if (lives > 5) lives = 5
  livesBoard.textContent = "Lives: " + lives
  if (lives < 0) {
    alert("Game Over! Your final score is: " + score)
    document.location.reload()
  }
}
// Logic for game
function update() {
  // Move player
  if (leftPressed) player.x = Math.max(0, player.x - player.speed)
  if (rightPressed) player.x = Math.min(canvas.width - player.width, player.x + player.speed)

  // Move bullets
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed
    if (bullets[i].y < 0) {
      bullets.splice(i, 1)
      i--
    }
  }

  // Move enemies
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].y += enemies[i].speed
    if (isColliding(player, enemies[i])) {
      enemies.splice(i, 1)
      i--
      updateLivesBoard(-1)
      continue
    }
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1)
      i--
      updateLivesBoard(-1)
    }
  }

  // Move lives objects
  for (let i = 0; i < livesObj.length; i++) {
    livesObj[i].y += livesObj[i].speed
    if (isColliding(player, livesObj[i])) {
      livesObj.splice(i, 1)
      i--
      healSound.currentTime = 0
      healSound.play()
      updateLivesBoard(1)
      continue
    }
    if (livesObj[i].y > canvas.height) {
      livesObj.splice(i, 1)
      i--
    }

  }

  // Collision detection between bullets and enemies
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (isColliding(bullets[i], enemies[j])) {
        bullets.splice(i, 1)
        enemies.splice(j, 1)
        score += 10
        scoreBoard.textContent = "Score: " + score
        explosionSound.currentTime = 0
        explosionSound.play()
        i--
        break
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Player (Navecita)
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(player.x, player.y, player.width, player.height)

  // Draw bullets
  ctx.fillStyle = '#FF0000'
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
  })

  // Draw enemies (Extraterrestres xd)
  ctx.fillStyle = '#27ae60'
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  })

  // Draw lives objects
  ctx.fillStyle = '#93f3d6ff'
  livesObj.forEach(live => {
    ctx.fillRect(live.x, live.y, live.width, live.height)
  })
}



function gameLoop() {
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

gameLoop();

/* 
# requestAnimationFrame(function);
 
Función de JavaScript que le dice al navegador que quieres
hacer una animación, solicitando que ejecute una función específica
(callback) antes del siguiente repintado de la pantalla,
sincronizándose con la tasa de refresco del monitor

# function isColliding(rect1, rect2) { ... }

Esta función utiliza un algoritmo llamado AABB (Axis-Aligned Bounding Box).
Su objetivo es verificar si dos rectángulos se están tocando o solapando
en un espacio de 2D.


*/

