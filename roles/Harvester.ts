import { BaseCreep } from "../BaseCreep"
import { Constants } from "../Constants";

export class Harvester extends BaseCreep {
    public static run(creep: Creep, roomOb: RoomObservation): Optional<number> {
        const res = BaseCreep.run(creep, roomOb)
        if (res !== undefined) {
            return res
        }
        return this.harvest(creep)
    }
    private static harvest(creep: Creep): Optional<number> {
        if (creep.memory.harvesting === undefined) {
            creep.memory.harvesting = true
        }
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
            const target = BaseCreep.getNearestSourceCached(creep)
            const result = creep.harvest(target)
            if (result === OK) {
                return OK
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
            }
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
        }
        return undefined
    }
}
