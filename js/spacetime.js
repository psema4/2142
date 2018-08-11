class SpaceTime {
    constructor(opts = { timeDirection: 1, timeMultiplier: 1 }) {
        let direction = opts && opts.timeDirection || 1
        let multiplier = opts && opts.timeMultiplier || 1

        this._debug = false
        this._time = 0
        this._targetTime = 0
        this._timeDirection = direction
        this._timeMultiplier = multiplier
    }

    get debug() {
        return this._debug
    }

    get time() {
        return this._time
    }

    get targetTime() {
        return this._targetTime
    }

    set debug(v) {
        this._debug = !!v
    }

    get timeDirection() {
        return this._timeDirection
    }

    get timeMultiplier() {
        return this._timeMultiplier
    }

    set targetTime(t) {
        this._targetTime = t;
        if (this._targetTime < 0)
            this._targetTime = 0
    }

    set timeDirection(v) {
        this._timeDirection = v
        stars.forEach((s) => { s.dx = s.speed * ( -1 * this._timeDirection * this._timeMultiplier) })
    }

    set timeMultiplier(v) {
        this._timeMultiplier = v
        stars.forEach((s) => { s.dx = s.speed * ( -1 * this._timeDirection * this._timeMultiplier) })
    }

    tick() {
        if (this.timeDirection == 1) {
            this._time += 1
            player.tick()

        } else {
            this._time -= 1

            if (this._time <= this.targetTime) {
                this.timeDirection = 1
            }

            player.restoreFromTick(this._time)
            player.popTimeState()
        }

        if (this.debug)
            console.log(`time: ${this.time}, direction: ${this.timeDirection}, target: ${this.targetTime}`)
    }
}