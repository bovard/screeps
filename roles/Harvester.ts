import { Sources } from "../utils/Sources";

export class Harvester {
    public static run(creep: Creep): Optional<number> {
        if (creep.carry.energy === 0) {
            const source = Sources.getClosestSource(creep);
            const result = creep.harvest(source);
            if (result === OK) {
                return OK;
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            return undefined;
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
                return undefined;
            }
        }
        return undefined;
    }
}
