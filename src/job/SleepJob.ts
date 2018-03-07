import { IJobRunner } from "job/IJobRunner";

/**待機工作執行器 */
class SleepJob implements IJobRunner {
    Job = "sleep";
    SayWord = "💤";
    PathColor = null;
    Run(creep: Creep): void {}
}
/** 待機工作執行器實例 */
export const sleepJob = new SleepJob;

