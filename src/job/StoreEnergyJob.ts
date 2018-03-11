import { Job, JobRunner, JobRunResult } from "job/JobRunner";
import { tool } from "tool";

/**
 * 儲存能量工作執行器
 */
class StoreEnergyJob implements JobRunner {
    Job = Job.StoreEnergy;
    PathColor = "#ffffff";
    Run(creep: Creep): JobRunResult {
        const target = this.FindStoreEnergyTarget(creep);
        if (!target) {
            return JobRunResult.NoSuitableTarget;
        }
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
            creep.moveTo(target, { visualizePathStyle: { stroke: this.PathColor } });
        return JobRunResult.OK;
    }
    /**
     * 找要存能源的目標
     * @param creep 要查詢的參考creep
     */
    FindStoreEnergyTarget(creep: Creep): AnyOwnedStructure | null {
        const targets = tool.FindMyStructureIdNeedEnergy(creep.room);
        if (targets.length)
            return targets[0];
        return null;
    }
}
/**
 * 儲存能量工作執行器實例
 */
export const storeEnergyJob = new StoreEnergyJob();
