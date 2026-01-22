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
const gameContainer = document.getElementById('gameContainer')
const mainMenu = document.getElementById('mainMenu')
const btnPlay = document.getElementById('btnPlay')
const btnOptions = document.getElementById('btnOptions')
const btnCredits = document.getElementById('btnCredits')
const btnLanguage = document.getElementById('btnLanguage')
const btnBack = document.getElementById('btnBack')
const btnScore = document.getElementById('btnScore')
const sound = document.getElementById('sound')
const color = document.getElementById('color')
const credits = document.getElementById('credits')
const optionsTitle = document.getElementById('optionsTitle')
const mobileControls = document.getElementById('mobileControls')
const optionsMenu = document.getElementById('optionsMenu')
const volumeSlider = document.getElementById('volumeSlider')
const shipColorPicker = document.getElementById('shipColorPicker')
const gameOverSound = new Audio('game-over3.mp3')

CombatMusic.loop = true
CombatMusic.volume = 0.6

const Languages = ['EN', 'ES', 'FR']
let LangIndex = 0
let currentLang = Languages[LangIndex]
let score = 0
let lives = 3
let healTimer = 0
let damageTimer = 0
let isGameActive = false
let enemyInterval
let bulletInterval
let livesInterval
let animationId
let playerColor = '#0055ff'


function startGame() {
  if (isGameActive) return
  isGameActive = true

  mainMenu.classList.add('hidden')
  mobileControls.classList.remove('hidden')
  scoreBoard.classList.remove('hidden')
  livesBoard.classList.remove('hidden')

  CombatMusic.play()

  enemyInterval = setInterval(spawnEnemy, 1000)
  bulletInterval = setInterval(fireBullet, 500)
  livesInterval = setInterval(spawnLivesObj, 15000)
  updateLivesBoard(0)
  requestAnimationFrame(gameLoop)
}

function resetGame() {

  enemies.length = 0
  bullets.length = 0
  livesObj.length = 0
  explosions.length = 0
  healing.length = 0
  bossBullets.length = 0

  score = 0
  lives = 3
  healTimer = 0
  damageTimer = 0

  boss.active = false
  boss.health = boss.maxHealth
  boss.y = -150

  player.x = canvas.width / 2 - 15
  player.y = canvas.height - 30

  canvas.style.filter = 'none'
  damageOverlay.classList.remove('animate-flash')
  scoreBoard.textContent = translations[currentLang].hudScore + score
  updateLivesBoard(0)
}

btnPlay.addEventListener('click', startGame)
btnPlay.addEventListener('touchstart', startGame)

btnOptions.addEventListener('click', () => {
  mainMenu.classList.add('hidden')
  optionsMenu.classList.remove('hidden')
})
btnBack.addEventListener('click', () => {
  optionsMenu.classList.add('hidden')
  mainMenu.classList.remove('hidden')
})

volumeSlider.addEventListener('input', (e) => {
  const volume = e.target.value
  CombatMusic.volume = volume
})

shipColorPicker.addEventListener('input', (e) => {
  playerColor = e.target.value
})

btnLanguage.addEventListener('click', () => {
  LangIndex++
  if (LangIndex >= Languages.length) LangIndex = 0
  currentLang = Languages[LangIndex]

  updateLanguage()
})

function updateLanguage() {
  const language = translations[currentLang]

  btnPlay.textContent = language.play
  btnOptions.textContent = language.options
  btnCredits.textContent = language.credits
  btnBack.textContent = language.back
  btnScore.textContent = language.score
  btnCredits.textContent = language.credits

  sound.textContent = language.sound
  color.textContent = language.color
  credits.textContent = language.additional
  optionsTitle.textContent = language.optionsTitle
  scoreBoard.textContent = language.hudScore + score

  btnLanguage.textContent = `${language.language}: ${currentLang}`
}

