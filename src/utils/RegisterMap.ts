/** * creep 註冊項目反查字典 用以查詢某註冊至creep記憶體的項目，其項目註冊的creep集合 */
export class CreepRegisterMap<TKey extends string | number>{
    private _map: Map<TKey, string[]>
    constructor(selector: (memory: CreepMemory) => TKey | undefined) {
        const map = new Map<TKey, string[]>()
        for (const creepName in Game.creeps) {
            const value = selector(Game.creeps[creepName].memory)
            if (value === undefined) continue
            const list = map.get(value)
            if (list === undefined) {
                map.set(value, [creepName])
                continue
            }
            list.push(creepName)
        }
        this._map = map;
    }
    /**查詢某項目註冊的creep名稱集合 */
    get(key: TKey): string[] {
        return this._map.get(key) ?? []
    }
}
