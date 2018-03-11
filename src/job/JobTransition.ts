import { Job, JobRunResult } from "job/JobRunner";

export class JobTransition {
    Job: Job;
    JobRunResult: JobRunResult;
    NextJob: Job;
    constructor(job: Job, jobRunResult: JobRunResult, nextJob: Job) {
        this.Job = job;
        this.JobRunResult = jobRunResult;
        this.NextJob = nextJob;
    }
}
