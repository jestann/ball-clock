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
    this.slope = null
    this.live = false
    this.moving = false
    this.speedIncrement = .5
    this.inBin = false
    this.leavingBin = false
    this.goingHome = false
  }

  makeLive () {
    this.live = true
    this.tracking = true
    this.start()
  }
  
  die () {
    this.stop()
    this.tracking = false
    this.live = false
  }

  start () {
    this.moving = true
  }
  
  switch () {
    this.dX = -this.dX
  }
  
  stop () {
    this.moving = false
  }

  setNextTrack (nextTrack) {
    this.nextTrack = nextTrack
  }
  
  setTrack (track) {
    this.track = track
    this.bin = track.bin
    this.nextTrack = track.bin.nextTrack
    this.x = track.startX
    this.y = track.startY - this.radius
    this.slope = track.slope
    this.dY = this.speedIncrement
    this.dX = this.dY*(1/this.slope)
    
    this.forward = track.slope > 0
    this.offset = 20
    let zeroX = this.forward ? track.startX : track.endX
    let bigX = this.forward ? track.endX : track.startX
    this.targetZeroX = zeroX /* + this.radius - this.offset */
    this.targetBigX = bigX /* - this.radius + this.offset */
  }

  enterBin () {
    this.setNextTrack(this.bin.nextTrack)
    
    let roomLeft = this.bin.addBall(this)
    if (!roomLeft) { return }
    this.numberInBin = roomLeft
    this.inBin = true
    
    this.dY = 0
    this.binInc = this.bin.increment
    if (this.forward) {
      this.enteredForward = true
      this.binFrontX = this.targetBigX
      console.log('entered bin at: ', this.binFrontX)
      this.targetBigX = this.bin.backX - this.binInc*this.numberInBin
    } else {
      this.enteredForward = false
      this.binFrontX = this.targetZeroX
      console.log('entered bin at: ', this.binFrontX)
      this.targetZeroX = this.bin.backX + this.binInc*this.numberInBin
    }
  }

  leaveBin () {
    this.leavingBin = true
    this.dY = 0
    console.log('leaving bin toward ', this.binFrontX)
    if (this.enteredForward) {
      this.targetZeroX = this.binFrontX
      this.targetBigX += 1000 // fix
    } else {
      this.targetBigX = this.binFrontX
      this.targetZeroX -= 1000 // fix
    }
    console.log('tz: ', this.targetZeroX, 'tb: ', this.targetBigX)
    this.switch()
    this.start()
  }
  
  leaveBinLever () {
    this.startNextTrack()
  }
    
  startNextTrack () {
    this.inBin = false
    this.leavingBin = false
    this.tracking = true
    this.setTrack(this.nextTrack)
  }
  
  sendHome () {
    this.goingHome = true
    this.leaveBin()
  }
  
  gotHome (newTrack) {
    // this.inBin = true
    this.goingHome = false
    this.setNextTrack(newTrack)
    this.die()
  }
  
  leaveHome () {
    this.setTrack(this.nextTrack)
    this.start()
  }
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
  
  if (ball.x < ball.targetZeroX || ball.x > ball.targetBigX) { 
    if (ball.leavingBin) {
      console.log('STARTING tz: ', ball.targetZeroX, 'tb: ', ball.targetBigX)
      ball.startNextTrack()
      console.log()
    } else if (ball.inBin) {
      if (ball.moving) {
        console.log('STOPPED at back of bin: ', ball.x)
        ball.stop()
      }
    } else if (ball.goingHome && !ball.leavingBin) {
      console.log('HOME SWITCH ', ball.number)
      ball.switch()
    } else if (ball.tracking) {
      console.log('ENTERING bin at: ', ball.x, 'tz: ', ball.targetZeroX, 'tb: ', ball.targetBigX)
      ball.enterBin()
    }
  }
  
  /* NOTE field.height here */
  if (ball.y > field.height - ball.radius) { ball.stop() }
  
  if (ball.moving) { 
    ball.x += ball.dX
    ball.y += ball.dY
  }
}

const makeColor = () => {
  let red = Math.floor(Math.random()*255)
  let green = Math.floor(Math.random()*255)
  let blue = Math.floor(Math.random()*255)
  let color = `rgb(${red}, ${green}, ${blue})`
  return { red, green, blue, color }
}

const darken = (color) => {
  let red = Math.floor(color.red*.5)
  let green = Math.floor(color.green*.5)
  let blue = Math.floor(color.blue*.5)
  let darker = `rgb(${red}, ${green}, ${blue})`
  return { red, green, blue, color: darker }
}

const makeBalls = (number) => {
  let balls = []
  for (let i = 0; i < number; i++) {
    let color0 = makeColor()
    let color1 = darken(color0)
    let ball = new Ball(i+1, color0.color, color1.color)
    balls.push(ball)
  }
  return balls
}

const setTracks = (balls, track) => {
  balls.forEach((ball) => { 
    ball.setTrack(track) 
  })
}

const drawBalls = (canvas, balls) => {
  for (let i=balls.length-1; i>=0; i--) {
    drawBall(canvas, balls[i]) 
  }
}

const startBall = (balls, index) => {
  if (balls[index]) { balls[index].makeLive() }
}


/* --------- BINS ----------- */

class mainBin {
  constructor (track, balls=null) {
    this.name = 'main'
    this.track = track
    this.balls = balls ? balls : []
    if (balls) { this.capacity = balls.length }
  } 
  
