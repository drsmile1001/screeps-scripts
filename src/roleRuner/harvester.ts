import { RoleRunner } from "roleRuner/roleRunner";
import { HarvestJob } from "job/HarvestJob";
import { IJobRunner } from "job/IJobRunner";

/**採集者執行器 */
export class Harvester extends RoleRunner {
    JobRunners: ILookup<IJobRunner> = {
        harvester: new HarvestJob()

    };
    Role: string = "harvester";
    CheckJob(creep: Creep): string {
        throw new Error("Method not implemented.");
    }
}
