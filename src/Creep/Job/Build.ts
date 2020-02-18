import { runAtLoop } from "utils/GameTick"

export enum BuildResult {
    Ok,
    NoEnergy,
    NoTarget,
    Done
}

function buildConstructionSite(creep: Creep, target: ConstructionSite) {
    const result = creep.build(target)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("🚧"), creep.ticksToLive)
            creep.moveTo(target, { visualizePathStyle: { stroke: "#ddffdd" } })
            return
        case OK:
            return
        default:
            creep.say("❌")
            console.log(`${creep.name} 在buildConstructionSite時錯誤 ${result}`)
            return
    }
}

export function build(creep: Creep, once: boolean = false): BuildResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return BuildResult.NoEnergy
    while (true) {
        if (creep.memory.buildTargetId) {
            const constructionSite = Game.getObjectById<ConstructionSite>(creep.memory.buildTargetId)
            if (!constructionSite) {
                delete creep.memory.buildTargetId
                if (once) return BuildResult.Done
                else continue
            } else {
                buildConstructionSite(creep, constructionSite)
                return BuildResult.Ok
            }
        } else {
            const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
            if (targets.length) {
                creep.memory.buildTargetId = targets[0].id
                buildConstructionSite(creep, targets[0])
                return BuildResult.Ok
            } else return BuildResult.NoTarget
        }
    }
}
