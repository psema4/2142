class NPC extends SpaceEntity {
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
            width: 2 * opts.size,
            height: opts.size,
            dx: /* TOFE.state === 'playing' && */ -1 * opts.startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
            radius: opts.radius || 2,
            speed: opts.startSpeed,
        })
    }

    onCollideWithPlayer() {
        if (this.isActive) {
            console.log('a ship collided with player!')
            this.destroy()
        }
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