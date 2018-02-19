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
  
  /* global performance */ // for linter
  printTime (func) {
    let start = performance.now()
    func()
    let end = performance.now()
    let mil = Math.floor(end - start)
    let sec = mil/1000
    console.log(`Completed in ${mil} milliseconds (${sec} seconds)`)
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
  
  
  
  /* ALGORITHM 2: MAP TRANSFORMATIONS */
  
  getMultiples (num) {
    let twelve = 0, sixty = 0, five = 0
    let numLeft = num
    if (num >= 12*60) {
      twelve = Math.floor(num/(12*60))
      numLeft = num % (12*60)
    }
    if (num >= 60) {
      sixty = Math.floor(numLeft/60)
      numLeft = numLeft % 60
    }
    if (num >= 5) {
      five = Math.floor(numLeft/5)
      numLeft = numLeft % 5
    }
    return { twelve, sixty, five, min: numLeft }
  }

  getMaps (numBalls, numMinutes) {
    this.initialize(numBalls) // no error handling, called internally
    let maps = this.count(numMinutes)
    return maps
  }
  
  mapTransformation (originalMain, mainMap, arrayMap=null) {
    let main = [], array = []
    if (arrayMap) { arrayMap.forEach((ballNum) => { array.push(originalMain[ballNum-1]) }) }
    mainMap.forEach((ballNum) => { main.push(originalMain[ballNum-1]) })
    return { main, array }
  }
  
  powerTransform (originals, maps, numTimes, arrayName=null) {
    let state = originals
    let arrayMap = arrayName ? maps[arrayName] : null
    for (let i = 0; i < numTimes; i++) { 
      state = this.mapTransformation(state.main, maps.main, arrayMap) 
      console.log(i, 'th iteration: ', state)
    }
    return state
  }
  
  transformToMin (numBalls, numMinutes) {
    let mults = this.getMultiples(numMinutes)
    let maps = {}
    if (mults.twelve) { maps.twelve = this.getMaps(numBalls, 12*60) }
    if (mults.sixty) { maps.sixty = this.getMaps(numBalls, 60) }
    if (mults.five) { maps.five = this.getMaps(numBalls, 5) }
    if (mults.min) { maps.min = this.getMaps(numBalls, 1) }

    this.initialize(numBalls) // clear out previous "get map" states
    let state = { main: this.main, hour: this.hour, fiveMin: this.fiveMin, min: this.min }
    let temp = {}
    
    // for a number of twelve-hour cycles
    if (mults.twelve) {
      temp = this.powerTransform(state, maps.twelve, mults.twelve) 
      state.main = temp.main
    }

    // for a number of hours
    console.log('state before: ', state)
    console.log('map: ', maps.sixty)
    if (mults.sixty) { 
      temp = this.powerTransform(state, maps.sixty, mults.sixty, 'hour')
      console.log('state after: ', temp)
      state.main = temp.main
      state.hour = temp.array
    }

    // for a number of five-minute increments
    if (mults.five) {
      temp = this.powerTransform(state, maps.five, mults.five, 'fiveMin')
      state.main = temp.main
      state.fiveMin = temp.array
    }
    
    // for a number of minutes
    if (mults.min) {
      temp = this.powerTransform(state, maps.min, mults.min, 'min')
      state.main = temp.main
      state.min = temp.array
    }

    return state
  }
  
  transform (original, map) {
    let array = []
    map.forEach((ballNum) => { array.push(original[ballNum-1]) })
    return array
  }

  countCycles (numBalls) {
    let cycles = 1
    const cycleMap = this.getMaps(numBalls, 12*60).main // no error handling
    let main = cycleMap // getting the cycle map initializes the arrays
    while (!this.arraysEqual(main, this.original)) { 
      main = this.mapTransformation(main, cycleMap).main
      cycles++
    }
    return cycles*12*60
  }
  
  
  /* MODES */
  
  modeOne (numBalls, numMinutes) {
    let initialized = this.initialize(numBalls) // keep error handling at user input level
    if (!initialized.success) { return initialized.error }
    this.printTime(() => {
      let result = JSON.stringify(this.transformToMin(numBalls, numMinutes))
      console.log(`${numBalls} balls were cycled over ${numMinutes} minutes.`)
      console.log(result)
    })
  }
  
  modeTwo (numBalls) {
    let initialized = this.initialize(numBalls) // keep error handling at user input level
    if (!initialized.success) { return initialized.error }
    let magic, days = null
    this.printTime(() => {
      magic = this.countCycles(numBalls)
      days = magic/(60*24)
      console.log(`${numBalls} balls cycle after ${days} days.`)
    })
    return days
  }
}

const ballClock = new BallClock()
// ballClock.runTests()
ballClock.run(30, 325)