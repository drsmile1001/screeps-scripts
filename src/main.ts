import { ErrorMapper } from "utils/ErrorMapper";
import { CreepRuner } from "creepRun";
import { TowerRunner } from "towerRunner";
import { tool } from "tool";

const creepRuner = new CreepRuner();

export const loop = ErrorMapper.wrapLoop(() => {
    console.log(`Current game tick is ${Game.time}`);

    // 自動刪除消失creep的memory
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }

    //嘗試執行塔動作
    TowerRunner();

    //所有可用的creep進行動作
    tool.Creeps.forEach(creep => creepRuner.Run(creep));

});
