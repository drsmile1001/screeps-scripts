import { RoleRuner } from "./roleRunner";
/**採集者執行器 */
export class Harvester implements RoleRuner{
    Role = "harvester";
    Run(creep:Creep){
        console.log(`${creep.id} is ${this.Role}`);
    }
}
