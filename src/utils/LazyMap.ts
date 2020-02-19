export class LazyMap<TKey, TValue> {
    private _valueBuilder: (key: TKey) => TValue
    private _map: Map<TKey, TValue>
    constructor(valueBuilder: (key: TKey) => TValue) {
        this._valueBuilder = valueBuilder
        this._map = new Map()
    }
    get(key: TKey): TValue {
        let value = this._map.get(key)
        if (value === undefined) {
            value = this._valueBuilder(key)
            this._map.set(key, value)
        }
        return value
    }
}
