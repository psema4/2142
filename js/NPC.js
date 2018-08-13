class NPC extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        if (opts.startSpeed)
            opts.speed = opts.startSpeed
        else
            opts.startSpeed = opts.speed || 0

        super(opts)

        let prefix = 'UHF'
        let id = Math.floor(Math.random() * 8999) + 1000
        let builds = ['A', 'B', 'C', 'D', 'E']
        let build = builds[Math.floor(Math.random() * builds.length)]

        this.isColliding = false
        this.cooldown = 0

        this.sprite = kontra.sprite({
            x: opts.startX,
            y: opts.startY,
            color: opts.color,
            width: 2 * opts.size,
            height: opts.size,
            dx: /* TOFE.state === 'playing' && */ -1 * opts.startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
            radius: opts.radius || 2,
            speed: opts.startSpeed,
            name: `${prefix}-${id}-${build}`,

            render: function() {
                this.context.fillStyle = this.color

                this.context.fillRect(this.x - Math.floor(this.width/2), this.y - Math.floor(this.height/2), this.width, this.height)

                this.context.font = TOFE.theme[TOFE.selectedTheme].fontSmall
                this.context.fillStyle = TOFE.theme[TOFE.selectedTheme].smallTextColor
                this.context.textAlign = 'center'
                this.context.fillText(`${this.name}`, this.x, this.y + 20)
            },
        })
    }

    onCollideWithPlayer() {
        if (this.isActive && !this.isColliding) {
            this.isColliding = true
            this.cooldown = 120
            player.hull -= Math.floor(Math.random() * TOFE.difficulty[TOFE.selectedDifficulty].ship2shipDamage) + 1
            player.speak('hurt')

        } else {
            this.cooldown -= 1

            if (this.cooldown == 0)
                this.isColliding = false
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