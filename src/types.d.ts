interface CreepMemory {
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
}
interface SourceMemory {
    creepLimit: number
}
// interface StoreEnergy {
//     store: Store<RESOURCE_ENERGY, false>;
// }
// interface StructureTower extends StoreEnergy {

// }
// interface StructureExtension extends StoreEnergy {

// }
// interface StructureSpawn extends StoreEnergy {

// }
