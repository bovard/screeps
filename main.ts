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
      delete Memory.creeps[name];
    }
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
