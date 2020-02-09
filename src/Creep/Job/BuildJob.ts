import { IJobRunner } from "Creep/Job/IJobRunner"

/**建造工作執行器 */
class BuildJob implements IJobRunner {
    Job: string = "build"
    SayWord: string = "🚧"
    PathColor: string = "#ffffff"
    Run(creep: Creep): void {
        const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { visualizePathStyle: { stroke: this.PathColor } })
            }
        }
    }
}
/**建造工作執行器實例 */
export const buildJob = new BuildJob()
