class SpaceEntity extends TemporalObject {
    constructor(opts = { speed: 0 }) {
        let speed = opts && opts.speed || 0

        super()

        this._debug = false
        this._speed = speed
        this.sprite = null
    }

    get debug() {
        return this._debug
    }

    get speed() {
        return this._speed
    }

    set debug(v) {
        this._debug = !!v
    }

    set speed(v) {
        if (v < 0)
            v = 0

        if (v > 3)
            v = 3

        this._speed = v
    }

    tick() {
        this._timeStates.push({
            x: this.sprite.x,
            y: this.sprite.y,
            dx: this.sprite.dx,
            dy: this.sprite.dy,
            speed: this.speed,
        })

        if (this.debug)
            console.log(`speed: ${this.speed}`)
    }

    restoreFromTick(t) {
        if (t >= 0 && t < this._timeStates.length) {
            this.sprite.x = this._timeStates[t].x
            this.sprite.y = this._timeStates[t].y
            this.sprite.dx = this._timeStates[t].dx
            this.sprite.dy = this._timeStates[t].dy
            this.sprite.speed = this._timeStates[t].speed
        }
    }
}