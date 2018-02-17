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
  const ballHeight = ballRadius + 10
  const interval = height - 2*ballHeight
  let tracks = []
  for (let i=0; i<numTracks; i++) {
    startX = (i%2===0) ? 0 : width
    endX = (startX===0) ? width : 0
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
    this.dX = 2
    this.dY = 2
    this.track = null
  }
  
  setTrack(track) {
    this.track = track.number
    this.x = track.startX - ball.radius
    this.y = track.startY - ball.radius
    ball.dX = 2
    ball.dY = 2*this.slope
  }
}

const makeBalls = (number) => {
  let balls = []
  for (let i = 1; i <= number; i++) {
    // let color = `rgb(${Math.rand() * 255}, ${Math.rand()*255}, ${Math.rand()*255})`
    let ball = new Ball(i)
    
    balls.push(ball);
  }
  return balls
}


const field = document.getElementById('canvas')
field.width = 700 /* window.innerWidth */
field.height = 450 /* window.innerHeight */
const canvas = field.getContext('2d')

const ball = new Ball(1)

const drawLine = (track) => {
  canvas.beginPath()
  canvas.moveTo(track.startX, track.startY)
  canvas.lineTo(track.endX, track.endY)
  canvas.lineWidth = '10'
  canvas.lineCap = 'round'
  // const lin = createLinearGradient(0,0,field.width, field.height)
  // lin.addColorStop(0, '#777')
  // lin.addColorStop(1, '#555')
  // canvas.fillStyle = lin
  canvas.strokeStyle = '#444'
  canvas.stroke()
}

const drawLines = (tracks) => {
  canvas.save()
  tracks.forEach((track) => { drawLine(track) })
  canvas.restore()
}

const render = () => {
  canvas.beginPath()
  canvas.clearRect(0, 0, field.width, field.height)
  
  drawLines(tracks)

  // render ball
  canvas.save()
  // ball.dY = ball.dX*tracks[ball.track-1].slope
  canvas.beginPath()
  // canvas.translate(point.x+ball.radius,point.y-11);
  // canvas.rotate(Math.PI/20);
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

let animate = null
const start = document.getElementById('start')
start.addEventListener('click', () => {
  animate = setInterval(() => { render() }, 25)
  /*  setInterval(() => {
    track1.points.forEach((point) => render(point))
  }, 25) */
})

const refresh = document.getElementById('refresh')
refresh.addEventListener('refresh', () => {
  clearInterval(animate)
})