export class Upgrader {
    public static run(creep: Creep): Optional<number> {
        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading && creep.room.controller !== undefined) {
            const res = creep.upgradeController(creep.room.controller);
            if (res === OK) {
                return OK;
            } else if (res === ERR_NOT_IN_RANGE) {
                return creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else if (creep.carry.energy < creep.carryCapacity) {
            let target;
            if (creep.memory.target !== undefined) {
                const sources = creep.room.lookForAt(LOOK_SOURCES, creep.memory.target);
                if (sources.length > 0) {
                    target = sources[0];
                } else {
                    delete creep.memory.target;
                }
            }
            if (target === undefined) {
                const sources = creep.room.find(FIND_SOURCES);
                if (sources.length === 0) {
                    return undefined;
                }
                target = sources[0];
                creep.memory.target = target.pos;
            }
            const result = creep.harvest(target);;
            if (result === OK) {
                return OK;
            } else
                if (result === ERR_NOT_IN_RANGE) {
                    return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
        }
        return undefined;
    }
}
