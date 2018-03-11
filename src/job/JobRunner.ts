export enum Job {
    Build = "build",
    Harvest = "harvest",
    Sleep = "sleep",
    StoreEnergy = "storeEnergy",
    Upgrad = "upgrad",
    FindConstructionSites = "findConstructionSites"
}

export enum JobRunResult {
    OK = "ok",
    NoSuitableTarget = "noSuitableTarget",
    OutOfEnergy = "outOfEnergy",
    CarryEnergyFull = "carryEnergyFull"
}

/** 工作執行器 */
export interface JobRunner {
    /**
     * 工作
     */
    Job: Job;
    /**
     * 執行工作方法
     * @param creep 被執行的creep
     */
    Run(creep: Creep): JobRunResult;
}

export abstract class JobRunnerBase implements JobRunner {
    /**
     * 工作
     */
    Job: Job = Job.Build;
    /**
     * 執行工作方法
     * @param creep 被執行的creep
     */
    abstract Run(creep: Creep): JobRunResult;
}
