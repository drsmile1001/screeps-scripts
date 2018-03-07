import { IJobRunner } from "job/IJobRunner";

/**儲存能量工作執行器 */
class StoreEnergyJob implements IJobRunner {
    Job = "storeEnergy";
    SayWord = "⭐";
    PathColor = "#ffffff";
    Run(creep: Creep): void {
        var target = Game.getObjectById<Structure>(creep.memory.targetId || "");
        if (!target) {
            creep.memory.job = "sleep";
            return;
        }
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, { visualizePathStyle: { stroke: this.PathColor } });
        }
    }
}
/**儲存能量工作執行器實例 */
export const storeEnergyJob = new StoreEnergyJob();
