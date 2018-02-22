class BallClock {
  
  /* EXTERNAL METHODS */

  run (numBalls=false, numMinutes=false) { 
    if (numMinutes) { 
      this.modeOne(numBalls, numMinutes) 
    } else if (numBalls) { 
      this.modeTwo(numBalls)
    }
  }
  
  runTests () {
    console.log('---------Test 1: it runs mode one correctly----------')
    let result = '{"min":[],"fiveMin":[22,13,25,3,7],"hour":[6,12,17,4,15],"main":[11,5,26,18,2,30,19,8,24,10,29,20,16,21,28,1,23,14,27,9]}'
    let test1 = this.modeOne(30, 325) === result
    console.log(test1 ? 'Test 1 passed.' : 'Test 1 failed.')

    console.log('---------Test 2: it runs mode two correctly----------')
    let test2 = (this.modeTwo(30) === 15) && (this.modeTwo(45) === 378)
    console.log(test2 ? 'Test 2 passed.' : 'Test 2 failed.')

    console.log('---------Test 3: it returns an error for invalid input----------')
    let test3 = this.modeOne(10, 10) === 'ERROR: MUST CHOOSE NUMBER OF BALLS BETWEEN 27 AND 127'
    console.log(test3 ? 'Test 3 passed.' : 'Test 3 failed.')
    
    console.log(test1 && test2 && test3 ? 'ALL TESTS PASS.' : 'TESTS FAIL.')

    return test1 && test2 && test3
  }
  
  
  /* INTERNAL METHODS */
  
  initialize (numBalls) {
    if (numBalls < 27 || numBalls > 127) { 
      let error = 'ERROR: MUST CHOOSE NUMBER OF BALLS BETWEEN 27 AND 127'
      console.log(error)
      return { success: false, error }
    }
    this.totalMinutes = 0
    this.numBalls = numBalls
    this.min = []
    this.fiveMin = []
    this.hour = []
    this.main = []
    this.original = []
    for (let i = 1; i <= numBalls; i++) {
      this.main.push(i)
      this.original.push(i)
    }
    return { success: true }
  }
  
  arraysEqual (one, two) {
    return one.length === two.length && one.every((v, i) => (v === two[i]))
  }

  
  /* NAIVE ALGORITHM */
  
  tick () {
    this.totalMinutes++
    let releasedBall = this.main.shift() // shift may be a costly operation
    if (this.min.length < 4) {
      this.min.push(releasedBall) // push and pop may be constant time operations
      
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

  count (numMinutes) {
    for (let i = 1; i <= numMinutes; i++) { this.tick() }
    return { min: this.min, fiveMin: this.fiveMin, hour: this.hour, main: this.main }
  }
  
  
  /* ALGORITHM 3: LCM */
  
  getMap (numBalls) {
    this.initialize(numBalls) // no error handling needed, called internally
    return this.count(12*60).main
  }

  getCycles (ballNum, map) {
    let cycles = 1
    let temp = map.indexOf(ballNum) + 1
    while (temp != ballNum) {
      temp = map.indexOf(temp) + 1
      cycles++
    }
    return cycles
  }
  
  getAllCycles (map) {
    let cycles = []
    for (let i = 1; i <= map.length; i++) {
      cycles.push(this.getCycles(i, map))
    }
    return cycles
  }
  
  // this uses Euclid's algorithm
  findGCD (num1, num2) {
    let max = num1 > num2 ? num1 : num2
    let min = num1 > num2 ? num2 : num1
    let diff = max - min
    while (diff !== 0) { 
      let temp = min % diff
      min = diff
      diff = temp
    }
    return min
  }
  
  findLCM (num1, num2) {
    const gcd = this.findGCD(num1, num2)
    return (num1 * num2)/gcd
  }

  findCyclesLCM (cycles) {
    let lcm = cycles[0]
    for (let i = 1; i < cycles.length; i++) {
      lcm = this.findLCM(lcm, cycles[i])
    }
    return lcm
  }

  countDays (numBalls) {
    const map = this.getMap(numBalls) // this initializes the arrays, no error handling needed
    const cycles = this.getAllCycles(map)
    let lcm = this.findCyclesLCM(cycles)
    return lcm/2
  }
  
  
  /* MODES */
  
  // uses naive algorithm
  modeOne (numBalls, numMinutes) {
    let initialized = this.initialize(numBalls) // keep error handling at user input level
    if (!initialized.success) { return initialized.error }
    let start = performance.now()
    let result = JSON.stringify(this.count(numMinutes))
    let end = performance.now()
    console.log(`${numBalls} balls were cycled over ${numMinutes} minutes.`)
    console.log(result)
    let mil = Math.floor(end - start)
    let sec = mil/1000
    console.log(`Completed in ${mil} milliseconds (${sec} seconds)`)
    return result
  }
  
  // uses LCM algorithm
  modeTwo (numBalls) {
    let initialized = this.initialize(numBalls) // keep error handling at user input level
    if (!initialized.success) { return initialized.error }
    let start = performance.now()
    let days = this.countDays(numBalls)
    let end = performance.now()
    console.log(`${numBalls} balls cycle after ${days} days.`)
    let mil = Math.floor(end - start)
    let sec = mil/1000
    console.log(`Completed in ${mil} milliseconds (${sec} seconds)`)
    return days
  }
}

const ballClock = new BallClock()
ballClock.runTests()
ballClock.run(27, 1000000)
ballClock.run(127)