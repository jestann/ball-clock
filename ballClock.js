class BallClock {
  
  // EXTERNAL METHOD

  run (numberOfBalls=false, numberOfMinutes=false) { 
    if (numberOfMinutes) { 
      this.modeOne(numberOfBalls, numberOfMinutes) 
    } else if (numberOfBalls) { 
      this.modeTwo(numberOfBalls)
    }
  }
  
  runTests () {
    console.log('---------Test 1: it runs mode one correctly----------')
    let result = "{\"min\":[],\"fiveMin\":[22,13,25,3,7],\"hour\":[6,12,17,4,15],\"main\":[11,5,26,18,2,30,19,8,24,10,29,20,16,21,28,1,23,14,27,9]}"
    let test1 = this.modeOne(30, 325) === result
    console.log(test1 ? 'Test 1 passed.' : 'Test 1 failed.')

    console.log('---------Test 2: it runs mode two correctly----------')
    let test2 = (this.modeTwo(30) === 15) && (this.modeTwo(45) === 378)
    console.log(test2 ? 'Test 2 passed.' : 'Test 2 failed.')

    console.log('---------Test 3: it returns an error for invalid input----------')
    let test3 = this.modeOne(10, 10) === 'ERROR: INVALID NUMBER OF BALLS'
    console.log(test3 ? 'Test 3 passed.' : 'Test 3 failed.')
    
    console.log(test1 && test2 && test3 ? "ALL TESTS PASS." : "TESTS FAIL.")

    return test1 && test2 && test3
  }
  
  
  // INTERNAL METHODS
  
  setupBalls (numberOfBalls) {
    if (numberOfBalls < 27 || numberOfBalls > 127) { return false }
    this.totalMinutes = 0
    this.min = []
    this.fiveMin = []
    this.hour = []
    this.main = []
    this.original = []
    for (let i = 1; i <= numberOfBalls; i++) {
      this.main.push(i)
      this.original.push(i)
    }
    return true
  }
  
  tick () {
    this.totalMinutes++
    let releasedBall = this.main.shift()
    if (this.min.length < 4) {
      this.min.push(releasedBall)
      
    } else if (this.fiveMin.length < 11) {
      while (this.min[0]) { this.main.push(this.min.pop()) }
      this.fiveMin.push(releasedBall)
      
    } else if (this.hour.length < 11) {
      while (this.min[0]) { this.main.push(this.min.pop()) }
      while (this.fiveMin[0]) { this.main.push(this.fiveMin.pop()) }
      this.hour.push(releasedBall)

    } else {
      while (this.min[0]) { this.main.push(this.min.pop()) }
      while (this.fiveMin[0]) { this.main.push(this.fiveMin.pop()) }
      while (this.hour[0]) { this.main.push(this.hour.pop()) }
      this.main.push(releasedBall)
    }
  }

  compute (numberOfMinutes) {
    for (let i = 1; i <= numberOfMinutes; i++) { this.tick() }
    return JSON.stringify({ min: this.min, fiveMin: this.fiveMin, hour: this.hour, main: this.main })
  }
  
  arraysEqual (one, two) {
    return one.length === two.length && one.every((v, i) => (v === two[i]))
  }

  countMinToRepeat () {
    this.totalMinutes = 0
    this.tick()
    while (!this.arraysEqual(this.main, this.original)) { this.tick() }
    return this.totalMinutes
  }

  modeOne (numberOfBalls, numberOfMinutes) {
    let initialized = this.setupBalls(numberOfBalls)
    if (!initialized) { 
      console.log('Mode 1 fails.')
      return 'ERROR: INVALID NUMBER OF BALLS'
    }

    let start = performance.now()
    let result = this.compute(numberOfMinutes)
    let end = performance.now()
    
    console.log(`${numberOfBalls} balls were cycled over ${numberOfMinutes} minutes.`)
    console.log(result)
    let mil = Math.floor(end - start)
    let sec = mil/1000
    console.log(`Completed in ${mil} milliseconds (${sec} seconds)`)
    return result
  }
  
  modeTwo (numberOfBalls) {
    let initialized = this.setupBalls(numberOfBalls)
    if (!initialized) { 
      console.log('Mode 2 fails.')
      return 'ERROR: INVALID NUMBER OF BALLS'
    }

    let start = performance.now()
    let magic = this.countMinToRepeat()
    let end = performance.now()
    
    let days = magic/(60*24)
    console.log(`${numberOfBalls} balls cycle after ${days} days.`)
    let mil = Math.floor(end - start)
    let sec = mil/1000
    console.log(`Completed in ${mil} milliseconds (${sec} seconds)`)
    return days
  }
}

const ballClock = new BallClock()
ballClock.runTests()
ballClock.run(50, 500)