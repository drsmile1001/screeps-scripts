import { Job, JobRunner, JobRunResult } from "job/JobRunner";

/**
 * 待機工作執行器
 */
class SleepJob implements JobRunner {
    Job = Job.Sleep;
    Run(creep: Creep): JobRunResult {
        return JobRunResult.OK;
    }
}

/**
 * 待機工作執行器實例
 */
export const sleepJob = new SleepJob();
