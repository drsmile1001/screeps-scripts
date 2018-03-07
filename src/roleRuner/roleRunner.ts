import { IJobRunner } from "job/IJobRunner";

/** 角色執行器 */
export interface IRoleRuner {
    /**註冊的執行器 */
    JobRunners: ILookup<IJobRunner>,
    /**執行器的角色 */
    Role: string,
    /** 命令creep */
    Run(creep: Creep): void,
    /**
     * 檢查並設定creep的工作
     * @param creep 檢查的creep
     * @returns {string} creep的工作
     */
    CheckJob(creep: Creep): string,
}



/**標準角色執行器 */
export abstract class RoleRunner implements IRoleRuner {
    abstract JobRunners: ILookup<IJobRunner>;
    abstract Role: string;
    /**
     * 檢查並設定creep的工作
     * @param creep 檢查的creep
     * @returns {string} creep的工作
     */
    abstract CheckJob(creep: Creep): string;
    /**註冊的執行器 */
    Run(creep: Creep): void {
        let jobState = this.CheckJob(creep);
        let jobRunner = this.JobRunners[jobState];
        creep.say(jobRunner.SayWord);
        jobRunner.Run(creep);
    }
}
