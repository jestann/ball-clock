/* --------- DESIGNED BY JESS BIRD 2018 ----------- */

/* This ought to be in segregated files; however, it was developed in a visual sandbox that required a single file and copied over. */

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
    this.mainBinning = false
    this.live = true
    console.log('made live ball ', this.number, this.live)
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
  
  setLocation (x, y) {
    this.x = x
    this.y = y
  }
  
  setHome (homeBin) {
    this.homeX = homeBin.homeX
    this.homeY = homeBin.homeY - this.radius
    this.homeBin = homeBin
    this.mainBinning = true
  }

  setNextTrack (nextTrack) {
    this.nextTrack = nextTrack
  }
  
  setStartTrack (track) {
    this.startTrack = track
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
  
  gotHome () {
    this.goingHome = false
    this.mainBinning = true
    this.homeBin.addBall(this)
    this.setTrack(this.startTrack)
    this.die()
  }
  
  leaveHome () {
    this.setTrack(this.startTrack)
    this.makeLive()
    console.log('LEAVING HOME ', this)
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
    ball.setStartTrack(track)
  })
}

const setHome = (balls, homeBin) => {
  balls.forEach((ball) => { ball.setHome(homeBin) })
}


/* --------- DRAWING BALLS ----------- */

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
  
  canvas.beginPath()
  canvas.font = '18px sans-serif'
  canvas.textBaseline = 'middle'
  canvas.textAlign = 'center'
  canvas.fillStyle = 'white'
  canvas.fillText(ball.number, ball.x, ball.y)
    
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
  
  if (ball.y > ball.homeY) {
    ball.gotHome()
  }
    
  if (ball.moving) { 
    ball.x += ball.dX
    ball.y += ball.dY
  }
}

const drawBinBall = (canvas, ball, bin, i) => {
  if (!ball.mainBinning) { return }
  
  let increment = (bin.width - ball.radius*2) / bin.balls.length
  let ballX = bin.renderX + increment*(i+1)
  let ballY = bin.renderY + ball.radius + 15
  ball.setLocation(ballX, ballY)

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
  
  canvas.beginPath()
  canvas.font = '18px sans-serif'
  canvas.textBaseline = 'middle'
  canvas.textAlign = 'center'
  canvas.fillStyle = 'white'
  canvas.fillText(ball.number, ball.x, ball.y)  
}

const drawBalls = (canvas, balls) => {
  for (let i=balls.length-1; i>=0; i--) {
    drawBall(canvas, balls[i]) 
  }
}

const drawBinBalls = (canvas, bin) => {
  for (let i=bin.balls.length-1; i>=0; i--) { 
    drawBinBall(canvas, bin.balls[i], bin, i)
  }
}


/* --------- BINS ----------- */

class mainBin {
  constructor (capacity, tracks, ballRadius) {
    this.name = 'main'
    this.track = tracks[0]
    this.capacity = capacity
    this.balls = []
    
    let startX = tracks[0].startX
    let endX = tracks[0].endX
    let bigger = startX > endX ? startX : endX
    let smaller = startX > endX ? endX : startX
    let xPadding = 75
    let binStartX = smaller - xPadding
    let binEndX = bigger + xPadding
    this.renderX = binStartX
    this.width = binEndX - binStartX
    
    let endY = tracks[tracks.length - 1].endY
    let yPadding = 25
    let binStartY = endY + yPadding
    this.renderY = binStartY
    
    this.offset = 5
    this.height = ballRadius*2 + 4*this.offset
    this.increment = this.width / this.capacity
  } 
    
  setBalls (balls) {
    this.capacity = balls.length
    balls.forEach((ball) => { this.balls.push(ball) })
  }

  setHome (track) {
    this.homeX = track.endX
    this.homeY = track.endY
  }

  addBall (ball) {
    this.balls.push(ball)
    return this.balls.length
  }
  
  releaseBall () {
    if (this.balls[0]) {
      let ball = this.balls.shift()
      return ball
    } else { return null }
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
    this.renderY = this.enterY - this.height
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
    
    if (this.name === 'min') { 
      firstBall.leaveBinLever()
      while (this.balls[0]) { this.sendBallHome() } 
    } else if (this.name === 'fiveMin') {
      firstBall.leaveBinLever()
      setTimeout(() => {
        while (this.balls[0]) { this.sendBallHome() }
      }, 6000)
    } else {
      firstBall.stop()
      setTimeout(() => {
        while (this.balls[0]) { this.sendBallHome() }
      }, 12000)
      setTimeout(() => {
        firstBall.start()
        firstBall.leaveBinLever()
      }, 18000)
    }
  }
  
  emptyOnCommand () {
    if (!this.balls[0]) { return }
    let firstBall = this.balls.pop()
    firstBall.leaveBin()
    while (this.balls[0]) { this.sendBallHome() }
  }
}

