import { Role } from "Creep/Role"

type bodyParts = {
    [index in BodyPartConstant]?: number
}

/**creep  */
const bodyPartCost = {
    [MOVE]: 50,
    [WORK]: 100,
    [CARRY]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250,
    [CLAIM]: 600,
    [TOUGH]: 10
}

/**執行所有spawn */
export function runAllSpawners() {
    for (const name in Game.spawns) {
        const spawn = Game.spawns[name]
        runSpawn(spawn)
    }
}

function runSpawn(spawn: StructureSpawn) {
    if (spawn.spawning !== null) return
    const allCreepRoles = _.map(Game.creeps, creep => creep.memory.role)
    const creepCount = allCreepRoles.length
    if (creepCount > 12) return

    const energyLimit = spawn.room.energyCapacityAvailable

    const roleCountDic = _.mapValues(
        _.groupBy(allCreepRoles, x => x),
        roleArray => roleArray.length
    )

    if (creepCount == 0 || (roleCountDic[Role.Harvester] || 0) * 4 <= (roleCountDic[Role.Upgrader] || 0)) {
        const baseEnergy = bodyPartCost.work + bodyPartCost.move + bodyPartCost.carry * 2
        const extraEnergy = energyLimit - baseEnergy
        const extraPartEnergy = bodyPartCost.work + bodyPartCost.move
        const extraPartCounts = Math.max(Math.floor(extraEnergy / extraPartEnergy), 0)
        tryToSpawn(
            spawn,
            {
                work: 1 + extraPartCounts,
                move: 2 + extraPartCounts,
                carry: 1
            },
            {
                role: Role.Harvester
            }
        )
    } else {
        const baseEnergy = bodyPartCost.work + bodyPartCost.move + bodyPartCost.carry * 2
        const extraEnergy = energyLimit - baseEnergy
        const extraPartEnergy = bodyPartCost.work + bodyPartCost.move
        const extraPartCounts = Math.max(Math.floor(extraEnergy / extraPartEnergy), 0)
        tryToSpawn(
            spawn,
            {
                work: 1 + extraPartCounts,
                move: 2 + extraPartCounts,
                carry: 1
            },
            {
                role: Role.Upgrader
            }
        )
    }
}

function tryToSpawn(spawn: StructureSpawn, bodyParts: bodyParts, memory: CreepMemory): void {
    const name = createCreepName(spawn)
    const parts = buildBodyParts(bodyParts)
    const trySpawn = spawn.spawnCreep(parts, name, { memory: memory, dryRun: true })
    if (trySpawn == OK) spawn.spawnCreep(parts, name, { memory: memory })
}

function createCreepName(spawn: StructureSpawn) {
    return `${spawn.name}-${Game.time}`
}

function buildBodyParts(parts: bodyParts): BodyPartConstant[] {
    let result: BodyPartConstant[] = []
    for (const part in parts) {
        const count = parts[<BodyPartConstant>part]
        if (count) result = result.concat(Array(count).fill(part))
    }
    return result
}
