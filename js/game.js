// game.js

var TOFE = {
  state: 'init'
};

let isDisplayInitialized = false
let spaceTime = new SpaceTime({ timeMultiplier: 1 })

let player = null

let numStars = 50 + Math.floor(Math.random() * 50)
let numNPCs = 0 + Math.floor(Math.random() * 10)
let numPowerups = 5 + Math.floor(Math.random() * 5)
let numPlanets = 6

let npcs = []
let powerups = []
let stars = []
let planets = []

function initializeKontra() {
  setCanvasSize();

  kontra.init(document.querySelector('canvas'))

  player = createPlayer()
  createStars()
  createNPCs()
  createPowerups()
  createPlanets()

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

  let loop = kontra.gameLoop({
    update: function() {
      spaceTime.tick()

      // KEYBOARD
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

      // UPDATE SPRITES
      player.sprite.update()
      
      let items = [stars, npcs, powerups, planets]
      items.forEach((i, idx) => {
        i.forEach((s) => {
          if (s.x < -2048) {
            s.x = 2048
          }

          if (s.x > 2048) {
            s.x = -2048
          }

          s.update()

          // COLLISIONS
          if (s.onCollideWithPlayer)
            if (s.collidesWith(player.sprite))
              s.onCollideWithPlayer()
        })
      })
    },

    render: function() {
      player.sprite.render()
      let items = [stars, npcs, powerups, planets]
      items.forEach((i) => {
        i.forEach((s) => { s.render() })
      })
    }
  })

  TOFE.state = 'playing'
  loop.start()
}

function createPlayer() {
  return new Player()
}

function createStars() {
  for (let i =0; i < numStars; i++) {
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
        speed: startSpeed
      })
    )
  }
}

function createNPCs() {
  for (let i =0; i < numNPCs; i++) {
    let size = 10
    let startX = Math.floor(Math.random() * 4096) - 2048
    let startY = Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = Math.floor(Math.random() * 2) + 1

    npcs.push(
      kontra.sprite({
        x: startX,
        y: startY,
        color: '#FF0000',
        width: size,
        height: size,
        dx: /* TOFE.state === 'playing' && */ -1 * startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
        speed: startSpeed,
        onCollideWithPlayer: function() { console.log('collideWithPlayer') },
      })
    )
  }
}

function createPowerups() {
  for (let i =0; i < numPowerups; i++) {
    let size = 5
    let startX = Math.floor(Math.random() * 4096) - 2048
    let startY = Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = Math.floor(Math.random() * 2) + 1

    powerups.push(
      kontra.sprite({
        x: startX,
        y: startY,
        color: '#0000FF',
        width: size,
        height: size,
        dx: /* TOFE.state === 'playing' && */ -1 * startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
        speed: startSpeed,
        onCollideWithPlayer: function() { console.log('collideWithPlayer') },
      })
    )
  }
}

function createPlanets() {
  for (let i = 0; i < numPlanets; i++) {
    let radius = Math.floor(Math.random() * 40) + 10
    let startX = i == 0 ? player.sprite.x : Math.floor(Math.random() * 4096) - 2048
    let startY = i == 0 ? 0 : Math.floor(Math.random() * kontra.canvas.height)
    let startSpeed = 1

    planets.push(
      new kontra.sprite({
        x: startX,
        y: startY,
        color: randomRGB(),
        dx: /* TOFE.state === 'playing' && */ -1 * startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
        speed: startSpeed,
        radius: radius,
        onCollideWithPlayer: function() { console.log('Player hit planet!') },
        render: function() {
          this.context.fillStyle = this.color;

          this.context.beginPath();
          this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          this.context.fill();
        },
      })
    )
  }
}

window.addEventListener('resize', setCanvasSize);
document.querySelector('.scr_start').addEventListener('click', focusCanvas)

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