import { BaseCreep } from "BaseCreep";
import { Constants } from "Constants"
import { HQ } from "HQ"
import { Builder } from "roles/Builder"
import { Harvester } from "roles/Harvester"
import { Upgrader } from "roles/Upgrader"
import { ErrorMapper } from "utils/ErrorMapper"

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log('New turn')
  console.log(`Current game tick is ${Game.time}`)
  console.log(`Cpu usage at start: ${Game.cpu.getUsed()}`)

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      console.log(`Removing memory of dead creep ${name}`)
      delete Memory.creeps[name]
    }
  }
  const hq = "Spawn1"
  const roomOb = HQ.getRoomObs(hq);
  HQ.run(hq)

  for (const name in Game.creeps) {
    const creep = Game.creeps[name]
    console.log(`Finding role for creep ${name}`)
    // see if we need to continue last role
    if (creep.memory.lastRole === Constants.TYPE_BUILDER && Builder.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_BUILDER
      BaseCreep.resetOthers(creep, Constants.TYPE_BUILDER)
      console.log("Continuing last mission: Builder")
      continue
    } else if (creep.memory.lastRole === Constants.TYPE_HARVESTER && Harvester.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_HARVESTER
      BaseCreep.resetOthers(creep, Constants.TYPE_HARVESTER)
      console.log("Continuing last mission: Harvester")
      continue
    }

    // see if we can do our primary role
    if (creep.memory.role === Constants.TYPE_UPGRADER && Upgrader.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_UPGRADER
      BaseCreep.resetOthers(creep, Constants.TYPE_UPGRADER)
      console.log("Primary mission: Upgrader")
      continue
    } else if (creep.memory.role === Constants.TYPE_BUILDER && Builder.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_BUILDER
      BaseCreep.resetOthers(creep, Constants.TYPE_BUILDER)
      console.log("Primary mission: Builder")
      continue
    } else if (creep.memory.role === Constants.TYPE_HARVESTER && Harvester.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_HARVESTER
      BaseCreep.resetOthers(creep, Constants.TYPE_HARVESTER)
      console.log("Primary mission: Harvester")
      continue
    }

    // default to be a harvester
    if (Harvester.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_HARVESTER
      BaseCreep.resetOthers(creep, Constants.TYPE_HARVESTER)
      console.log("Secondary mission: Harvester")
      continue
    }
    // default to be a builder
    if (Builder.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_BUILDER
      BaseCreep.resetOthers(creep, Constants.TYPE_BUILDER)
      console.log("Secondary mission: Builder")
      continue
    }
    // default to be an upgrader
    if (Upgrader.run(creep, roomOb) !== undefined) {
      creep.memory.lastRole = Constants.TYPE_UPGRADER
      BaseCreep.resetOthers(creep, Constants.TYPE_UPGRADER)
      console.log("Secondary mission: Upgrader")
      continue
    }
    console.log("Didn't find a role! (this is bad)")
  }
  console.log(`Cpu usage at end: ${Game.cpu.getUsed()}`)
})
