export class BaseCreep {
    public static run(creep: Creep, roomObs: RoomObservation): Optional<number> {
        if (creep.carry.energy === creep.carryCapacity) {
            return;
        }
        const adjacentTombs = roomObs.tombstones.filter(
            (tombstone: Tombstone) => {
                return creep.pos.getRangeTo(tombstone.pos) <= 1
                    && tombstone.store.energy > 0
            })
        if (adjacentTombs.length > 0) {
            return creep.withdraw(adjacentTombs[0], RESOURCE_ENERGY)
        }
        return undefined
    }
    public static getClosestSource(creep: Creep): Source {
        const sources = creep.room.find(FIND_SOURCES)
        let closest = 10000
        let result = sources[0]
        sources.forEach(element => {
            const dist = creep.pos.getRangeTo(element.pos)
            if (dist < closest) {
                closest = dist
                result = element
            }
        })
        return result
    }
    public static resetSourceCache(creep: Creep) {
        delete creep.memory.sourceTarget
    }
    public static getNearestSourceCached(creep: Creep): Source {
        let target
        if (creep.memory.sourceTarget !== undefined) {
            const sources = creep.room.lookForAt(LOOK_SOURCES, creep.memory.sourceTarget)
            if (sources.length > 0) {
                target = sources[0]
            } else {
                delete creep.memory.sourceTarget
            }
        }
        if (target === undefined) {
            target = BaseCreep.getClosestSource(creep)
            creep.memory.sourceTarget = target.pos
        }
        return target
    }
    public static getConstructionSourceCached(creep: Creep): Optional<ConstructionSite> {
        let target
        if (creep.memory.constructionTarget !== undefined) {
            const sources = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.memory.constructionTarget)
            if (sources.length > 0) {
                target = sources[0]
            } else {
                delete creep.memory.constructionTarget
            }
        }
        if (target === undefined) {
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            if (targets.length) {
                target = targets[0]
                creep.memory.constructionTarget = target.pos
            }
        }
        return target
    }
}
