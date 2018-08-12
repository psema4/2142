// game.js

var TOFE = {
  state: 'init'
};

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
let artifacts = [ 'Time Controller', 'Space Controller', 'Mind Controller' ]

function initializeKontra() {
  setCanvasSize();

  kontra.init(document.querySelector('canvas'))

  player = createPlayer()
  createStars()
  createNPCs()
  createPowerups()
  createPlanets()
  while (artifacts.length) {
    let planetNumber = (Math.floor(Math.random() * planets.length-1)) + 1

    if (planetNumber > 0 && !planets[planetNumber].artifact)
      planets[planetNumber].artifact = artifacts.pop();
  }

  kontra.keys.bind(['enter', 'space'], function() {
    rewindTo(spaceTime.time - 500)
  });

  let isPressed = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    enter: false,
  }

  // MAIN LOOP
  let loop = kontra.gameLoop({
    update: function() {
      if (spaceTime.timeMultiplier != 0)
        spaceTime.tick()

      // KEYBOARD
      if (spaceTime.timeMultiplier == 0) {
        // special keys for when time is stopped

        // l: launch
        if (kontra.keys.pressed('l')) {
          spaceTime.timeMultiplier = 1
          activePlanet = null;
        }

        // i: investigate
        if (kontra.keys.pressed('i')) {
          console.log('searching...')
          var v = Math.floor(Math.random() * 100)

          if (activePlanet.artifact && v >= 95) {

            player.addArtifact(activePlanet.artifact)
            activePlanet.artifact = null;
            console.log('discovery! you found an artifact')
          }
        }

      } else {
        // normal keys when playing (and time moving forward)
        if (spaceTime.timeDirection > 0) {
          if (kontra.keys.pressed('left')) {
            if (!isPressed.left) {
              isPressed.left = true;
              player.speed -= 1
            }

          } else {
            isPressed.left = false;
          }

          if (kontra.keys.pressed('right')) {
            if (!isPressed.right) {
              isPressed.right = true;
              player.speed += 1
            }

          } else {
            isPressed.right = false;
          }

          if (kontra.keys.pressed('up')) {
            if (!isPressed.up) {
              isPressed.up = true;
              player.sprite.dy -= 1;
            }

          } else {
            isPressed.up = false;
          }

          if (kontra.keys.pressed('down')) {
            if (!isPressed.down) {
              isPressed.down = true;
              player.sprite.dy += 1;
            }

          } else {
            isPressed.down = false;
          }
        }
      }

      // UPDATE SPRITES
      if (spaceTime.timeMultiplier != 0) {
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

  TOFE.state = 'playing'
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
window.addEventListener('resize', setCanvasSize);
document.querySelector('.scr_start').addEventListener('click', focusCanvas)

// UTILITY
function splashScreen() {
  setCanvasSize()
  let canvas = document.querySelector('canvas')
  let ctx = canvas.getContext('2d')

  if (ctx) {
    ctx.fillStyle = '#ff0000'
    ctx.font = '24px sans-serif'

    let cx = (Math.floor(canvas.width) / 2) - 40
    let cy = (Math.floor(canvas.height) / 2)

    ctx.fillText('Click to Start!', cx, cy)
  }
}

splashScreen()

function setCanvasSize() {
  let canvas = document.querySelector('canvas')
  canvas.width = screen.availWidth
  canvas.height = screen.availHeight
  isDisplayInitialized = true
}

function focusCanvas(evt) {
  let scrStart = document.querySelector('.scr_start')
  scrStart.removeEventListener('click', focusCanvas)
  scrStart.style.display = 'none';

  evt.preventDefault();
  evt.stopPropagation();
  
  evt.target.requestFullscreen()
  document.querySelector('canvas').style.border = '0px solid #000';

  initializeKontra()
}

function pause() {
  if (TOFE.state === 'playing')
    TOFE.state = 'paused'

  else
    TOFE.state = 'playing'
}

function setTimeMultiplier(v, reverse = false) {
  spaceTime.timeMultiplier = v;
  this.timeDirection = reverse
}

function rewindTo(t) {
  if (spaceTime.timeDirection < 0 || !t || t >= spaceTime.time)
    return

  if (t < 0)
    t = 0

  spaceTime.targetTime = t;
  spaceTime.timeDirection = -1;
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