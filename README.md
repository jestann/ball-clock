# Ball Clock

_This represents both a visual and an algorithmic simulation of a ball clock using vanilla Javascript._

#### What exactly is a ball clock?

A ball clock is a mechanical device capable of telling time. It consists of a collection of ball bearings that run on different tracks and collect in different bins to demonstrate hours, five-minute increments, and minutes. 

Once each minute, a lever lifts a ball bearing from a collection of balls (`main`) to the top of a track. It rolls down the track into the first bin (`min`), which counts minutes. Once this bin receives its fifth ball, it empties. The four original balls roll down in reverse order to the original bin (`main`), and the fifth ball rolls onto the next track and down into the next bin (`fiveMin`).

Eventually, the five-minute bin (`fiveMin`) fills up with eleven balls, and when the twelfth ball approaches, it triggers the bin to empty, sending the original eleven balls in reverse order back to the main bin (`main`) and the final ball into the third bin (`hour`), which keeps track of how many hours have passed since the beginning of the clock. The cycle continues until after twelve hours, the third bin (`hour`) empties, and all the original eleven balls return to the main bin (`main`) in reverse order, followed by the final ball.

By presenting the number of balls in each bin, the clock can demonstrate the current time.

For example, an output of the following...

```
min: 2 balls
fiveMin: 4 balls
hour: 8 balls
```

demonstrates a time of `8:22` (taking `0:00` as midnight/noon ... or `9:32` if there is a stationary ball in the `hour` bin to allow time to count from `1:00` to `12:00`).

#### So... how does one implement a ball clock?


Well, first one needs to understand the complexities of exactly how the balls move around, and to do that, it helps to see something visual. More on that below...

Anothering 



```
min: [23, 13]
fiveMin: [18, 14, 20, 5]
hour: [24, 15, 7, 17, 22, 27, 1, 25]
main: [11, 21, 2, 4, 19, 9, 26, 10, 3, 6, 12, 8, 16]
```

A description of the task can be found [here](instructions.md).



visual [here](https://codepen.io/jestann/full/mXprEd/)

Here is the implementation of a naive algorithm for a ball clock.

```
---------Test 1: it runs mode one correctly----------
30 balls were cycled over 325 minutes.
{"min":[],"fiveMin":[22,13,25,3,7],"hour":[6,12,17,4,15],"main":[11,5,26,18,2,30,19,8,24,10,29,20,16,21,28,1,23,14,27,9]}
Completed in 0 milliseconds (0 seconds)
Test 1 passed.
---------Test 2: it runs mode two correctly----------
30 balls cycle after 15 days.
Completed in 23 milliseconds (0.023 seconds)
45 balls cycle after 378 days.
Completed in 74 milliseconds (0.074 seconds)
Test 2 passed.
---------Test 3: it returns an error for invalid input----------
ERROR: MUST CHOOSE NUMBER OF BALLS BETWEEN 27 AND 127
Test 3 passed.
ALL TESTS PASS.
30 balls were cycled over 1000000 minutes.
{"min":[],"fiveMin":[23,19,30,1,28,21,13,7],"hour":[20,15,22,24,4,9,14,8,11,12],"main":[6,5,29,16,10,25,3,26,17,2,27,18]}
Completed in 91 milliseconds (0.091 seconds)
127 balls cycle after 2415 days.
Completed in 855 milliseconds (0.855 seconds)
```

algorithm 1 [here](https://repl.it/@jestann/ball-clock)
algorithm 2 [here](https://repl.it/@jestann/ball-clock-2)
algorithm 3 [here](https://repl.it/@jestann/ball-clock-3) eventually

And here is some sample output for the map transformation algorithm.
```
---------Test 1: it runs mode one correctly----------
30 balls were cycled over 325 minutes.
{"min":[],"fiveMin":[22,13,25,3,7],"hour":[6,12,17,4,15],"main":[11,5,26,18,2,30,19,8,24,10,29,20,16,21,28,1,23,14,27,9]}
Completed in 1 milliseconds (0.001 seconds)
Test 1 passed.
---------Test 2: it runs mode two correctly----------
30 balls cycle after 15 days.
Completed in 1 milliseconds (0.001 seconds)
45 balls cycle after 378 days.
Completed in 4 milliseconds (0.004 seconds)
Test 2 passed.
---------Test 3: it returns an error for invalid input----------
ERROR: MUST CHOOSE NUMBER OF BALLS BETWEEN 27 AND 127
Test 3 passed.
ALL TESTS PASS.
30 balls were cycled over 1000000 minutes.
{"min":[],"fiveMin":[23,19,30,1,28,21,13,7],"hour":[20,15,22,24,4,9,14,8,11,12],"main":[6,5,29,16,10,25,3,26,17,2,27,18]}
Completed in 86 milliseconds (0.086 seconds)
127 balls cycle after 2415 days.
Completed in 39 milliseconds (0.039 seconds)
```