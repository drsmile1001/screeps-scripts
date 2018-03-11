import { Builder } from "roleRuner/builder";
import { Harvester } from "roleRuner/harvester";
import { Role, RoleRunner } from "roleRuner/roleRunner";
import { Upgrader } from "roleRuner/Upgrader";

/** creep執行器 */
export class CreepRuner {
    /**
     * 註冊的執行器
     */
    RoleRunners: ILookup<RoleRunner> = {
        [Role.Builder]: new Builder(),
        [Role.Harvester]: new Harvester(),
        [Role.Upgrader]: new Upgrader()
    };
    /**
     * 執行creep
     */
    Run(creep: Creep) {
        const roleRunner = this.RoleRunners[creep.memory.role];
        roleRunner.Run(creep);
    }
}
