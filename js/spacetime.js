class SpaceTime {
    constructor(opts = { timeDirection: 1, timeMultiplier: 1 }) {
        let direction = opts && opts.timeDirection || 1
        let multiplier = opts && opts.timeMultiplier || 1
        this._timeDirection = direction
        this._timeMultiplier = multiplier
    }

    get timeDirection() {
        return this._timeDirection
    }

    get timeMultiplier() {
        return this._timeMultiplier
    }

    set timeDirection(v) {
        this._timeDirection = v
    }

    set timeMultiplier(v) {
        this._timeMultiplier = v
        stars.forEach((s) => { s.dx = s.speed * this._timeMultiplier })
    }
}