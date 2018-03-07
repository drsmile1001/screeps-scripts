import { IJobRunner } from "./IJobRunner";

/**升級工作執行器 */
class UpgradJob implements IJobRunner {
    Job: string ="upgrad";
    SayWord: string = "⚡";
    PathColor: string = "#ffffff";
    Run(creep: Creep): void {
        if(creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: this.PathColor}});
        }
    }
}
/**升級工作執行器實例 */
export const upgradJob = new UpgradJob();
