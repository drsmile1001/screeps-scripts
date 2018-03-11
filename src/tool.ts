class Tool {
    /**
     * 房間中我方需要能量的建築物資料
     */
    MyStructureNeedEnergyData: ILookup<{
        DataTime: number,
        Structures: AnyOwnedStructure[]
    }> = {};
    /**
     * 取得房間中我方需要能量的建築物
     * @param room 房間
     */
    FindMyStructureIdNeedEnergy(room: Room): AnyOwnedStructure[] {
        // 取得資料物件
        let data = this.MyStructureNeedEnergyData[room.name];
        if (data === undefined) {
            this.MyStructureNeedEnergyData[room.name] = {
                DataTime: 0,
                Structures: []
            };
            data = this.MyStructureNeedEnergyData[room.name];
        }

        // 檢查資料時間
        const needUpdateData = data.DataTime < Game.time;

        // 更新資料
        if (needUpdateData) {
            const structures = room.find(FIND_MY_STRUCTURES, {
                filter: s => {
                    return (s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER) &&
                        s.energy < s.energyCapacity;
                }
            });
            data.DataTime = Game.time;
            data.Structures = structures;
        }
        return data.Structures;
    }
    /**
     * 某房間下的source
     */
    RoomSourcesData: ILookup<Source[]> = {};
    /**
     * 查詢某房間下的source
     */
    FindSource(room: Room) {
        const sources = this.RoomSourcesData[room.name];
        if (sources)
            return sources;
        const newSources = room.find(FIND_SOURCES);
        this.RoomSourcesData[room.name] = newSources;

        return newSources;
    }
}

export const tool = new Tool();