const translations = {
  EN: {
    play: "Play",
    options: "Options",
    score: "Score",
    credits: "Credits",
    back: "Back",
    language: "Language",
    color: "Color",
    sound: "Sound",
    optionsTitle: "Options",
    additional: "Create with Canvas Api",
    hudScore: "Score: ",
    hudLives: "Lives: "
  },
  ES: {
    play: "Jugar",
    options: "Opciones",
    score: "Puntuación",
    credits: "Créditos",
    back: "Volver",
    language: "Idioma",
    color: "Color",
    sound: "Sonido",
    optionsTitle: "Opciones",
    additional: "Creado con Canvas Api",
    hudScore: "Puntuación: ",
    hudLives: "Vidas: "
  },
  FR: {
    play: "Jouer",
    options: "Options",
    score: "Score",
    credits: "Crédits",
    back: "Retour",
    language: "Langue",
    color: "Couleur",
    sound: "Son",
    optionsTitle: "Options",
    additional: "Créé avec Canvas Api",
    hudScore: "Score : ",
    hudLives: "Vies : "
  }
}

// Player Object (Navecita)
const player = {
  x: canvas.width / 2 - 15,
  y: canvas.height - 30,
  width: 30,
  height: 15,
  speed: 5
}

// Shooting Star Object
const shootingStar = {
  x: 0,
  y: 0,
  speed: 0,
  active: false
}

// Boss Object
const boss = {
  active: false,
  x: canvas.width / 2 - 50,
  y: -150,
  width: 100,
  height: 60,
  speedX: 3,
  positionY: 50,
  health: 100,
  maxHealth: 100
}

// Enemy Object (Extraterrestres xd)
const enemies = []

// Bullets Object
const bullets = []

// Boss Bullets Object
const bossBullets = []

// Lives Object
const livesObj = []

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

// Starfield Effect
for (let i = 0; i < numStars; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5,
    speed: Math.random() * 2 + 0.5
  })
}

// Shoot Bullets
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
  if (boss.active) return
  const enemyWidth = 30
  enemies.push({
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0,
    width: enemyWidth,
    height: 20,
    speed: 2
  })
}

// Spawn Lives
function spawnLivesObj() {
  const lifeWidth = 15
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
      time: 30,
    })
  }
}

// Healing Effect
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

// Collision Detection AABB Algorithm
function isColliding(rect1, rect2) {
  return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
}

