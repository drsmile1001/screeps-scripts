/** 工作執行器 */
export interface IJobRunner {
    Job: string,
    SayWord: string,
    PathColor: string,
    Run(creep: Creep): void
}
