import { runAtLoop } from "utils/GameTick"

export enum UpgradeControllerResult {
    Ok,
    NoEnergy,
    NoTarget
}
export function upgradeController(creep: Creep): UpgradeControllerResult {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return UpgradeControllerResult.NoEnergy
    if (!creep.room.controller) return UpgradeControllerResult.NoTarget
    const result = creep.upgradeController(creep.room.controller)
    switch (result) {
        case ERR_NOT_IN_RANGE:
            runAtLoop(3, () => creep.say("🔱"), creep.ticksToLive)
            creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } })
            break
        case OK:
            break
        default:
            creep.say("❌")
            console.log(`${creep.name} 在upgradeController時錯誤 ${result}`)
            break
    }
    return UpgradeControllerResult.Ok
}
