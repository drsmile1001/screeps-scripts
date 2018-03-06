import { ErrorMapper } from "utils/ErrorMapper";
import {CreepRuner} from "creepRun"
const creepRuner = new CreepRuner();

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // 自動刪除消失creep的memory
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  //所有可用的creep進行動作
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    creepRuner.run(creep);
  }
});
