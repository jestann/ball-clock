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
  const interval = (height - 2*ballHeight) / numTracks
  let tracks = []
  for (let i=0; i<numTracks; i++) {
    let startX = (i%2===0) ? width : 0
    let endX = (startX===0) ? width : 0
    let track = new Track(i, startX, ballHeight+interval*i, endX, ballHeight+interval*(i+1))
    tracks.push(track)
  }
  return tracks
}

class Ball {
  constructor(number, color=null) {
    this.number = number
    this.color = color // null gives it default color
    this.radius = 20
    this.x = 0
    this.y = 0
    this.dX = 0
    this.dY = 0
    this.track = null
    this.timeDelay = null
    this.moving = false
  }
  
  setTrack(track) {
    this.track = track.number
    this.x = track.startX - this.radius
    this.y = track.startY - this.radius
    this.dX = 4
    this.dY = this.dX*track.slope
  }
  
  setTimeDelay(delay) {
    this.timeDelay = delay
  }
  
  start () {
    this.moving = true
  }
  
  stop () {
    this.moving = false
  }
}

const makeBalls = (number) => {
  let balls = []
  for (let i = 0; i < number; i++) {
    // let color = `rgb(${Math.rand() * 255}, ${Math.rand()*255}, ${Math.rand()*255})`
    let ball = new Ball(i+1)
    ball.setTimeDelay(i*1000)
    balls.push(ball)
  }
  return balls
}

const setTracks = (balls, track) => {
  balls.forEach((ball) => { 
    ball.setTrack(track) 
  })
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

const drawBall = (canvas, ball) => {
  if (!ball.moving) { return }
  canvas.save()
  canvas.beginPath()
  const gradient = canvas.createRadialGradient(ball.x, ball.y, 5, ball.x-5, ball.y-5, ball.radius)
  gradient.addColorStop(0, '#444')
  gradient.addColorStop(1, '#222')
  canvas.fillStyle = gradient
  canvas.arc(ball.x, ball.y, ball.radius, 0+ball.x/ball.radius, 2*Math.PI+ball.x/ball.radius, false)
  canvas.lineTo(ball.x, ball.y)
  canvas.fill()
  canvas.lineWidth = '5'
  canvas.lineCap = 'round'
  canvas.strokeStyle = '#222'
  canvas.stroke()
  canvas.restore()
  
  if (ball.x < 0 + ball.radius - 16 || ball.x > field.width - ball.radius + 16) { 
    ball.dX = -ball.dX
  }
  if (ball.y < 0 + ball.radius || ball.y > field.height - ball.radius) { ball.dY = ball.dX = 0 }
  ball.x += ball.dX
  ball.y += ball.dY
}

const drawBalls = (canvas, balls) => {
  balls.forEach((ball) => { drawBall(canvas, ball) })
}

const addBall = (balls, index) => {
  if (balls[index]) { balls[index].start() }
}

// make canvas
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

// make other UI stuff
let animate = null
const start = document.getElementById('start')
start.addEventListener('click', () => {
  animate = setInterval(render, 25)
})

const refresh = document.getElementById('refresh')
refresh.addEventListener('click', () => {
  clearInterval(animate)
})

const whichBall = 0
const add = document.getElementById('add')
add.addEventListener('click', () => {
  addBall(balls, whichBall)
  whichBall++
})