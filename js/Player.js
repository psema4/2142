class Player extends SpaceEntity {
    constructor(opts = { speed: 0 }) {
        super(opts)

        this._artifacts = []

        this._hull = 100
        this._air = 100
        this._water = 100
        this._food = 100
        this._fuel = 100
        this._timeJuice = 0

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

    get hull() {
        return this._hull
    }

    get air() {
        return this._air
    }

    get water() {
        return this._water
    }

    get food() {
        return this._food
    }

    get fuel() {
        return this._fuel
    }

    get timeJuice() {
        return this._timeJuice
    }

    set hull(v) {
        if (v < 0)
            v = 0

        if (v > 100)
            v = 100
            
        this._hull = v
    }

    set air(v) {
        if (v < 0)
            v = 0

        if (v > 100)
            v = 100
            
        this._air = v
    }

    set water(v) {
        if (v < 0)
            v = 0

        if (v > 100)
            v = 100
            
        this._water = v
    }

    set food(v) {
        if (v < 0)
            v = 0

        if (v > 100)
            v = 100
            
        this._food = v
    }

    set fuel(v) {
        if (v < 0)
            v = 0

        if (v > 100)
            v = 100
            
        this._fuel = v        
    }

    set timeJuice(v) {
        if (v < 0)
            v = 0

        this._timeJuice = v
    }

    tick() {
        if (TOFE.state != 'playing')
            return

        this.air += TOFE.difficulty[TOFE.selectedDifficulty].resources.air
        this.food += TOFE.difficulty[TOFE.selectedDifficulty].resources.food
        this.water += TOFE.difficulty[TOFE.selectedDifficulty].resources.water
        this.fuel += TOFE.difficulty[TOFE.selectedDifficulty].resources.fuel
        this.timeJuice += TOFE.difficulty[TOFE.selectedDifficulty].resources.timeJuice

        this._timeStates.push({
            x: this.sprite.x,
            y: this.sprite.y,
            dx: this.sprite.dx,
            dy: this.sprite.dy,
            speed: this.speed,
            hull: this.hull,
            air: this.air,
            food: this.food,
            water: this.water,
            fuel: this.fuel,
            timeJuice: this.timeJuice,
        })

        if (this.debug)
            console.log(`speed: ${this.speed}`)
    }

    restoreFromTick(t) {
        if (TOFE.state != 'playing')
            return

        if (t >= 0 && t < this._timeStates.length) {
            this.sprite.x = this._timeStates[t].x
            this.sprite.y = this._timeStates[t].y
            this.sprite.dx = this._timeStates[t].dx
            this.sprite.dy = this._timeStates[t].dy
            this.sprite.speed = this._timeStates[t].speed
            this.hull = this._timeStates[t].hull
            this.air = this._timeStates[t].air
            this.water = this._timeStates[t].water
            this.food = this._timeStates[t].food
            this.fuel = this._timeStates[t].fuel
            this.timeJuice = this._timeStates[t].timeJuice
        }
    }

    addArtifact(v) {
        this._artifacts.push(v)
    }

    hasArtifact(v) {
        return this._artifacts.includes(v)
    }
}