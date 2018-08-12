class Player extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        super(opts)

        this._artifacts = []

        this.sprite = kontra.sprite({
            x: Math.floor(kontra.canvas.width / 2) - 20,
            y: Math.floor(kontra.canvas.height / 2) - 10,
            color: '#00DD00',
            width: 40,
            height: 20,
            dx: 0,
            radius: 2,
        })
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

    addArtifact(v) {
        this._artifacts.push(v)
    }

    hasArtifact(v) {
        return this._artifacts.includes(v);
    }
}