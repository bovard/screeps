export class Builder {
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
            const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                const result = creep.build(targets[0]);
                if (result === OK) {
                    return OK;
                } else if (result === ERR_NOT_IN_RANGE) {
                    return creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
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
