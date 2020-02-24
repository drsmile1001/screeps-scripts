import { IRoleRuner } from "./IRoleRuner"
import { Role } from "Creep/Role"

enum Job {
    PickEnergy = "pickEnergy",
    DeliverEnergy = "deliverEnergy"
}

/**能源派送角色執行器 */
export class Deliverer implements IRoleRuner {
    role = Role.SourceMiner
    run(creep: Creep) {
        while (true) {
            switch (creep.memory.job) {
                case Job.PickEnergy:
                    if (creep.memory.pickEnergyTargetId) {
                        const pickEnergyTarget = Game.getObjectById(creep.memory.pickEnergyTargetId)
                        //creep.
                    }
                case Job.DeliverEnergy:

                default:
                    creep.memory.job = Job.DeliverEnergy
                    continue
            }
        }
    }
}
