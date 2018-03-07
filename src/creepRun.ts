import { IRoleRuner } from "roleRuner/roleRunner";
import { Builder } from "roleRuner/builder";
import { Harvester } from "roleRuner/harvester";

/** creep執行器 */
export class CreepRuner{
    /**註冊的執行器 */
    RoleRunners :ILookup<IRoleRuner> = {
        //harvester: new Harvester(),
        builder:new Builder()
    };
    /**執行creep */
    Run(creep:Creep){
        let roleRunner = this.RoleRunners[creep.memory.role]
        roleRunner.Run(creep);
    }
}

