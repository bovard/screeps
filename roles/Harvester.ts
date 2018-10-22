import { BaseCreep } from "../BaseCreep"

export class Harvester extends BaseCreep {

    public static run(creep: Creep, roomOb: RoomObservation): Optional<number> {
        const res = BaseCreep.run(creep, roomOb)
        if (res !== undefined) {
            return res
        }
        return this.harvest(creep)
    }
    private static harvest(creep: Creep): Optional<number> {
        if (!creep.memory.harvesting && creep.carry.energy === 0) {
            creep.memory.harvesting = true
            BaseCreep.resetSourceCache(creep)
            creep.say('🔄 harvest')
        }
        if (creep.memory.harvesting && creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = false
            creep.say('⚡ dumping')
        }
        if (creep.memory.harvesting) {
            console.log('Trying to harvest')
            const target = BaseCreep.getNearestSourceCached(creep)
            const result = creep.harvest(target)
            if (result === OK) {
                return OK
            } else if (result === ERR_NOT_IN_RANGE) {
                console.log('Moving to harvest')
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
            }
            return undefined
        } else {
            const target = BaseCreep.getClosestEnergyDeposite(creep)
            if (target === undefined) {
                return undefined
            }
            const result = creep.transfer(target, RESOURCE_ENERGY)
            if (result === OK) {
                return OK
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } })
            }
            return undefined
        }
    }
}
