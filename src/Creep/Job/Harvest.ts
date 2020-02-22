import { runAtLoop } from "utils/GameTick"
import { CreepRegisterMap } from "utils/RegisterMap"
import { sourceEdgeMaps } from "Room/RoomService"
import { logger } from "utils/Logger"

export enum HarvestResult {
    Ok,
    FullEnergy,
    NoSource
}
function harvestSource(creep: Creep, source: Source) {
    const result = creep.harvest(source)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("⛏️"), creep.ticksToLive)
            creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } })
            return
        case OK:
            return
        default:
            creep.say("❌")
            logger.error(`${creep.name} 在harvestSource時錯誤 ${result}`)
            return
    }
}

export function harvest(creep: Creep): HarvestResult {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return HarvestResult.FullEnergy
    while (true) {
        if (creep.memory.harvestSourceId) {
            const source = Game.getObjectById<Source>(creep.memory.harvestSourceId)
            if (!source || source.energy === 0) {
                delete creep.memory.harvestSourceId
                continue
            } else {
                harvestSource(creep, source)
                return HarvestResult.Ok
            }
        } else {
            //查詢當下各個source註冊的creep數量
            const sourceCreeps = new CreepRegisterMap(memory => memory.harvestSourceId)
            const sourceEdgeMap = sourceEdgeMaps.get(creep.room.name)
            const sources = Array.from(sourceEdgeMap)
                .filter(([sourceId, limit]) => sourceCreeps.get(sourceId).length < limit)
                .map(([sourceId]) => Game.getObjectById<Source>(sourceId)!)
                .filter(source => source.energy > 0)

            if (sources) {
                const closetSource = creep.pos.findClosestByRange(sources)!
                creep.memory.harvestSourceId = closetSource.id
                harvestSource(creep, closetSource)
                return HarvestResult.Ok
            } else {
                return HarvestResult.NoSource
            }
        }
    }
}
