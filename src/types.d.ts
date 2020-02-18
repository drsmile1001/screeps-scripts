interface CreepMemory {
    homeRoom: string
    /**角色 */
    role: import("Creep/Role").Role
    job?: string
    transferEnergyTargetId?: string
    harvestSourceId?: string
    buildTargetId?: string
    repairTargetId?: string
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T
}
interface RoomMemory {
    /**房間的source id集合 */
    sources: ILookup<SourceMemory>
    hostileCreeps: ILookup<HostileCreepMemory>
    creepNumber: number
}
interface SourceMemory {
    creepLimit: number
}
interface HostileCreepMemory {
    body: BodyPartDefinition[]
    hits: number
    hitsMax: number
    x: number
    y: number
}

declare namespace NodeJS {
    interface Global {
        removeFlags: any
        testPath: any
        test: any
    }
}
