class Powerup extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        if (opts.startSpeed)
            opts.speed = opts.startSpeed
        else
            opts.startSpeed = opts.speed || 0

        super(opts)

        this.sprite = kontra.sprite({
            x: opts.startX,
            y: opts.startY,
            color: opts.color,
            width: opts.size,
            height: opts.size,
            dx: /* TOFE.state === 'playing' && */ -1 * opts.startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
            radius: opts.radius || 2,
            speed: opts.startSpeed,
        })
    }

    onCollideWithPlayer() {
        console.log('a powerup collided with the player!')
    }

    destroy() {
        // destroy this sprite
    }

    /*
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
    */
}