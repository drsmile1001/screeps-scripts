/**
 * 塔執行器
 */
export function TowerRunner() {
    const tower = Game.getObjectById<StructureTower>("17457095ecb1443ca5615098");
    if (tower) {
        const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure)
            tower.repair(closestDamagedStructure);

        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile)
            tower.attack(closestHostile);
    }
}
