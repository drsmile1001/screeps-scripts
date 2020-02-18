import { ErrorMapper } from "utils/ErrorMapper"
import { runAllCreeps } from "Creep/CreepsRunnerManager"
import { logger } from "utils/Logger"
import { updateMemory, cleanMemory } from "Memory/MemoryManager"
import { runAllSpawners } from "Spawn/SpawnManager"
import "ConsoleCommand"
logger.log(`---程式碼更新 時間${Game.time}---`)

updateMemory()
export const loop = ErrorMapper.wrapLoop(() => {
    cleanMemory()
    //嘗試執行塔動作
    // TowerRunner();
    runAllSpawners()
    runAllCreeps()
})
