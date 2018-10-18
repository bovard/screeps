import { Builder } from "roles/Builder";
import { Harvester } from "roles/Harvester";
import { Upgrader } from "roles/Upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log('New turn');
  console.log(`Current game tick is ${Game.time}`);
  console.log(`Cpu usage at start: ${Game.cpu.getUsed()}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      console.log(`Removing memory of dead creep ${name}`)
      delete Memory.creeps[name];
    }
  }

  let harvesters = [];
  console.log('Harvesters: ' + harvesters.length);
  for (const name in Game.creeps) {
    if (Game.creeps[name].memory.role == 'harvester') {
      harvesters.push(Game.creeps[name])
    }
  }

  if (harvesters.length < 2) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);
    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
      { memory: { role: 'harvester' } as CreepMemory });
  }

  if (Game.spawns['Spawn1'].spawning) {
    var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'upgrader' && Upgrader.run(creep) !== undefined) {
      continue;
    } else if (creep.memory.role === 'builder' && Builder.run(creep) !== undefined) {
      continue;
    }
    // default to be a harvester
    Harvester.run(creep);
  }
  console.log(`Cpu usage at end: ${Game.cpu.getUsed()}`);
});
