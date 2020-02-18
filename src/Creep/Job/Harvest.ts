import { runAtLoop } from "utils/GameTick"

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
            console.log(`${creep.name} 在harvestSource時錯誤 ${result}`)
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
            const sourceCreeps: ILookup<number> = {}
            _.map(Game.creeps, creep => creep.memory).forEach(cm => {
                if (cm.harvestSourceId) {
                    sourceCreeps[cm.harvestSourceId] = (sourceCreeps[cm.harvestSourceId] || 0) + 1
                }
            })

            const sourceData = _.map(creep.room.memory.sources, (sourceMemory, sourceId) => ({
                creepLimit: sourceMemory.creepLimit,
                sourceId: sourceId!
            })).find(
                source =>
                    (sourceCreeps[source.sourceId] || 0) < source.creepLimit &&
                    (Game.getObjectById<Source>(source.sourceId)?.energy ?? 0) > 0
            )
            if (sourceData) {
                creep.memory.harvestSourceId = sourceData.sourceId
                continue
            } else {
                return HarvestResult.NoSource
            }
        }
    }
}
