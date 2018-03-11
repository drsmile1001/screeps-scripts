import { Job, JobRunResult } from "./JobRunner";
import { JobTransition } from "./JobTransition";

/**
 * 工作轉移表
 */
export class JobTransitionTable {
    constructor(transitions: JobTransition[]) {
        transitions.forEach(transition => {
            let jobObject = this.data[transition.Job];
            if (jobObject === undefined) {
                this.data[transition.Job] = {};
                jobObject = this.data[transition.Job];
            }
            jobObject[transition.JobRunResult] = transition.NextJob;
        });
    }
    private data: ILookup<ILookup<Job>> = {};
    /**
     * 找到下一個要執行的工作
     * @param job 當前工作
     * @param jobRunResult 當前工作執行結果
     */
    GetNextJob(job: Job, jobRunResult: JobRunResult): Job | null {
        const jobData = this.data[job];
        if (jobData === undefined)
            return null;
        const jobRunResultData = jobData[jobRunResult];
        if (jobRunResultData === undefined)
            return null;
        return jobRunResultData;
    }
}
