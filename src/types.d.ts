interface CreepMemory {
    homeRoom: string
    /**角色 */
    role: import("Creep/Role").Role
    job?: string
    transferEnergyTargetId?: string
    harvestSourceId?: string
    buildTargetId?: string
    repairTargetId?: string
    pickEnergyTargetId?: string
    storeEnergyContainerId?: string
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T
}
interface RoomMemory {
    creepNumber: number
}

declare namespace NodeJS {
    interface Global {
        removeFlags: any
        test: any
    }
}
