interface CreepMemory {
    /**角色 */
    role: import("Creep/Role").Role
    job?: string
    transferEnergyTargetId?: string
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T
}
interface RoomMemory {
    /**房間的source id集合 */
    sources?: SourceMemory[]
}

interface SourceMemory {
    id: string
}
