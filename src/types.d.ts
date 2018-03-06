interface CreepMemory{
    /**角色 */
    role:string
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T;
}
