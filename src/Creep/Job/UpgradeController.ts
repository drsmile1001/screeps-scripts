export enum UpgradeControllerResult {
    Ok,
    NoEnergy
}
export function upgradeController(creep: Creep) {
    if (!creep.store.getUsedCapacity(RESOURCE_ENERGY)) return UpgradeControllerResult.NoEnergy
    creep.say("🔱")
    if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } })
    }
    return UpgradeControllerResult.Ok
}