// Update Lives Board
function updateLivesBoard(value) {
  if (value < 0) {
    damageOverlay.classList.add('animate-flash')
    setTimeout(() => damageOverlay.classList.remove('animate-flash'), 400)
    gameContainer.classList.add('shake-effect')
    setTimeout(() => gameContainer.classList.remove('shake-effect'), 200)
  }

  lives += value
  if (lives > 5) lives = 5

  livesBoard.innerHTML = ""
  const label = document.createElement('span')
  label.textContent = translations[currentLang].hudLives
  livesBoard.appendChild(label)

  for (let i = 0; i < lives; i++) {
    const heartImg = document.createElement('img')
    heartImg.src = "heart1.png"
    heartImg.classList.add("heart-icon")
    livesBoard.appendChild(heartImg)
  }

  // Game Over
  if (lives <= 0) {
    isGameActive = false
    cancelAnimationFrame(animationId)

    clearInterval(enemyInterval)
    clearInterval(bulletInterval)
    clearInterval(livesInterval)

    setTimeout(() => damageOverlay.classList.add('animate-flash'), 1000)
    canvas.style.filter = 'grayscale(100%) blur(2px) brightness(0.5)'
    CombatMusic.currentTime = 0
    CombatMusic.pause()
    gameOverSound.play()
    setTimeout(() => {
      alert("Game Over! Your final score is: " + score)
      resetGame()
      startGame()
      //document.location.reload()
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
      damageTimer = 15
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

  // Damage timer update
  if (damageTimer > 0) {
    damageTimer--
  }

  // Move lives
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

  // Healing timer update
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
        scoreBoard.textContent = translations[currentLang].hudScore + score
        explosionSound.currentTime = 0
        explosionSound.play()
        i--
        break
      }
    }
  }

  // Explosion effect update
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

  // Starfield effect update
  stars.forEach(star => {
    star.y += star.speed
    if (star.y > canvas.height) {
      star.y = 0
      star.x = Math.random() * canvas.width
    }
  })

  // Shooting star update
  if (!shootingStar.active && Math.random() < 0.01) {
    shootingStar.active = true
    shootingStar.x += Math.random() * canvas.width
    shootingStar.y = -10
    shootingStar.speed = Math.random() * 10 + 10
  }

  if (shootingStar.active) {
    shootingStar.y += shootingStar.speed
    shootingStar.x -= shootingStar.speed / 2

    if (shootingStar.y > canvas.height || shootingStar.x < 0) {
      shootingStar.active = false
    }
  }

  // Boss activation logic update
  if (score >= 100 && !boss.active && boss.health > 0) {
    boss.active = true
  }

  if (boss.active) {
    if (boss.y < boss.positionY) {
      boss.y += 1
    } else {
      boss.x += boss.speedX
      if (boss.x <= 0 || boss.x + boss.width >= canvas.width) {
        boss.speedX *= -1
      }
    }

    // Boss Collision with Bullets
    for (let i = 0; i < bullets.length; i++) {
      if (isColliding(bullets[i], boss)) {
        boss.health -= 5
        createExplosion(bullets[i].x, bullets[i].y)
        bullets.splice(i, 1)
        i--
        hitSound.currentTime = 0
        hitSound.play()

        // Check if Boss Defeated
        if (boss.health <= 0) {
          boss.active = false
          createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2)
          explosionSound.play()
          score += 1000

          setTimeout(() => {
            alert("Winner, ganaste campeon pero... a que costo?")
            document.location.reload()
          }, 2000)
        }
      }
    }

    // Shoot Boss Bullets
    if (Math.random() < 0.03) {
      bossBullets.push({
        x: boss.x + boss.width / 2 - 5,
        y: boss.y + boss.height,
        width: 10,
        height: 20,
        speed: 6
      })
    }

    // Move Boss Bullets
    for (let i = 0; i < bossBullets.length; i++) {
      const bullet = bossBullets[i]
      bullet.y += bullet.speed
      if (isColliding(player, bullet)) {
        updateLivesBoard(-1)
        hitSound.currentTime = 0
        hitSound.play()
        bossBullets.splice(i, 1)
        i--
        continue
      }

      if (bullet.y > canvas.height) {
        bossBullets.splice(i, 1)
        i--
      }
    }
  }
}

