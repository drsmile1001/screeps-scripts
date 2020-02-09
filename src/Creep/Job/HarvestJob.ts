import { IJobRunner } from "Creep/Job/IJobRunner"

/**採集工作執行器 */
class HarvestJob implements IJobRunner {
    Job: string = "harvest"
    SayWord: string = "⛏️"
    PathColor: string = "#ffaa00"
    Run(creep: Creep): void {
        const sources = creep.room.find(FIND_SOURCES)
        if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[1], { visualizePathStyle: { stroke: this.PathColor } })
        }
    }
}

/**採集工作執行器實例 */
export const harvestJob = new HarvestJob()
