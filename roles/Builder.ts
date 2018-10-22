import { BaseCreep } from "../BaseCreep";
import { Constants } from "../Constants";

export class Builder extends BaseCreep {
    public static run(creep: Creep, roomOb: RoomObservation): Optional<number> {
        if (creep.memory.lastRole !== Constants.TYPE_BUILDER) {
            BaseCreep.resetMemeory(creep)
        }
        const res = BaseCreep.run(creep, roomOb)
        if (res !== undefined) {
            return res
        }
        return this.build(creep)
    }
    private static build(creep: Creep): Optional<number> {
        const isBuilding = creep.memory.flagOne
        const isBuildingFlag = 'flagOne'
        if (isBuilding && creep.carry.energy === 0) {
            creep.memory[isBuildingFlag] = false;
            creep.say('🔄 collect to build');
        }
        if (!isBuilding && creep.carry.energy === creep.carryCapacity) {
            creep.memory[isBuildingFlag] = true;
            creep.say('🚧 build');
        }
        if (isBuilding) {
            console.log("building");
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
            const target = BaseCreep.getNearestSourceCached(creep)
            const result = creep.harvest(target);
            if (result === OK) {
                return OK;
            } else if (result === ERR_NOT_IN_RANGE) {
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
        return undefined;
    }
}
