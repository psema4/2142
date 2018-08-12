// game.js

var TOFE = {
  state: 'init'
}

let loop = null

let isDisplayInitialized = false
let spaceTime = new SpaceTime({ timeMultiplier: 1 })

let player = null

let numStars = 50 + Math.floor(Math.random() * 50)
let numNPCs = 10 + Math.floor(Math.random() * 10)
let numPowerups = 5 + Math.floor(Math.random() * 5)
let numPlanets = 6

let npcs = []
let powerups = []
let stars = []
let planets = []

let activePlanet = null

function initializeKontra() {
  setCanvasSize()

  kontra.init(document.querySelector('canvas'))
}

function initializeGame() {
  let artifacts = [ 'Time Controller', 'Space Controller', 'Mind Controller' ]

  npcs = []
  powerups = []
  stars = []
  planets = []
  player = createPlayer()
  createStars()
  createNPCs()
  createPowerups()
  createPlanets()

  while (artifacts.length) {
    let planetNumber = (Math.floor(Math.random() * planets.length-1)) + 1

    if (planetNumber > 0 && !planets[planetNumber].artifact)
      planets[planetNumber].artifact = artifacts.pop()
  }

  let isPressed = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    enter: false,
    i: false,
    l: false,
    p: false,
  }

  // MAIN LOOP
  if (!loop) {
    loop = kontra.gameLoop({
      update: function() {
        if (TOFE.state == 'win' || TOFE.state == 'loose') {
          if (kontra.keys.pressed('enter')) {
            initializeGame()
          }

        } else if (TOFE.state != 'playing') {
          // FIXME: debounce
          if (!isPressed.enter && kontra.keys.pressed('enter')) {
            isPressed.enter = true

            if (TOFE.state == 'firstLoad')
              TOFE.state = 'story1'

            else if (TOFE.state == 'story1')
              TOFE.state = 'instructions'

            else if (TOFE.state == 'instructions' || TOFE.state == 'menu')
              TOFE.state = 'playing'

          } else {
            isPressed.enter = false
          }
        }

        if (TOFE.state != 'playing')
          return

        if (player._artifacts.length == 3)
          win()

        if (player.hull <= 0 || player.air <= 0 || player.water <= 0 || player.food <= 0 || player.fuel <= 0)
          loose()

        if (spaceTime.timeMultiplier != 0)
          spaceTime.tick()

        // KEYBOARD
        if (spaceTime.timeMultiplier == 0) {
          // special keys for when time is stopped

          // l: launch
          if (kontra.keys.pressed('l')) {
            isPressed.l = true
            spaceTime.timeMultiplier = 1
            activePlanet = null

          } else {
            isPressed.l = false
          }

          // i: investigate
          if (kontra.keys.pressed('i')) {
            isPressed.i = true
            console.log('searching...')

            if (!activePlanet.artifact)
              return

            var v = Math.floor(Math.random() * 100)

            if (activePlanet.artifact && v >= 95) {
              player.addArtifact(activePlanet.artifact)
              activePlanet.artifact = null
              console.log('discovery! you found an artifact')
              playerStats()
            }

          } else {
            isPressed.i = false
          }

        } else {
          // normal keys when playing (and time moving forward)
          if (spaceTime.timeDirection > 0) {
            if (kontra.keys.pressed('left')) {
              if (!isPressed.left) {
                isPressed.left = true
                player.speed -= 1
              }

            } else {
              isPressed.left = false
            }

            if (kontra.keys.pressed('right')) {
              if (!isPressed.right) {
                isPressed.right = true
                player.speed += 1
              }

            } else {
              isPressed.right = false
            }

            if (kontra.keys.pressed('up')) {
              if (!isPressed.up) {
                isPressed.up = true
                player.sprite.dy -= 1
              }

            } else {
              isPressed.up = false
            }

            if (kontra.keys.pressed('down')) {
              if (!isPressed.down) {
                isPressed.down = true
                player.sprite.dy += 1
              }

            } else {
              isPressed.down = false
            }

            if (!isPressed.p && kontra.keys.pressed('p')) {
              isPressed.p = true
              pause()

            } else {
              isPressed.p = false
            }

            if (kontra.keys.pressed('space')) {
              if (player.hasArtifact('Time Controller'))
                rewindTo(spaceTime.time - 500)
            }
          }
        }

        // UPDATE SPRITES
        if (spaceTime.timeMultiplier != 0 && player && player.sprite) {
          player.sprite.update()
          
          let items = [stars, npcs, powerups, planets]
          items.forEach((i, idx) => {
            i.forEach((s) => {
              if (s.x && s.x < -2048) {
                s.x = 2048
              }

              if (s.x && s.x > 2048) {
                s.x = -2048
              }

              if (s.sprite && s.sprite.x < -2048) {
                s.sprite.x = 2048
              }

              if (s.sprite && s.sprite.x > 2048) {
                s.sprite.x = -2048
              }

              if (s.update) s.update()
              if (s.sprite) s.sprite.update()
            
              // COLLISIONS
              if (s.onCollideWithPlayer)
                if (s.sprite.collidesWith(player.sprite))
                  s.onCollideWithPlayer()

                if (s.sprite && s.sprite.collidesWith(player.sprite))
                  s.onCollideWithPlayer()

              if (s.collidesWith && s.collidesWith(planets[0]))
                s.destroy()

              if (s.sprite && s.sprite.collidesWith(planets[0])) {
                if (s.destroy) s.destroy()
                if (s.sprite && s.sprite.destroy) s.sprite.destroy()
              }
            })
          })
        }
      },

      render: function() {
        if (TOFE.state == 'firstLoad')
          firstLoadScreen()

        if (TOFE.state == 'story1')
          storyScreen(1)

        if (TOFE.state == 'instructions')
          instructionsScreen()

        if (TOFE.state == 'menu')
          menuScreen()

        if (TOFE.state == 'win')
          winScreen()

        if (TOFE.state == 'loose')
          looseScreen()

        if (TOFE.state != 'playing')
          return

        player.sprite.render()
        let items = [stars, npcs, powerups, planets]
        items.forEach((i) => {
          i.forEach((s) => {
            if (s.isActive) {
              if (s.render)
                s.render()

              if (s.sprite)
                s.sprite.render()
            }
          })
        })
      }
    })
  }

  firstLoad()

  if (loop.isStopped)
    loop.start()
}

