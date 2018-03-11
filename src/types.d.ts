declare const require: (module: string) => any;

interface CreepMemory {
    /**角色 */
    role: string,
    /**工作 */
    job: string | undefined,
    /**目標ID */
    targetId:string | null,
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T;
}
