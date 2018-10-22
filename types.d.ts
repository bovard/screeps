// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string
  room: string
  target: RoomPosition
  sourceTarget: RoomPosition
  constructionTarget: RoomPosition
  lastRole: string
  flagOne: boolean
  flagTwo: boolean
  flagThree: boolean
  flagFour: boolean
  targetOne: RoomPosition
  targetTwo: RoomPosition
}

interface RoomObservation {
  tombstones: Tombstone[]
  roads: StructureRoad[]
  droppedEnergy: Resource[]
}

type Optional<T> = T | undefined

interface Memory {
  uuid: number
  log: any
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any
  }
}
