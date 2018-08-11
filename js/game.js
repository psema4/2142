// game.js

setCanvasSize();
var TOFE = {
  state: 'init'
};

function playGame() {
  kontra.init();

  let player = kontra.sprite({
    x: Math.floor(kontra.canvas.width / 2) - 20,
    y: Math.floor(kontra.canvas.height / 2) - 10,
    color: '#00DD00',
    width: 40,
    height: 20,
    dx: 0
  })

  let numSprites = 50 + Math.floor(Math.random() * 50)
  let sprites = []

  for (let i =0; i < numSprites; i++) {
    sprites.push(
      kontra.sprite({
        x: Math.floor(Math.random() * 4096) - 2048,
        y: Math.floor(Math.random() * kontra.canvas.height),
        color: '#FF0000',
        width: 10,
        height: 10,
        dx: /* TOFE.state === 'playing' && */ (-1 * (Math.floor(Math.random() * 2) + 1)),
      })
    )
  }

  let loop = kontra.gameLoop({
    update: function() {
      player.update()
      
      sprites.forEach((s) => {
        s.update()
        
        if (s.x < -2048) {
          s.x = 2048
        }
      })
    },

    render: function() {
      player.render()
      
      sprites.forEach((s) => { s.render() })
    }
  })

  TOFE.state = 'playing'
  loop.start()
}

window.addEventListener('resize', setCanvasSize);
document.querySelector('canvas').addEventListener('click', focusCanvas)

function setCanvasSize() {
  let canvas = document.querySelector('canvas')
  canvas.width = screen.availWidth
  canvas.height = screen.availHeight
}

function focusCanvas(evt) {
  document.querySelector('canvas').removeEventListener('click', focusCanvas)

  evt.preventDefault();
  evt.stopPropagation();
  
  evt.target.requestFullscreen()
  playGame()
  //setTimeout(pause, 0)
}

function pause() {
  if (TOFE.state === 'playing')
    TOFE.state = 'paused'
  else
    TOFE.state = 'playing'
}