  setBalls (balls) {
    this.capacity = balls.length
    this.balls = balls
  }
  
  addBall (ball) {
    this.balls.push(ball)
    ball.gotHome(this.track)
    return this.balls.length
  }
  
  releaseBall () {
    let ball = this.balls.shift()
    ball.leaveHome()
    return ball
  }
  
  empty () {
    // do nothing
  }
}

class Bin {
  constructor (name, capacity, track, nextTrack, ballRadius) {
    this.name = name
    this.track = track
    this.nextTrack = nextTrack
    this.capacity = capacity
    this.balls = []
        
    this.forward = track.slope > 0
    this.offset = 5
    this.maxCapacity = 6
    this.height = ballRadius*2 + 4*this.offset
    let smaller = this.capacity < this.maxCapacity ? this.capacity : this.maxCapacity
    this.width = ballRadius*2 * smaller + 2*this.offset
    this.increment = this.width / this.capacity
       
    this.enterX = this.forward ? track.endX + this.offset : track.endX - this.offset
    this.enterY = track.endY
    this.renderX = this.forward ? this.enterX : this.enterX - this.width
    this.renderY = this.enterY - this.height
    this.backX = this.forward ? this.renderX + this.width : this.renderX
    this.backY = this.enterY
  }
  
  addBall (ball) {
    this.balls.push(ball)
    if (this.balls.length < this.capacity) {
      return this.balls.length
    }
    console.log('EMPTY ', this.balls.length, ' in ', this.capacity)
    this.empty()
    return false
  }
  
  sendBallHome () {
    let ball = this.balls.pop()
    ball.sendHome()
  }
  
  empty () {
    if (!this.balls[0]) { return }
    let firstBall = this.balls.pop()
    firstBall.startNextTrack()
    while (this.balls[0]) { this.sendBallHome() }
  }
  
  emptyOnCommand () {
    if (!this.balls[0]) { return }
    let firstBall = this.balls.pop()
    firstBall.leaveBin()
    while (this.balls[0]) { this.sendBallHome() }
  }
}

const drawBin = (canvas, bin) => {
  canvas.beginPath()
  canvas.lineWidth = '8'
  canvas.lineCap = 'round'
  canvas.strokeStyle = '#999'
  canvas.strokeRect(bin.renderX, bin.renderY, bin.width, bin.height)
}

const drawBins = (canvas, bins) => {
  drawBin(canvas, bins.min)
  drawBin(canvas, bins.fiveMin)
  drawBin(canvas, bins.hour)
}

const makeBins = (tracks, ballRadius) => {
  let min = new Bin('min', 5, tracks[0], tracks[1], ballRadius)
  tracks[0].bin = min
  let fiveMin = new Bin('fiveMin', 12, tracks[1], tracks[2], ballRadius)
  tracks[1].bin = fiveMin
  let hour = new Bin('hour', 12, tracks[2], tracks[3], ballRadius)
  tracks[2].bin = hour
  let main = new mainBin(tracks[0])
  tracks[3].bin = main
  return { min, fiveMin, hour, main }
}

const emptyBins = (bins) => {
  for (let name in bins) {
    bins[name].empty()
  }
}


/* --------- TRACKS ----------- */

class Track {
  constructor (startX, startY, endX, endY, index=null) {
    this.index = index
    this.startX = startX
    this.startY = startY
    this.endX = endX
    this.endY = endY
    this.rise = this.endY - this.startY
    this.run = this.endX - this.startX
    this.slope = this.rise/this.run
    this.bin = null
  }
}

const makeTracks = (width, height, marginX, ballRadius, numTracks=4) => {
  const firstX = marginX
  const lastX = width - marginX
  const ballHeight = ballRadius*2 + 10
  const interval = (height - ballHeight - 10) / numTracks
  let tracks = []
  for (let i = 0; i < numTracks; i++) {
    let startX = (i % 2 === 0) ? lastX : firstX
    let endX = (startX === firstX) ? lastX : firstX
    let track = new Track(startX, ballHeight+interval*i, endX, ballHeight+interval*(i+1), i)
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



/* --------- RENDERING ----------- */

const field = document.getElementById('canvas')
field.width = 1300 /* window.innerWidth */
field.height = 500 /* window.innerHeight */
const canvas = field.getContext('2d')

const balls = makeBalls(100)
const tracks = makeTracks(field.width, field.height, 300, balls[0].radius)
const bins = makeBins(tracks, balls[0].radius)
setTracks(balls, tracks[0])

const render = () => {
  canvas.beginPath()
  canvas.clearRect(0, 0, field.width, field.height)
  
  drawTracks(canvas, tracks)
  drawBalls(canvas, balls)
  drawBins(canvas, bins)
}



/* --------- BUTTON HANDLERS ----------- */

let animate = null
const start = document.getElementById('start')
start.addEventListener('click', () => {
  animate = setInterval(render, 25)
})

let whichBall = 0
const add = document.getElementById('add')
add.addEventListener('click', () => {
  startBall(balls, whichBall)
  whichBall++
})

const min = document.getElementById('min')
min.addEventListener('click', () => {
  bins.min.emptyOnCommand()
})

const five = document.getElementById('five')
five.addEventListener('click', () => {
  bins.five.emptyOnCommand()
})

const hour = document.getElementById('hour')
hour.addEventListener('click', () => {
  bins.hour.emptyOnCommand()
})

const stop = document.getElementById('stop')
stop.addEventListener('click', () => {
  clearInterval(animate)
})
