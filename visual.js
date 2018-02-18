/* --------- TRACKS ----------- */

class Track {
  constructor(number, startX, startY, endX, endY) {
    this.number = number
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.rise = this.endY - this.startY
    this.run = this.endX - this.startX
    this.slope = this.rise/this.run
  }
}

const makeTracks = (width, height, ballRadius, numTracks=4) => {
  const ballHeight = ballRadius*2 + 10
  const interval = (height - ballHeight - 10) / numTracks
  let tracks = []
  for (let i=0; i<numTracks; i++) {
    let startX = (i%2===0) ? width : 0
    let endX = (startX===0) ? width : 0
    let track = new Track(i, startX, ballHeight+interval*i, endX, ballHeight+interval*(i+1))
    tracks.push(track)
  }
  return tracks
}

const drawTrack = (canvas, track) => {
  canvas.beginPath()
  canvas.moveTo(track.startX, track.startY)
  canvas.lineTo(track.endX, track.endY)
  canvas.lineWidth = '10'
  canvas.lineCap = 'round'
  canvas.strokeStyle = '#444'
  canvas.stroke()
}

const drawTracks = (canvas, tracks) => {
  canvas.save()
  tracks.forEach((track) => { drawTrack(canvas, track) })
  canvas.restore()
}


/* --------- BALLS ----------- */

class Ball {
  constructor(number, color0='#444', color1='#222') {
    this.number = number
    this.color0 = color0
    this.color1 = color1
    this.radius = 20
    this.x = 0
    this.y = 0
    this.dX = 0
    this.dY = 0
    this.track = null
    this.live = false
    this.moving = false
  }
  
  setTrack(track) {
    this.track = track.number
    this.x = track.startX - this.radius
    this.y = track.startY - this.radius
    this.dY = .25
    this.dX = this.dY*(1/track.slope)
  }

  start () {
    this.moving = true
  }
  
  stop () {
    this.moving = false
  }
  
  makeLive () {
    this.live = true
    this.start()
  }
}

const makeColor = () => {
  let red = Math.floor(Math.random()*255)
  let green = Math.floor(Math.random()*255)
  let blue = Math.floor(Math.random()*255)
  const color = `rgb(${red}, ${green}, ${blue})`
  return color
}

const makeBalls = (number) => {
  let balls = []
  for (let i = 0; i < number; i++) {
    let color0 = makeColor()
    let color1 = makeColor()
    let ball = new Ball(i+1, color0, color1)
    balls.push(ball)
  }
  return balls
}

const setTracks = (balls, track) => {
  balls.forEach((ball) => { 
    ball.setTrack(track) 
  })
}

const drawBall = (canvas, ball) => {
  if (!ball.live) { return }
  canvas.save()
  canvas.beginPath()
  const gradient = canvas.createRadialGradient(ball.x, ball.y, 5, ball.x-5, ball.y-5, ball.radius)
  gradient.addColorStop(0, ball.color0)
  gradient.addColorStop(1, ball.color1)
  canvas.fillStyle = gradient
  canvas.arc(ball.x, ball.y, ball.radius, 0+ball.x/ball.radius, 2*Math.PI+ball.x/ball.radius, false)
  canvas.lineTo(ball.x, ball.y)
  canvas.fill()
  canvas.lineWidth = '5'
  canvas.lineCap = 'round'
  canvas.strokeStyle = ball.color1
  canvas.stroke()
  canvas.restore()
  
  if (ball.x < 0 + ball.radius - 16 || ball.x > field.width - ball.radius + 16) { 
    ball.dX = -ball.dX
  }
  if (ball.y < 0 + ball.radius || ball.y > field.height - ball.radius) { ball.stop() }
  
  if (ball.moving) { 
    ball.x += ball.dX
    ball.y += ball.dY
  }
}

const drawBalls = (canvas, balls) => {
  balls.forEach((ball) => { 
    drawBall(canvas, ball) 
  })
}

const addBall = (balls, index) => {
  if (balls[index]) { balls[index].makeLive() }
}



/* --------- RENDERING ----------- */

const field = document.getElementById('canvas')
field.width = 700 /* window.innerWidth */
field.height = 450 /* window.innerHeight */
const canvas = field.getContext('2d')

const balls = makeBalls(4)
const tracks = makeTracks(field.width, field.height, balls[0].radius)
setTracks(balls, tracks[0])

const render = () => {
  canvas.beginPath()
  canvas.clearRect(0, 0, field.width, field.height)
  
  drawTracks(canvas, tracks)
  drawBalls(canvas, balls)
}



/* --------- BUTTON HANDLERS ----------- */

let animate = null
const start = document.getElementById('start')
start.addEventListener('click', () => {
  animate = setInterval(render, 25)
})

const stop = document.getElementById('stop')
stop.addEventListener('click', () => {
  clearInterval(animate)
})

let whichBall = 0
const add = document.getElementById('add')
add.addEventListener('click', () => {
  addBall(balls, whichBall)
  whichBall++
})