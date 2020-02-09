import { Role } from "Creep/Role"

type bodyParts = {
    [index in BodyPartConstant]?: number
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
    if (creepCount > 9) return

    const roleCountDic = _.mapValues(
        _.groupBy(allCreepRoles, x => x),
        roleArray => roleArray.length
    )

    if (creepCount == 0 || roleCountDic[Role.Harvester] * 3 <= roleCountDic[Role.Upgrader]) {
        tryToSpawn(
            spawn,
            {
                work: 1,
                move: 1,
                carry: 1
            },
            {
                role: Role.Harvester
            }
        )
    } else {
        tryToSpawn(
            spawn,
            {
                work: 1,
                move: 1,
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
