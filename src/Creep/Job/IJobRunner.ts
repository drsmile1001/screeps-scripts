/** 工作執行器 */
export interface IJobRunner {
    Job: string,
    SayWord: string,
    PathColor: string | null,
    Run(creep: Creep): void
}