// CREATE ALL THE THINGS
function createPlayer() {
  return new Player()
}

function createStars() {
  for (let i = 0; i < numStars; i++) {
    let starSize = Math.floor(Math.random() * 2) + 1
    let startX = Math.floor(Math.random() * 4096) - 2048
    let startY = Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = Math.floor(Math.random() * 2) + 1

    stars.push(
      kontra.sprite({
        x: startX,
        y: startY,
        color: '#FFFFFF',
        width: starSize,
        height: starSize,
        dx: /* TOFE.state === 'playing' && */ -1 * startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
        speed: startSpeed,
        isActive: true
      })
    )
  }
}

function createNPCs() {
  for (let i = 0; i < numNPCs; i++) {
    let size = 10
    let startX = Math.floor(Math.random() * 4096) - 2048
    let startY = Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = Math.floor(Math.random() * 2) + 1

    npcs.push(new NPC({ startX, startY, size, startSpeed, color: '#FF0000', active: true }))
  }
}

function createPowerups() {
  let types = [ 'air', 'water', 'food', 'fuel' ]

  for (let i = 0; i < numPowerups; i++) {
    let size = 5
    let startX = Math.floor(Math.random() * 4096) - 2048
    let startY = Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = Math.floor(Math.random() * 2) + 1
    let type = types[Math.floor(Math.random() * types.length)]
    let value = Math.floor(Math.random() * 9) + 1

    powerups.push(new Powerup({ size, startX, startY, startSpeed, type, value, color: '#0000FF', active: true }))
  }
}

function createPlanets() {
  for (let i = 0; i < numPlanets; i++) {
    let radius = i == 0 ? 1000 : Math.floor(Math.random() * 40) + 10
    let startX = i == 0 ? player.sprite.x : Math.floor(Math.random() * 4096) - 2048
    let startY = i == 0 ? -950 : Math.floor(Math.random() * (kontra.canvas.height - 200)) + 200
    let startSpeed = i == 0 ? 0 : 1
    let name = i == 0 ? 'Black Hole': 'Planet ' + i
    let color = i == 0 ? '#FFFFFF' : randomRGB()

    planets.push(new Planet({ radius, startX, startY, startSpeed, name, color, active: true }))
  }
}

