export class Harvester {
    public static run(creep: Creep): Optional<number> {
        if (creep.carry.energy < creep.carryCapacity) {
            const sources = creep.room.find(FIND_SOURCES);
            const result = creep.harvest(sources[0]);
            if (result === OK) {
                return OK;
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION && (structure as StructureExtension).energy < (structure as StructureExtension).energyCapacity) ||
                        (structure.structureType === STRUCTURE_SPAWN && (structure as StructureSpawn).energy < (structure as StructureSpawn).energyCapacity) ||
                        (structure.structureType === STRUCTURE_TOWER && (structure as StructureTower).energy < (structure as StructureTower).energyCapacity);
                }
            });
            if (targets.length > 0) {
                const result = creep.transfer(targets[0], RESOURCE_ENERGY);
                if (result === OK) {
                    return OK;
                } else if (result === ERR_NOT_IN_RANGE) {
                    return creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
        return undefined;
    }
}
