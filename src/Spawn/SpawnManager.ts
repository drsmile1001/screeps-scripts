import { Role } from "Creep/Role"
import { getHostileRoomObject } from "Room/RoomService"

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

function partsEnergy(parts: BodyPartConstant[]): number {
    return parts.map(part => bodyPartCost[part]).reduce((current, next) => current + next, 0)
}

function buildBodyParts(
    energyLimit: number,
    baseParts: BodyPartConstant[],
    extraPartsPattern: BodyPartConstant[][]
): BodyPartConstant[] | null {
    let bodyParts = baseParts
    let energyNeed = partsEnergy(bodyParts)
    if (energyNeed > energyLimit) return null

    const extraBodyPartGroupEnergys = extraPartsPattern.map(parts => partsEnergy(parts))
    for (let index = 0; ; index++) {
        if (index === extraPartsPattern.length) index = 0
        const bodyPartGroup = extraPartsPattern[index]
        const bodyPartGroupEnergy = extraBodyPartGroupEnergys[index]
        if (energyNeed + bodyPartGroupEnergy > energyLimit) break
        bodyParts = bodyParts.concat(bodyPartGroup)
        energyNeed = energyNeed + bodyPartGroupEnergy
        if (bodyParts.length >= 50) break
    }
    return bodyParts.slice(0, 50).reverse()
}
class RoomCreepStatus {
    constructor(room: Room) {
        //TODO:當所有creep都有homeRoom後改寫
        const creeps = room.find(FIND_MY_CREEPS)
        this._creeps = creeps.length
        this._roles = _.mapValues(
            _.groupBy(creeps, x => x.memory.role),
            roleArray => roleArray.length
        )
    }
    private _creeps: number
    private _roles: ILookup<number>
    get creeps(): number {
        return this._creeps
    }
    roles(role: Role) {
        return this._roles[role] || 0
    }
}

const allRoomStatus: ILookup<RoomCreepStatus> = {}

function getRoomStatus(room: Room) {
    return allRoomStatus[room.name] || (allRoomStatus[room.name] = new RoomCreepStatus(room))
}

function gerRoomCreepLimit(room: Room): number {
    return 12
}

function runSpawn(spawn: StructureSpawn) {
    if (spawn.spawning !== null) return
    const status = getRoomStatus(spawn.room)
    const roomLimit = gerRoomCreepLimit(spawn.room)
    if (status.creeps > roomLimit) return

    const energyLimit =
        spawn.room.energyAvailable +
        (spawn.room.energyCapacityAvailable - spawn.room.energyAvailable) * (status.creeps / roomLimit)
    if (getHostileRoomObject(spawn.room).length && status.roles(Role.RoomGuard) < 5 && status.creeps % 2 === 0) {
        const bodyParts = buildBodyParts(energyLimit, [ATTACK, MOVE, MOVE, TOUGH], [[ATTACK, MOVE, MOVE, TOUGH]])
        if (!bodyParts) return
        tryToSpawn(spawn, bodyParts, {
            homeRoom: spawn.room.name,
            role: Role.RoomGuard
        })
    } else if (status.creeps === 0 || status.roles(Role.Harvester) * 2 <= status.roles(Role.Upgrader)) {
        const bodyParts = buildBodyParts(
            energyLimit,
            [MOVE, CARRY, WORK],
            [
                [MOVE, WORK, WORK],
                [MOVE, WORK, CARRY]
            ]
        )
        if (!bodyParts) return
        tryToSpawn(spawn, bodyParts, {
            homeRoom: spawn.room.name,
            role: Role.Harvester
        })
    } else {
        const bodyParts = buildBodyParts(
            energyLimit,
            [CARRY, MOVE, WORK],
            [
                [MOVE, WORK, WORK],
                [MOVE, WORK, CARRY]
            ]
        )
        if (!bodyParts) return
        tryToSpawn(spawn, bodyParts, {
            homeRoom: spawn.room.name,
            role: Role.Upgrader
        })
    }
}

function tryToSpawn(spawn: StructureSpawn, bodyParts: BodyPartConstant[], memory: CreepMemory): void {
    const name = createCreepName(spawn)
    const trySpawn = spawn.spawnCreep(bodyParts, name, { memory: memory, dryRun: true })
    if (trySpawn == OK) spawn.spawnCreep(bodyParts, name, { memory: memory })
}

function createCreepName(spawn: StructureSpawn) {
    const sn = (spawn.room.memory.creepNumber || 0) + 1
    spawn.room.memory.creepNumber = sn
    return `${spawn.room.name}-${sn}`
}
