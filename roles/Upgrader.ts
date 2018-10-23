import { BaseCreep } from "../BaseCreep"
import { Constants } from "../Constants";

export class Upgrader extends BaseCreep {
    public static run(creep: Creep, roomOb: RoomObservation): Optional<number> {
        const res = BaseCreep.run(creep, roomOb)
        if (res !== undefined) {
            return res
        }
        return this.upgrade(creep)
    }
    public static upgrade(creep: Creep): Optional<number> {
        if (creep.memory.upgrading === undefined) {
            creep.memory.upgrading = false
            BaseCreep.resetSourceCache(creep)
            creep.say('🔄 collecting to upgrade')
        }
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false
            BaseCreep.resetSourceCache(creep)
            creep.say('🔄 collecting to upgrade')
        }
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true
            creep.say('⚡ upgrade')
        }

        if (creep.memory.upgrading && creep.room.controller !== undefined) {
            const res = creep.upgradeController(creep.room.controller)
            if (res === OK) {
                return OK
            } else if (res === ERR_NOT_IN_RANGE) {
                return creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } })
            }
        } else if (creep.memory.upgrading === false) {
            const target = BaseCreep.getNearestSourceCached(creep)
            const result = creep.harvest(target)
            if (result === OK) {
                return OK
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } })
            }
        }
        return undefined
    }
}