// Heart Pixel Pattern
const heartPattern = [
  [0, 1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

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

  // Draw shooting star
  if (shootingStar.active) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(shootingStar.x, shootingStar.y)
    ctx.lineTo(shootingStar.x + 15, shootingStar.y - 25)
    ctx.stroke()
  }

  // Draw Player (Navecita)
  let gradient = ctx.createLinearGradient(0, player.y, 0, player.y + player.height)
  gradient.addColorStop(0, '#00d4ff')
  gradient.addColorStop(1, playerColor)

  ctx.fillStyle = gradient

  if (damageTimer > 0) {
    ctx.fillStyle = '#FF0000'
  } else if (healTimer > 0) {
    ctx.fillStyle = 'white'
  } else {
    ctx.fillStyle = gradient
  }

  ctx.beginPath()
  ctx.moveTo(player.x + player.width / 2, player.y)
  ctx.lineTo(player.x + player.width, player.y + player.height)
  ctx.lineTo(player.x + player.width / 2, player.y + player.height - 5)
  ctx.lineTo(player.x, player.y + player.height)
  ctx.closePath()
  ctx.fill()

  // Draw bullets
  ctx.fillStyle = '#FF0000'
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
  })

  // Draw enemies
  enemies.forEach(enemy => {
    let gradientEnemy = ctx.createLinearGradient(enemy.x, enemy.y, enemy.x, enemy.y + enemy.height)
    gradientEnemy.addColorStop(0, '#2ecc71')
    gradientEnemy.addColorStop(1, '#145a32')

    ctx.fillStyle = gradientEnemy

    // Draw body
    ctx.beginPath()
    ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, Math.PI, 0)
    ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height - 5)
    ctx.lineTo(enemy.x, enemy.y + enemy.height - 5)
    ctx.fill()

    ctx.strokeStyle = '#145a32'
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw eyes
    ctx.fillStyle = 'white'
    ctx.fillRect(enemy.x + enemy.width * 0.25, enemy.y + enemy.height * 0.3, 3, 3)
    ctx.fillRect(enemy.x + enemy.width * 0.65, enemy.y + enemy.height * 0.3, 3, 3)

    // Draw tentacles
    ctx.fillStyle = enemy.color || '#1e924e'
    let legOffset = Math.sin(Date.now() / 100) * 3

    ctx.fillRect(enemy.x + 2, enemy.y + enemy.height - 3, 6, 5 + legOffset)
    ctx.fillRect(enemy.x + enemy.width / 2 - 3, enemy.y + enemy.height - 3, 6, 5 - legOffset)
    ctx.fillRect(enemy.x + enemy.width - 8, enemy.y + enemy.height - 3, 6, 5 + legOffset)

    // visual collision box (for testing)
    //ctx.fillStyle = '#ff545463'
    //ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  })

  // Draw lives objects
  ctx.fillStyle = '#e63946'
  livesObj.forEach(live => {
    const size = 2
    for (let row = 0; row < heartPattern.length; row++) {
      for (let col = 0; col < heartPattern[row].length; col++) {
        if (heartPattern[row][col] === 1) {
          ctx.fillRect(live.x + col * size, live.y + row * size, size, size)
        }
      }
    }
    // Collision box (for testing)
    //ctx.fillStyle = 'rgba(147, 216, 243, 0.35)'
    //ctx.fillRect(live.x, live.y, live.width, live.height)
  })

  // Draw boss
  if (boss.active) {

    ctx.fillStyle = '#8e44ad'
    ctx.shadowBlur = 10
    ctx.shadowColor = '#e056fd'

    // Body
    ctx.beginPath()
    ctx.moveTo(boss.x, boss.y)
    ctx.lineTo(boss.x + boss.width, boss.y)
    ctx.lineTo(boss.x + boss.width - 10, boss.y + boss.height)
    ctx.lineTo(boss.x + 10, boss.y + boss.height)
    ctx.closePath()
    ctx.fill()
    ctx.shadowBlur = 0

    // hands
    ctx.fillStyle = '#8e44ad'
    ctx.fillRect(boss.x - 15, boss.y + 10, 20, 10)
    ctx.fillRect(boss.x + boss.width - 5, boss.y + 10, 20, 10)
    ctx.fillRect(boss.x - 50, boss.y + boss.height / 2 - 4, 200, 15)

    // Mouth
    ctx.fillStyle = '#404240'
    ctx.beginPath()
    ctx.arc(boss.x + boss.width / 2, boss.y + boss.height, boss.width / 6, Math.PI, 0)
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.fill()

    // Eyes
    ctx.fillStyle = '#fff018'
    ctx.shadowBlur = 5
    ctx.shadowColor = '#fff018'
    ctx.fillRect(boss.x + 20, boss.y + 20, 15, 10)
    ctx.fillRect(boss.x + boss.width - 35, boss.y + 20, 15, 10)
    ctx.shadowBlur = 0

    // Collision box (for testing)
    //ctx.fillStyle = "#be5f5fb9"
    //ctx.fillRect(boss.x, boss.y, boss.width, boss.height)

    // bullets
    ctx.shadowBlur = 10
    ctx.shadowColor = 'rgb(255, 17, 108)'
    ctx.fillStyle = 'purple'
    bossBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
    })
    ctx.shadowBlur = 0

    // Draw boss health bar
    const barWidth = 200
    const barHeight = 10
    const barX = (canvas.width - barWidth) / 2
    const barY = 20
    const healthPercent = boss.health / boss.maxHealth

    ctx.fillStyle = '#555'
    ctx.fillRect(barX, barY, barWidth, barHeight)
    ctx.fillStyle = '#e74c3c'
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight)

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barWidth, barHeight)

    ctx.fillStyle = 'white'
    ctx.font = '10px Arial'
    ctx.fillText(`Eres un manco: ${boss.health} / ${boss.maxHealth}`, barX + 50, barY + 8)
  }

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

// Game Loop
function gameLoop() {
  if (!isGameActive) return
  update()
  draw()

  animationId = requestAnimationFrame(gameLoop)
}

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