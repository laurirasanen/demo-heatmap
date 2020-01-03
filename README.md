# demo-heatmap
Export TF2 player positions from an STV demo using [demo.js](https://github.com/demostf/demo.js/).

## Write positions of players to a JSON file with progress
```js
var fs = require("fs");
var heatmap = require("demo-heatmap");

var lastProgress = 0;
var startTime = Date.now();

heatmap.getPoints(
    // Demo file name
    "example.dem",

    // Completion callback
    (err, data) => {
        if (err) throw err;

        fs.writeFile("data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) throw err;

            console.log("Player data written to 'data.json'!");
        });
    },

    // Progress callback
    (current, max) => {
        // Log every 100k ticks
        if (current - lastProgress > 100000) {
            lastProgress += 100000;

            var timePassed = Date.now() - startTime;
            var speed = 1000 * current / timePassed;
            var remaining = max - current;

            console.log(`Progress: ${lastProgress}/${max}, speed: ${Math.round(speed)} ticks/s, ETA: ${Math.round(remaining / speed)}s`);
        }
    }
);
```
