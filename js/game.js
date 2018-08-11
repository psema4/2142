// game.js

var TOFE = {
  state: 'init'
};

let isDisplayInitialized = false
let spaceTime = new SpaceTime({ timeMultiplier: 10 })
let playerSprite = null
let numStars = 50 + Math.floor(Math.random() * 50)
let stars = []

function initializeKontra() {
  setCanvasSize();

  kontra.init(document.querySelector('canvas'))

  playerSprite = createPlayer()
  createStars()

  let loop = kontra.gameLoop({
    update: function() {
      playerSprite.update()
      
      stars.forEach((s) => {
        s.update()
        
        if (s.x < -2048) {
          s.x = 2048
        }

        if (s.x > 2048) {
          s.x = -2048
        }
      })
    },

    render: function() {
      playerSprite.render()
      stars.forEach((s) => { s.render() })
    }
  })

  TOFE.state = 'playing'
  loop.start()
}

function createPlayer() {
  return kontra.sprite({
    x: Math.floor(kontra.canvas.width / 2) - 20,
    y: Math.floor(kontra.canvas.height / 2) - 10,
    color: '#00DD00',
    width: 40,
    height: 20,
    dx: 0
  })
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
        dx: /* TOFE.state === 'playing' && */ startSpeed * spaceTime.timeMultiplier,
        speed: startSpeed
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
  spaceTime.timeMultiplier = reverse ? -1*v : v
}

function flipAndBurn() {
  if (spaceTime.timeDirection == -1 && spaceTime.timeMultiplier > -10) {
    spaceTime.timeMultiplier -= 1
    setTimeout(flipAndBurn, 500)
    return

  } else if (spaceTime.timeDirection == 1 && spaceTime.timeMultiplier < 10) {
    spaceTime.timeMultiplier += 1
    setTimeout(flipAndBurn, 250)
    return
 
  } else if (spaceTime.timeDirection == 1) {
    spaceTime.timeDirection = -1
    setTimeout(flipAndBurn, 250)
    return
 
  } else if (spaceTime.timeDirection == -1) {
    spaceTime.timeDirection = 1
    setTimeout(flipAndBurn, 250)
    return
  }
}