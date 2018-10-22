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
    if (creep.memory.role === Constants.TYPE_UPGRADER && Upgrader.run(creep, roomOb) !== undefined) {
      console.log("Primary mission: Upgrader")
      continue
    } else if (creep.memory.role === Constants.TYPE_BUILDER && Builder.run(creep, roomOb) !== undefined) {
      console.log("Primary mission: Builder")
      continue
    } else if (creep.memory.role === Constants.TYPE_HARVESTER && Harvester.run(creep, roomOb) !== undefined) {
      console.log("Primary mission: Harvester")
      continue
    }
    // default to be a harvester
    if (Harvester.run(creep, roomOb) !== undefined) {
      console.log("Secondary mission: Harvester")
      continue
    }
    // default to be a builder
    if (Builder.run(creep, roomOb) !== undefined) {
      console.log("Secondary mission: Builder")
      continue
    }
    // default to be an upgrader
    if (Upgrader.run(creep, roomOb) !== undefined) {
      console.log("Secondary mission: Upgrader")
      continue
    }
  }
  console.log(`Cpu usage at end: ${Game.cpu.getUsed()}`)
})
