import { Constants } from "Constants"

export class HQ {
    public static spawn(): Optional<number> {
        let harvesters = [];
        let builders = [];
        let upgraders = []
        for (const name in Game.creeps) {
            const role = Game.creeps[name].memory.role;
            if (role == Constants.TYPE_HARVESTER) {
                harvesters.push(Game.creeps[name])
            } else if (role == Constants.TYPE_UPGRADER) {
                upgraders.push(Game.creeps[name])
            } else if (role == Constants.TYPE_BUILDER) {
                builders.push(Game.creeps[name])
            }
        }
        console.log('Harvesters: ' + harvesters.length);
        console.log('Builders: ' + builders.length);
        console.log('Upgraders: ' + upgraders.length);

        const spawnName = 'Spawn1';

        if (harvesters.length < 3) {
            this.spawnCreep(spawnName, [WORK, CARRY, MOVE], Constants.TYPE_HARVESTER)
            this.printSpawnMessage(spawnName);
        } else if (upgraders.length < 2) {
            this.spawnCreep(spawnName, [WORK, CARRY, MOVE], Constants.TYPE_UPGRADER)
            this.printSpawnMessage(spawnName);
        } else if (builders.length < 2) {
            this.spawnCreep(spawnName, [WORK, CARRY, MOVE], Constants.TYPE_BUILDER)
            this.printSpawnMessage(spawnName);
        }
        return undefined
    }

    private static spawnCreep(spawnName: string, body: BodyPartConstant[], role: string): Optional<number> {
        console.log(`Trying to create new role ${role}`)
        var newName = role + Game.time;
        console.log(`Spawning new ${role}: ${newName}`);
        return Game.spawns[spawnName].spawnCreep(body, newName,
            { memory: { role: role } as CreepMemory });
    }

    private static printSpawnMessage(spawnName: string) {
        if (Game.spawns[spawnName].spawning) {
            var spawningCreep = Game.creeps[Game.spawns[spawnName].spawning!.name];
            Game.spawns[spawnName].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns[spawnName].pos.x + 1,
                Game.spawns[spawnName].pos.y,
                { align: 'left', opacity: 0.8 });
        }

    }

}
