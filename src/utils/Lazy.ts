export class Lazy<TValue> {
    private _valueBuilder: () => TValue
    private _value?: TValue

    constructor(valueBuilder: () => TValue) {
        this._valueBuilder = valueBuilder
    }

    get value(): TValue {
        if (this._value === undefined) {
            this._value = this._valueBuilder()
        }
        return this._value
    }
}
