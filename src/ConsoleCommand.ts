global.removeFlags = function(room: string) {
    if (!room) {
        room = "W5N8"
        // console.log("需要房間名稱")
        // return
    }
    _.forEach(Game.flags, flag => {
        if (!flag.room) return
        if (flag.room.name == room) flag.remove()
    })
}

global.testPath = function() {
    const spawn = Game.spawns["Spawn1"]
    const sources = Game.rooms["W5N8"].find(FIND_SOURCES)
    sources.forEach(source => {
        const paths = spawn.pos.findPathTo(source, {
            ignoreCreeps: true,
            ignoreRoads: true
        })
        paths.forEach((path, i) => {
            Game.rooms["W5N8"].createFlag(path.x, path.y)
        })
    })
}
