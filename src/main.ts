import { ErrorMapper } from "utils/ErrorMapper"
import { CreepRuner } from "creepRun"
import { TowerRunner } from "towerRunner"
import { tool } from "tool"
import { creepSpawner } from "CreepSpawner"
import { StopWatch } from "cpu/StopWatch"

const creepRuner = new CreepRuner()
console.log("---程式碼更新---")
export const loop = ErrorMapper.wrapLoop(() => {
    // 自動刪除消失creep的memory
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name]
        }
    }

    //嘗試執行塔動作
    // TowerRunner();
    // //生產creep
    creepSpawner.Run()
    // //所有可用的creep進行動作
    for (const name in Game.creeps) {
        const creep = Game.creeps[name]
        creepRuner.Run(creep)
    }
})
