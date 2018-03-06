import { RoleRuner } from "roleRuner/roleRunner";
import { Builder } from "roleRuner/builder";
import { Harvester } from "roleRuner/harvester";

/** creep執行器 */
export class CreepRuner{
    /**註冊的執行器 */
    roleRunners :ILookup<RoleRuner> = {
        harvester: new Harvester(),
        builder:new Builder()
    };
    /**執行creep */
    run(creep:Creep){
        let roleRunner = this.roleRunners[creep.memory.role]
        roleRunner.Run(creep);
    }
}

