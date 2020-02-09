import { Role } from "Creep/Role"

/** 角色執行器 */
export interface IRoleRuner {
    /**名稱 */
    readonly role: Role
    /** 命令creep */
    run(creep: Creep): void
}
