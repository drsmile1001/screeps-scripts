export enum HarvestResult {
    Ok,
    FullEnergy,
    NoSource
}
function harvestSource(creep: Creep, source: Source) {
    creep.say("⛏️")
    if (creep.harvest(source) === ERR_NOT_IN_RANGE)
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } })
}

export function harvest(creep: Creep): HarvestResult {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0)
        return HarvestResult.FullEnergy
    while (true) {
        if (creep.memory.harvestSourceId) {
            const source = Game.getObjectById<Source>(creep.memory.harvestSourceId)
            if (!source) {
                delete creep.memory.harvestSourceId
                continue
            }
            else {
                harvestSource(creep, source)
                return HarvestResult.Ok
            }
        }
        else {
            const sourceCreeps: ILookup<number> = {};
            _.map(Game.creeps, creep => creep.memory)
                .forEach(cm => {
                    if (cm.harvestSourceId) {
                        sourceCreeps[cm.harvestSourceId] = (sourceCreeps[cm.harvestSourceId] || 0) + 1
                    }
                })

            const id = _.map(creep.room.memory.sources, (sourceMemory, sourceId) => (
                {
                    creepLimit: sourceMemory.creepLimit,
                    sourceId: sourceId!
                }
            )).find(item => (sourceCreeps[item.sourceId] || 0) < item.creepLimit)?.sourceId
            if (id) {
                creep.memory.harvestSourceId = id
                continue
            }
            else {
                return HarvestResult.NoSource
            }
        }
    }
}
