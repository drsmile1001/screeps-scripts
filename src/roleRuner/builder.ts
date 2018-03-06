import {RoleRuner} from "roleRuner/roleRunner"
/**建築角色執行器 */
export class Builder implements RoleRuner{
    Role = "builder";
    Run(creep:Creep){
        console.log(`${creep.id} is ${this.Role}`);
    }
}
