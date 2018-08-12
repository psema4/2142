class TemporalObject {
    constructor() {
        this._timeStates = []
    }

    get timeStates() {
        return this._timeStates
    }

    tick() {
        console.warn('TemporalObject: stub: virtual tick()')
    }

    restoreFromTick(t) {
        console.warn('TemporalObject: stub: virtual restoreFromTick()')
    }

    popTimeState() {
        this._timeStates.pop()
    }
}