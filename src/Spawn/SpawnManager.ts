import { Role } from "Creep/Role"
import { hostileRoomObjects, roomStructures } from "Room/RoomService"
import { Cache } from "utils/Cache"
import { LazyMap } from "utils/LazyMap"

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

const roomStatus = new LazyMap<string, Cache<RoomCreepStatus>>(
    name =>
        new Cache(() => {
            return new RoomCreepStatus(Game.rooms[name])
        })
)

function gerRoomCreepLimit(roomName: string): number {
    return 9
}

function runSpawn(spawn: StructureSpawn) {
    if (spawn.spawning !== null) return
    const room = spawn.room
    const status = roomStatus.get(room.name).value
    const roomLimit = gerRoomCreepLimit(room.name)
    const hasHostile = hostileRoomObjects.get(room.name).value.length > 0
    const energyLimit =
        room.energyAvailable //+ (room.energyCapacityAvailable - room.energyAvailable) * (status.creeps / roomLimit)
    if (hasHostile && status.roles(Role.RoomGuard) < 5) {
        spawnRoomGuard(spawn, energyLimit)
        return
    }
    if (status.creeps >= roomLimit) return
    if (status.creeps === 0) {
        spawnHarvester(spawn, energyLimit)
        return
    }
    if (status.roles(Role.Upgrader) === 0) {
        spawnUpgrader(spawn, energyLimit)
        return
    }
    const containerCount = roomStructures.get(room.name).value.filter(s => s.structureType === STRUCTURE_CONTAINER)
        .length
    if (status.roles(Role.SourceMiner) < containerCount) {
        spawnEnergyMiner(spawn, energyLimit)
        return
    }
    if (containerCount === 0 || status.roles(Role.Harvester) < 2) {
        spawnHarvester(spawn, energyLimit)
        return
    }
    if (status.roles(Role.RoomGuard) < 2) {
        spawnRoomGuard(spawn, energyLimit)
        return
    }
    spawnHarvester(spawn, energyLimit)
    return
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

function spawnHarvester(spawn: StructureSpawn, energyLimit: number) {
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
}

function spawnUpgrader(spawn: StructureSpawn, energyLimit: number) {
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

function spawnRoomGuard(spawn: StructureSpawn, energyLimit: number) {
    const bodyParts = buildBodyParts(energyLimit, [ATTACK, MOVE, MOVE, TOUGH], [[MOVE, ATTACK, MOVE, TOUGH]])
    if (!bodyParts) return
    tryToSpawn(spawn, bodyParts, {
        homeRoom: spawn.room.name,
        role: Role.RoomGuard
    })
}

function spawnEnergyMiner(spawn: StructureSpawn, energyLimit: number) {
    const tiers = [
        [CARRY, MOVE, WORK], //200
        [CARRY, MOVE, WORK, WORK], //300
        [CARRY, MOVE, WORK, WORK, WORK], // 400
        [CARRY, MOVE, WORK, WORK, WORK, WORK], //500
        [CARRY, MOVE, WORK, WORK, WORK, WORK, WORK] //600
    ]
    let tierIndex = -1
    for (let index = 0; index < tiers.length; index++) {
        if (partsEnergy(tiers[index]) <= energyLimit) tierIndex = index
        else break
    }
    if (tierIndex < 0) return
    tryToSpawn(spawn, tiers[tierIndex].reverse(), {
        homeRoom: spawn.room.name,
        role: Role.SourceMiner
    })
}
