/**快取資料 */
export class Cache<TValue> {
    constructor(valueFunc: () => TValue) {
        this._valueFunc = valueFunc
        this._value = valueFunc()
        this._updateTime = Game.time
    }
    private _value: TValue
    private _valueFunc: () => TValue
    private _updateTime: number
    get value() {
        if (this._updateTime < Game.time) {
            this._value = this._valueFunc()
            this._updateTime = Game.time
        }
        return this._value
    }
    get updateTime() {
        return this._updateTime
    }
    get forceUpdateValue() {
        this._value = this._valueFunc()
        this._updateTime = Game.time
        return this._value
    }
}
