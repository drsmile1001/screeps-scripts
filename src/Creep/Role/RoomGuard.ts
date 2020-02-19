import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { hostileRoomObjects } from "Room/RoomService"

/**房間守衛角色執行器 */
export class RoomGuard implements IRoleRuner {
    role = Role.RoomGuard
    run(creep: Creep) {
        const targets = hostileRoomObjects.get(creep.room.name).value
        if (targets.length) {
            const target = creep.pos.findClosestByRange(targets)!
            creep.say("🔪")
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        } else {
            const ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_RAMPART
            })
            if (ramparts.length) creep.moveTo(ramparts[0])
        }
    }
}
