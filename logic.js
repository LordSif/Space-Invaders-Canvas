const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const leftBtn = document.getElementById('leftBtn')
const rightBtn = document.getElementById('rightBtn')
const scoreBoard = document.getElementById('scoreBoard')
const explosionSound = new Audio('explosion1.mp3')
const healSound = new Audio('heal1.mp3')
const hitSound = new Audio('hit2.mp3')
const CombatMusic = new Audio('combat-music1.m4a')
const livesBoard = document.getElementById('livesBoard')
const damageOverlay = document.getElementById('damageOverlay')
const gameOverSound = new Audio('game-over3.mp3')
CombatMusic.loop = true
CombatMusic.volume = 0.5

let score = 0
let lives = 3
let healTimer = 0
let gameStarted = false
let isGameActive = true


function startAudio() {
  if (!gameStarted) {
    CombatMusic.play()
    gameStarted = true
  }
}

document.addEventListener('click', startAudio)
document.addEventListener('touchstart', startAudio)
document.addEventListener('mousemove', startAudio)
document.addEventListener('keydown', startAudio)
document.addEventListener('mousedown', startAudio)
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

// Explosion Effect
const explosions = []

// Health Effect
const healing = []

// Stars
const stars = []
const numStars = 100

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

// Starfield Effect
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    speed: Math.random() * 2 + 0.5
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

// Explosion Effect
function createExplosion(x, y) {
  const particles = 15
  for (let i = 0; i < particles; i++) {
    explosions.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      size: Math.random() * 4 + 1,
      //radius: Math.random() * 3 + 2,
      time: 30,
    })
  }
}

function HealEffect(x, y) {
  const particle = 10
  for (let i = 0; i < particle; i++) {
    healing.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: - (Math.random() * 3 - 1),
      size: Math.random() * 5 + 4,
      life: 40,
    })
  }
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
  console.log("Veces en ejecutarse")

  if (value < 0) {
    damageOverlay.classList.add('animate-flash')
    setTimeout(() => damageOverlay.classList.remove('animate-flash'), 400)
  }
  lives += value
  if (lives > 5) lives = 5
  livesBoard.innerHTML = ""

  const label = document.createElement('span')
  label.textContent = "Lives: "
  livesBoard.appendChild(label)

  for (let i = 0; i < lives; i++) {
    const heartImg = document.createElement('img')
    heartImg.src = "heart1.png"
    heartImg.classList.add("heart-icon")
    livesBoard.appendChild(heartImg)
  }

  if (lives <= 0) {
    console.log("Game Over!")
    isGameActive = false
    setTimeout(() => damageOverlay.classList.add('animate-flash'), 1000)
    canvas.style.filter = 'grayscale(100%) blur(2px) brightness(0.5)'
    CombatMusic.currentTime = 0
    CombatMusic.pause()
    gameOverSound.play()
    setTimeout(() => {
      alert("Game Over! Your final score is: " + score)
      document.location.reload()
    }, 1500)
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
      hitSound.currentTime = 0
      hitSound.play()
      updateLivesBoard(-1)
      continue
    }
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1)
      i--
      updateLivesBoard(-1)
      console.log("Enemy passed! Lives left: " + lives)
    }
  }

  // Move lives objects
  for (let i = 0; i < livesObj.length; i++) {
    livesObj[i].y += livesObj[i].speed
    if (isColliding(player, livesObj[i])) {
      HealEffect(player.x + player.width / 2, player.y)
      healTimer = 20
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
  // Heal timer update
  if (healTimer > 0) {
    healTimer--
  }

  // Collision detection between bullets and enemies
  for (let i = 0; i < bullets.length; i++) {
    for (let j = 0; j < enemies.length; j++) {
      if (isColliding(bullets[i], enemies[j])) {
        createExplosion(enemies[j].x + enemies[j].width / 2, enemies[j].y)
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

  // Explosion update
  for (let i = 0; i < explosions.length; i++) {
    const particle = explosions[i]
    particle.x += particle.vx
    particle.y += particle.vy
    particle.time--

    if (particle.time <= 0) {
      explosions.splice(i, 1)
      i--
    }
  }

  // Healing effect update
  for (let i = 0; i < healing.length; i++) {
    const particle = healing[i]
    particle.x += particle.vx
    particle.y += particle.vy
    particle.life--

    if (particle.life <= 0) {
      healing.splice(i, 1)
      i--
    }
  }

  // Starfield update
  stars.forEach(star => {
    star.y += star.speed
    if (star.y > canvas.height) {
      star.y = 0
      star.x = Math.random() * canvas.width
    }
  })



}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  stars.forEach(star => {
    const flicker = 0.5 + Math.random() * 0.5
    ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fill()
  })

  // Draw Player (Navecita)
  if (healTimer > 0) {
    ctx.fillStyle = 'white'
    ctx.shadowBlur = 100
    ctx.shadowColor = '#00ff88'
  } else {
    ctx.fillStyle = '#0095DD'
    ctx.shadowBlur = 0
  }
  ctx.fillRect(player.x, player.y, player.width, player.height)
  ctx.shadowBlur = 0

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

  // Draw explosions
  ctx.fillStyle = '#fcff34ff'
  explosions.forEach(particle => {
    ctx.globalAlpha = particle.time / 30
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size)

  })
  ctx.globalAlpha = 1

  // Draw healing effects
  ctx.fillStyle = '#00ff88'
  healing.forEach(particle => {
    ctx.globalAlpha = particle.life / 40
    ctx.fillRect(particle.x, particle.y - particle.size / 2, 2, particle.size)
    ctx.fillRect(particle.x - particle.size / 2, particle.y, particle.size, 2)
  })
  ctx.globalAlpha = 1

}

function gameLoop() {
  if (!isGameActive) return
  update()
  draw()
  requestAnimationFrame(gameLoop)
}

window.onload = updateLivesBoard(0)

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

