interface CreepMemory {
    /**角色 */
    role: string
    /**工作 */
    job: string
    /**目標ID */
    targetId: string | null
}
/** 可用索引取得T */
interface ILookup<T> {
    [key: string]: T
}
interface RoomMemory {
    /**這個房間中需要補充能源的我方建築物ID的資料的更新時間 */
    myStructureIdNeedEnergyDataTime: number
    /**這個房間中需要補充能源的我方建築物ID */
    myStructureIdNeedEnergy: Array<string>
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any
    }
}
