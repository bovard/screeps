import { Constants } from "Constants"

export class HQ {
    private static getMaxScreepCost(spawnName: string) {
        return Game.spawns[spawnName].energyCapacity +
            Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                }
            }).filter((structure: Structure) => Game.spawns[spawnName].pos.getRangeTo(structure.pos) < 20)
                .map((structure: Structure) => (structure as StructureExtension).energyCapacity).reduce((a, b) => a + b);
    }
    private static getAvaliableEnergy(spawnName: string) {
        return Game.spawns[spawnName].energy +
            Game.spawns[spawnName].room.find(FIND_STRUCTURES, {
                filter: (structure: Structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION
                }
            }).filter((structure: Structure) => Game.spawns[spawnName].pos.getRangeTo(structure.pos) < 20)
                .map((structure: Structure) => (structure as StructureExtension).energy).reduce((a, b) => a + b);
    }
    public static run(spawnName: string) {
        this.spawn(spawnName);
    }
    private static spawn(spawnName: string): Optional<number> {
        const harvesters = [];
        const builders = [];
        const upgraders = []
        for (const name in Game.creeps) {
            const role = Game.creeps[name].memory.role;
            if (role === Constants.TYPE_HARVESTER) {
                harvesters.push(Game.creeps[name])
            } else if (role === Constants.TYPE_UPGRADER) {
                upgraders.push(Game.creeps[name])
            } else if (role === Constants.TYPE_BUILDER) {
                builders.push(Game.creeps[name])
            }
        }
        console.log('Harvesters: ' + harvesters.length);
        console.log('Builders: ' + builders.length);
        console.log('Upgraders: ' + upgraders.length);

        if (harvesters.length == 0) {
            this.spawnCreep(spawnName, [WORK, CARRY, MOVE], Constants.TYPE_HARVESTER)
            this.printSpawnMessage(spawnName);
            return;
        }

        const maxCost = this.getMaxScreepCost(spawnName);
        const avaliable = this.getAvaliableEnergy(spawnName);
        const body = [WORK, CARRY, MOVE];
        let cost = 200;
        while (cost + 100 <= maxCost) {
            body.push(WORK);
            cost += 100;
        }
        while (cost + 50 <= maxCost) {
            body.push(CARRY);
            cost += 50;
        }
        console.log(`Max cost is ${maxCost} (${avaliable} avaliable) we are building ${cost}, ${body}`);
        if (harvesters.length < 3) {
            this.spawnCreep(spawnName, body, Constants.TYPE_HARVESTER)
            this.printSpawnMessage(spawnName);
        } else if (upgraders.length < 2) {
            this.spawnCreep(spawnName, body, Constants.TYPE_UPGRADER)
            this.printSpawnMessage(spawnName);
        } else if (builders.length < 2) {
            this.spawnCreep(spawnName, body, Constants.TYPE_BUILDER)
            this.printSpawnMessage(spawnName);
        }
        return undefined
    }

    private static spawnCreep(spawnName: string, body: BodyPartConstant[], roleString: string): Optional<number> {
        console.log(`Trying to create new role ${roleString}`)
        const newName = roleString + Game.time;
        console.log(`Spawning new ${roleString}: ${newName}`);
        const res = Game.spawns[spawnName].spawnCreep(body, newName,
            { memory: { role: roleString } as CreepMemory });
        console.log(`Got result: ${res}`);
        return res;
    }

    private static printSpawnMessage(spawnName: string) {
        if (Game.spawns[spawnName].spawning) {
            const spawningCreep = Game.creeps[Game.spawns[spawnName].spawning!.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                { align: 'left', opacity: 0.8 });
        }

    }

}
