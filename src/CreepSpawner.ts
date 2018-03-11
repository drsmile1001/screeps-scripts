import { Job } from "job/JobRunner";
import { Role } from "roleRuner/roleRunner";
import { tool } from "tool";
class CreepSpawner {
    Spawner = Game.spawns.Spawn1;
    Run(): void {
        if (this.Spawner.spawning)
            return;
        const allRoles = _.map(Game.creeps, creep => creep.memory.role);
        const creepCount = Object.keys(Game.creeps).length;
        const harvesterCount = allRoles.filter(role => role === Role.Harvester).length;

        if (harvesterCount === 0)
            this.TryToSpawn({ Work: 1, Move: 1, Carry: 1 }, {
                job: Job.Harvest,
                role: Role.Harvester,
                targetId: null
            });
        else if (creepCount <= 10 && creepCount % 3 !== 1)
            this.TryToSpawn({ Work: 1, Move: 1, Carry: 1 }, {
                job: Job.Harvest,
                role: Role.Upgrader,
                targetId: null
            });
        else if (creepCount <= 10 && creepCount % 3 === 1)
            this.TryToSpawn({ Work: 1, Move: 2, Carry: 1 }, {
                job: Job.Harvest,
                role: Role.Harvester,
                targetId: null
            });
    }
    TryToSpawn(bodyParts: BodyPartArg, memory: CreepMemory): void {
        const newName = this.NewCreepName();
        const parts = this.BodyPartsArray(bodyParts);
        const trySpawn = this.Spawner.spawnCreep(parts, newName, { memory, dryRun: true });
        if (trySpawn === OK)
            this.Spawner.spawnCreep(parts, newName, { memory });

    }
    NewCreepName(): string {
        return `Creep${Game.time}`;
    }
    BodyPartsArray(parts: BodyPartArg): BodyPartConstant[] {
        let result = Array<BodyPartConstant>();
        if (parts.Tough)
            result = result.concat(Array(parts.Tough).fill(TOUGH) as BodyPartConstant[]);
        if (parts.Carry)
            result = result.concat(Array(parts.Carry).fill(CARRY) as BodyPartConstant[]);
        if (parts.Work)
            result = result.concat(Array(parts.Work).fill(WORK) as BodyPartConstant[]);
        if (parts.Claim)
            result = result.concat(Array(parts.Claim).fill(CLAIM) as BodyPartConstant[]);
        if (parts.Heal)
            result = result.concat(Array(parts.Heal).fill(HEAL) as BodyPartConstant[]);
        if (parts.Attack)
            result = result.concat(Array(parts.Attack).fill(ATTACK) as BodyPartConstant[]);
        if (parts.Move)
            result = result.concat(Array(parts.Move).fill(MOVE) as BodyPartConstant[]);
        if (parts.RangedAttack)
            result = result.concat(Array(parts.RangedAttack).fill(RANGED_ATTACK) as BodyPartConstant[]);
        return result;
    }
}

interface BodyPartArg {
    Work?: number;
    Move?: number;
    Carry?: number;
    Attack?: number;
    RangedAttack?: number;
    Heal?: number;
    Tough?: number;
    Claim?: number;
}

export const creepSpawner = new CreepSpawner();
