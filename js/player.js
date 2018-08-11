class Player {
    constructor(opts = { speed: 0 }) {
        let speed = opts && opts.speed || 0

        this._debug = false
        this._timeStates = []
        this._speed = speed

        this.sprite = kontra.sprite({
            x: Math.floor(kontra.canvas.width / 2) - 20,
            y: Math.floor(kontra.canvas.height / 2) - 10,
            color: '#00DD00',
            width: 40,
            height: 20,
            dx: 0
        })
    }

    get debug() {
        return this._debug
    }

    get timeStates() {
        return this._timeStates;
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

    popTimeState() {
        this._timeStates.pop()
    }
}