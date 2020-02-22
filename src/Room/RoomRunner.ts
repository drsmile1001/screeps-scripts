import { logger } from "utils/Logger"
import { sourceEdgeMaps, roomStructures } from "./RoomService"
import { runAtLoop } from "utils/GameTick"

export function runAllRoom() {
    for (const name in Game.rooms) {
        const room = Game.rooms[name]
        if (room.controller?.my) {
            try {
                runRoom(room)
            } catch (error) {
                logger.error(error)
            }
        }
    }
}
function runRoom(room: Room) {
    runAtLoop(5, () => checkSourceContainers(room), 0)
}

export function checkSourceContainers(room: Room) {
    const spawns = roomStructures
        .get(room.name)
        .value.filter(s => s.structureType === STRUCTURE_SPAWN) as StructureSpawn[]
    if (!spawns.length) return
    const sources = sourceEdgeMaps.get(room.name)
    const containers = roomStructures
        .get(room.name)
        .value.filter(s => s.structureType === STRUCTURE_CONTAINER) as StructureContainer[]

    Array.from(sources)
        .map(([sourceId]) => Game.getObjectById<Source>(sourceId)!)
        .filter(source => !containers.length || containers.every(container => source.pos.getRangeTo(container.pos) > 3))
        .forEach(source => {
            const pathStep = spawns
                .map(spawn =>
                    source.pos.findPathTo(spawn, {
                        ignoreRoads: true,
                        ignoreCreeps: true
                    })
                )
                .sort((a, b) => a.length - b.length)[0][1]
            const result = room.getPositionAt(pathStep.x, pathStep.y)?.createConstructionSite(STRUCTURE_CONTAINER)
            logger.log(result)
        })
}