// BROWSER EVENTS
window.addEventListener('resize', setCanvasSize)
document.querySelector('.scr_start').addEventListener('click', focusCanvas)

// UTILITY
function splashScreen() {
  setCanvasSize()

  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 60
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('Click to Start!', cx + 50, cy)
  }
}

// FIXME: move to more appropriate line number
splashScreen()

function firstLoadScreen() {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('First Load', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Continue', cx + 100, cy + 60)
  }
}

function storyScreen(storyNumber) {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('Story', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Continue', cx + 100, cy + 60)
  }
}

function instructionsScreen() {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('Instructions', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Play', cx + 100, cy + 60)
  }
}

function menuScreen() {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('Menu', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Play', cx + 100, cy + 60)
  }
}

function winScreen() {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('You Win!', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Play Again', cx + 100, cy + 60)
  }
}

function looseScreen() {
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2) - 60

    ctx.fillText('You Loose!', cx + 50, cy)
    ctx.fillText('<Enter>', cx, cy + 60)
    ctx.fillText('Play Again', cx + 100, cy + 60)
  }
}

function setCanvasSize() {
  let canvas = document.querySelector('canvas')
  canvas.width = screen.availWidth
  canvas.height = screen.availHeight
  isDisplayInitialized = true
}

function focusCanvas(evt) {
  let scrStart = document.querySelector('.scr_start')
  scrStart.removeEventListener('click', focusCanvas)
  scrStart.style.display = 'none'

  evt.preventDefault()
  evt.stopPropagation()
  
  evt.target.requestFullscreen()
  document.querySelector('canvas').style.border = '0px solid #000'

  initializeKontra()
  initializeGame()
}

function pause() {
  if (TOFE.state === 'playing')
    TOFE.state = 'menu'

  else
    TOFE.state = 'playing'
}

function setTimeMultiplier(v, reverse = false) {
  spaceTime.timeMultiplier = v
  this.timeDirection = reverse
}

function rewindTo(t) {
  if (spaceTime.timeDirection < 0 || !t || t >= spaceTime.time)
    return

  if (t < 0)
    t = 0

  spaceTime.targetTime = t
  spaceTime.timeDirection = -1
}

function randomRGB() {
  let chars = "0123456789ABCDEF".split('')
  let numbers = []

  for (let i=0; i < 6; i++)
    numbers.push(Math.floor(Math.random() * 16))

  return "#" + numbers.join('')
}

function findArtifacts() {
  let hasArtifacts = planets.filter((p) => { return p.artifact })
  let data = hasArtifacts.map((p) => { return { name: p.sprite.name, artifact: p.artifact } })

  return data
}

function playerStats() {
  console.log(`Hull: ${player.hull}, Air: ${player.air}, Water: ${player.water}, Food: ${player.food}, Fuel: ${player.fuel}`)
  console.log(`Artifacts:`, player._artifacts)
  console.log('Remaining Artifacts:', findArtifacts())
}

function cleanup() {
  player = null
  stars = []
  npcs = []
  powerups = []
}

function firstLoad() {
  TOFE.state = 'firstLoad'
  firstLoadScreen()
}

function story(page) {
  TOFE.state = 'story' + page
  storyScreen(page)
}

function instructions() {
  TOFE.state = 'instructions'
  instructionsScreen()
}

function menu() {
  TOFE.state = 'menu'
  menuScreen()
}

function win() {
  planets.forEach((p) => { p.isActive = false })
  powerups.forEach((p) => { p.isActive = false })
  npcs.forEach((n) => { n.isActive = false })

  TOFE.state = 'win'
  winScreen()
  cleanup()
}

function loose() {
  planets.forEach((p) => { p.isActive = false })
  powerups.forEach((p) => { p.isActive = false })
  npcs.forEach((n) => { n.isActive = false })

  TOFE.state = 'loose'
  looseScreen()
  cleanup()
}