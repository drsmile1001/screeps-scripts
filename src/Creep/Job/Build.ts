export enum BuildResult {
    Ok,
    NoEnergy,
    NoTarget,
    Done
}

function buildConstructionSite(creep: Creep, target: ConstructionSite) {
    creep.say("🚧")
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ddffdd" } })
    }
}

export function build(creep: Creep, once: boolean = false): BuildResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return BuildResult.NoEnergy
    while (true) {
        if (creep.memory.buildTargetId) {
            let constructionSite = Game.getObjectById<ConstructionSite>(creep.memory.buildTargetId)
            if (!constructionSite) {
                delete creep.memory.buildTargetId
                if (once) continue
                else return BuildResult.Done
            }
            else {
                buildConstructionSite(creep, constructionSite)
                return BuildResult.Ok
            }
        }
        else {
            const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
            if (targets.length) {
                creep.memory.buildTargetId = targets[0].id
                buildConstructionSite(creep, targets[0])
                return BuildResult.Ok
            }
            else return BuildResult.NoTarget
        }
    }
}
