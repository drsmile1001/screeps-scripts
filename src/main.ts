import { runAllCreeps } from "Creep/CreepsRunnerManager"
import { logger } from "utils/Logger"
import { cleanMemory } from "Memory/MemoryManager"
import { runAllSpawners } from "Spawn/SpawnManager"
import "ConsoleCommand"
import { runAllRoom } from "Room/RoomRunner"
logger.log(`---程式碼更新---`)

export const loop = () => {
    try {
        cleanMemory()
        runAllSpawners()
        runAllCreeps()
        runAllRoom()
    } catch (e) {
        logger.error(e)
    }
}
