import { BaseCreep } from "../BaseCreep"

export class Harvester extends BaseCreep {
    public static run(creep: Creep): Optional<number> {
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
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION && (structure as StructureExtension).energy < (structure as StructureExtension).energyCapacity) ||
                        (structure.structureType === STRUCTURE_SPAWN && (structure as StructureSpawn).energy < (structure as StructureSpawn).energyCapacity) ||
                        (structure.structureType === STRUCTURE_TOWER && (structure as StructureTower).energy < (structure as StructureTower).energyCapacity)
                }
            })
            if (targets.length > 0) {
                const result = creep.transfer(targets[0], RESOURCE_ENERGY)
                if (result === OK) {
                    return OK
                } else if (result === ERR_NOT_IN_RANGE) {
                    return creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })
                }
                return undefined
            }
        }
        return undefined
    }
}
