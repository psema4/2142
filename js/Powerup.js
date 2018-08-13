class Powerup extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        if (opts.startSpeed)
            opts.speed = opts.startSpeed
        else
            opts.startSpeed = opts.speed || 0

        super(opts)

        this.isColliding = false
        this.cooldown = 0

        let image = new Image();
        image.src = `img/sprites/pickup.png`;

        this.sprite = kontra.sprite({
            x: opts.startX,
            y: opts.startY,
            color: opts.color,
            width: 32,
            height: 32,
            dx: /* TOFE.state === 'playing' && */ -1 * opts.startSpeed * (spaceTime.timeDirection * spaceTime.timeMultiplier),
            type: opts.type || 'air',
            value: opts.value || 1,
            radius: opts.radius || 2,
            speed: opts.startSpeed,

            render: function() {
                //this.context.fillStyle = this.color
                //this.context.fillRect(this.x - Math.floor(this.width/2), this.y - Math.floor(this.height/2), this.width, this.height)

                this.context.drawImage(image, this.x - 16, this.y - 16)

                this.context.font = TOFE.theme[TOFE.selectedTheme].fontSmall
                this.context.fillStyle = TOFE.theme[TOFE.selectedTheme].smallTextColor
                this.context.textAlign = 'center'
                this.context.fillText(`+${this.value} ${this.type.toUpperCase()}`, this.x, this.y + this.radius + 20)
            },
        })
    }

    onCollideWithPlayer() {
        if (this.isActive) {
        }

        if (this.isActive && !this.isColliding) {
            this.isColliding = true
            this.cooldown = 120
            player.speak('text', `+${this.sprite.value} ${this.sprite.type}`)
            player[this.sprite.type] += this.sprite.value
            this.destroy()

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