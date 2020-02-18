import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"
import { getHostileRoomObject } from "Room/RoomService"

/**房間守衛角色執行器 */
export class RoomGuard implements IRoleRuner {
    role = Role.RoomGuard
    run(creep: Creep) {
        const targets = getHostileRoomObject(creep.room)
        if (targets.length) {
            const target = creep.pos.findClosestByRange(targets)!
            creep.say("🔪")
            if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        }
    }
}