const makeBins = (tracks, ballRadius) => {
  let min = new Bin('min', 5, tracks[0], tracks[1], ballRadius)
  tracks[0].bin = min
  let fiveMin = new Bin('fiveMin', 12, tracks[1], tracks[2], ballRadius)
  tracks[1].bin = fiveMin
  let hour = new Bin('hour', 12, tracks[2], tracks[3], ballRadius)
  tracks[2].bin = hour
  let main = new mainBin(100, tracks, ballRadius)
  tracks[3].bin = main
  main.setHome(tracks[3])
  return { min, fiveMin, hour, main }
}

const emptyBins = (bins) => {
  for (let name in bins) {
    bins[name].empty()
  }
}


/* --------- DRAWING BINS ----------- */

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

const drawMainBin = (canvas, bin) => {
  canvas.beginPath()
  canvas.lineWidth = '8'
  canvas.lineCap = 'round'
  canvas.strokeStyle = '#999'
  canvas.strokeRect(bin.renderX, bin.renderY, bin.width, bin.height)
}

const drawArray = (canvas, bin) => {
  let startX = bin.renderX + 10
  let startY = bin.renderY - 20
  if (bin.name === 'fiveMin') { startX = bin.renderX + bin.width - 10 }
  let length = bin.balls.length
  
  let array = []
  bin.balls.forEach((ball) => { array.push(ball.number) })
  /*
  // reverse order for fiveMin?
  if (bin.name === 'fiveMin') {
    let temp = []
    array.forEach((ballNum) => { temp.unshift(ballNum) })
    array = temp
  }
  */
  let string = bin.name + ': [ ' + array.toString() + ' ]'
  
  canvas.beginPath()
  canvas.font = '18px sans-serif'
  canvas.textBaseline = 'middle'
  canvas.textAlign = 'left'
  if (bin.name === 'fiveMin') { canvas.textAlign = 'right' }
  canvas.fillStyle = 'white'
  canvas.fillText(string, startX, startY)
}

const drawArrays = (canvas, bins) => {
  drawArray(canvas, bins.min)
  drawArray(canvas, bins.fiveMin)
  drawArray(canvas, bins.hour)
  drawArray(canvas, bins.main)
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

const makeTracks = (width, height, marginX, marginBottom, ballRadius, numTracks=4) => {
  const firstX = marginX
  const lastX = width - marginX
  const ballHeight = ballRadius*2 + 10
  const interval = (height - ballHeight - marginBottom) / numTracks
  let tracks = []
  for (let i = 0; i < numTracks; i++) {
    let startX = (i % 2 === 0) ? lastX : firstX
    let endX = (startX === firstX) ? lastX : firstX
    let track = new Track(startX, ballHeight+interval*i, endX, ballHeight+interval*(i+1), i)
    tracks.push(track)
  }
  return tracks
}



/* --------- DRAWING TRACKS ----------- */

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


/* --------- INITIALIZE & RENDERING ----------- */

const field = document.getElementById('canvas')
field.width = window.innerWidth - 10
field.height = window.innerHeight - 125
const canvas = field.getContext('2d')

let numBalls = 27
const balls = makeBalls(numBalls)
const tracks = makeTracks(field.width, field.height, 300, 100, balls[0].radius)
const bins = makeBins(tracks, balls[0].radius)
setTracks(balls, tracks[0])
setHome(balls, bins.main)
bins.main.setBalls(balls)
let showArrays = false

const render = () => {
  canvas.beginPath()
  canvas.clearRect(0, 0, field.width, field.height)
  
  drawTracks(canvas, tracks)
  drawBalls(canvas, balls)
  drawBins(canvas, bins)
  drawMainBin(canvas, bins.main)
  drawBinBalls(canvas, bins.main)
  if (showArrays) { drawArrays(canvas, bins) }
}



/* --------- BUTTON HANDLERS ----------- */

render()
let animate = setInterval(render, 25)

let minute = 0
const addMinute = () => {
  let ball = bins.main.releaseBall()
  if (ball) {
    ball.leaveHome()
    minute++
    minTracker.innerHTML = minute
  }
}

let clock = null
const start = document.getElementById('start')
start.addEventListener('click', () => {
  clock = setInterval(addMinute, 5000)
})

const minTracker = document.getElementById('minute')
const add = document.getElementById('add')
add.addEventListener('click', addMinute)

/* eventually add functionality to alter numBalls */
const ballTracker = document.getElementById('balls')
ballTracker.innerHTML = numBalls

const array = document.getElementById('array')
array.addEventListener('click', () => {
  showArrays = !showArrays
})

const stop = document.getElementById('stop')
stop.addEventListener('click', () => {
  clearInterval(clock)
})

/*
const min = document.getElementById('min')
min.addEventListener('click', () => {
  bins.min.emptyOnCommand()
})

const five = document.getElementById('five')
five.addEventListener('click', () => {
  bins.fiveMin.emptyOnCommand()
})

const hour = document.getElementById('hour')
hour.addEventListener('click', () => {
  bins.hour.emptyOnCommand()
})
*/