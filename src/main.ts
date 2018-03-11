import { CreepRuner } from "creepRun";
import { creepSpawner } from "CreepSpawner";
import { tool } from "tool";
import { TowerRunner } from "towerRunner";
import { ErrorMapper } from "utils/ErrorMapper";

const creepRuner = new CreepRuner();

export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);
    // 自動刪除消失creep的memory
    for (const name in Memory.creeps)
        if (!(name in Game.creeps))
            delete Memory.creeps[name];

    // 嘗試執行塔動作
    TowerRunner();
    // 生產creep
    creepSpawner.Run();
    // 所有可用的creep進行動作
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        creepRuner.Run(creep);
    }
});
