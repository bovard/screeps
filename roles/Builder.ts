import { BaseCreep } from "../BaseCreep";

export class Builder extends BaseCreep {
    public static run(creep: Creep): Optional<number> {
        if (creep.memory.building && creep.carry.energy === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }
        if (creep.memory.building) {
            const target = BaseCreep.getConstructionSourceCached(creep)
            if (target !== undefined) {
                const result = creep.build(target);
                if (result === OK) {
                    return OK;
                } else if (result === ERR_NOT_IN_RANGE) {
                    return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            const sources = creep.room.find(FIND_SOURCES);
            const result = creep.harvest(sources[0]);
            if (result === OK) {
                return OK;
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        return undefined;
    }
}
