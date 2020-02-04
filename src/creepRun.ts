import { IRoleRuner } from "roleRuner/roleRunner"
import { Builder } from "roleRuner/builder"
import { Harvester } from "roleRuner/harvester"
import { Upgrader } from "roleRuner/Upgrader"

/** creep執行器 */
export class CreepRuner {
    /**註冊的執行器 */
    RoleRunners: ILookup<IRoleRuner> = {
        builder: new Builder(),
        harvester: new Harvester(),
        upgrader: new Upgrader()
    }
    /**執行creep */
    Run(creep: Creep) {
        let roleRunner = this.RoleRunners[creep.memory.role]
        roleRunner.Run(creep)
    }
}
