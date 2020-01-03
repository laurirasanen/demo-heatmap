var Demo = require("@demostf/demo.js");
var fs = require("fs");

function getPoints(demoFilePath, cb, pcb = null) {
    try {
        fs.readFile(demoFilePath, (err, data) => {
            if (err) {
                cb(err, null);
                return;
            }

            var demo = Demo.Demo.fromNodeBuffer(data);
            var analyser = demo.getAnalyser();
            var head = analyser.getHeader();
            var match = analyser.match;

            var playerData = [];

            var lastTick = -1;
            for (const packet of analyser.getPackets()) {

                // There can be multiple packets per tick,
                // there's probably a better way to do this...
                if (match.tick <= lastTick) continue;
                lastTick = match.tick;

                for (const pm of match.playerEntityMap) {

                    var player = pm[1];

                    if (player.user.steamId === "BOT") continue;
                    if (player.user.team !== "blue" && player.user.team !== "red") continue;
                    if (player.lifeState !== 0) continue;

                    var point = {
                        "tick": match.tick,
                        "x": player.position.x,
                        "y": player.position.y,
                        "z": player.position.z,
                        "yaw": player.viewAngle
                    };

                    var playerDataIndex = playerData.findIndex(p => p["steamId"] === player.user.steamId);

                    if (playerDataIndex === -1) {
                        playerData.push(
                            {
                                "steamId": player.user.steamId,
                                "points": [point]
                            }
                        );
                    }
                    else {
                        playerData[playerDataIndex]["points"].push(point);
                    }
                }

                if (pcb != null)
                    pcb(match.tick, head.ticks);
            }

            var demoData = {
                "head": head,
                "players": playerData
            };

            if (cb != null)
                cb(null, demoData);
        });

    } catch (e) {
        cb(e, null);
    }
}

exports.getPoints = getPoints;