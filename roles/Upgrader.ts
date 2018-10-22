import { BaseCreep } from "../BaseCreep"
import { Constants } from "../Constants";

export class Upgrader extends BaseCreep {
    public static run(creep: Creep, roomOb: RoomObservation): Optional<number> {
        if (creep.memory.lastRole !== Constants.TYPE_UPGRADER) {
            BaseCreep.resetMemeory(creep)
        }
        creep.memory.lastRole = Constants.TYPE_UPGRADER
        const res = BaseCreep.run(creep, roomOb)
        if (res !== undefined) {
            return res
        }
        return this.upgrade(creep)
    }
    public static upgrade(creep: Creep): Optional<number> {
        let isUpgrading = creep.memory.flagOne
        const isUpgradingFlag = "flagOne"
        if (isUpgrading && creep.carry.energy === 0) {
            creep.memory[isUpgradingFlag] = false
            isUpgrading = false
            BaseCreep.resetSourceCache(creep)
            creep.say('🔄 collecting to upgrade')
        }
        if (!isUpgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory[isUpgradingFlag] = true
            isUpgrading = true
            creep.say('⚡ upgrade')
        }

        if (isUpgrading && creep.room.controller !== undefined) {
            const res = creep.upgradeController(creep.room.controller)
            if (res === OK) {
                return OK
            } else if (res === ERR_NOT_IN_RANGE) {
                return creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } })
            }
        } else if (isUpgrading === false) {
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
