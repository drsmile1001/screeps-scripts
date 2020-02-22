import { checkSourceContainers } from "Room/RoomRunner"
import { StopWatch } from "utils/StopWatch"
import { logger } from "utils/Logger"

global.removeFlags = function(room: string) {
    if (!room) {
        room = "W5N8"
    }
    _.forEach(Game.flags, flag => {
        if (!flag.room) return
        if (flag.room.name == room) flag.remove()
    })
}

global.test = function(name: string) {
    var sw = StopWatch.startNew()
    checkSourceContainers(Game.rooms[name])
    logger.log(sw.stop())
}
