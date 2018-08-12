class Planet extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        if (opts.startSpeed)
            opts.speed = opts.startSpeed
        else
            opts.startSpeed = opts.speed || 0

        super(opts)

        this._artifact = opts.artifact

        this.isColliding = false
        this.cooldown = 0

        this.sprite = new kontra.sprite({
            x: opts.startX,
            y: opts.startY,
            color: opts.color,
            dx: /* TOFE.state === 'playing' && */ -1 * opts.startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
            name: opts.name,
            speed: opts.startSpeed,
            radius: opts.radius,

            render: function() {
                this.context.fillStyle = this.color

                this.context.beginPath()
                this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
                this.context.fill()

                this.context.font = TOFE.theme[TOFE.selectedTheme].fontSmall
                this.context.fillStyle = TOFE.theme[TOFE.selectedTheme].smallTextColor
                this.context.textAlign = 'center'
                this.context.fillText(`${this.name}`, this.x, this.y + this.radius + 20)
            },

            collidesWith: function(object, offset = 0) {
                let dx = Math.abs(this.x - (object.x || object.sprite.x))
                let dy = Math.abs(this.y - (object.y || object.sprite.y))
                let distance = Math.sqrt(dx * dx + dy * dy)
                let limit = this.radius + (object.radius || object.sprite.radius) + offset

                return distance < limit
            },
        })
    }

    get artifact() {
        return this._artifact
    }

    set artifact(v) {
        this._artifact = v
    }

    onTick() {
        if (TOFE.state != 'playing')
            return

        if (this.sprite.name == "Black Hole") {
            if (spaceTime.timeDirection > 0) {
                this.sprite.y += 0.0125
            }
        }
    }

    onCollideWithPlayer() {
        if (cooldown > 0)
            return

        if (this.isActive && !this.isColliding) {
            this.isColliding = true
            this.cooldown = 120
                if (this.sprite.name == 'Black Hole') {
                    player.onCollideWithBlackHole()

                } else {
                    //cooldown == 0
                    spaceTime.timeMultiplier = 0
                    activePlanet = this
                    player.speak('text', `Away team to ${this.sprite.name}`)
                }

        } else {
            this.cooldown -= 1

            if (this.cooldown == 0)
                this.isColliding = false
        }
    }

    onCollideWithBlackHole() {
        // ignore
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