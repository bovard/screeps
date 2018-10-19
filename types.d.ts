// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  building: boolean;
  upgrading: boolean;
  harvesting: boolean;
  target: RoomPosition
}

declare const TYPE_HARVESTER = 'harvester';
declare const TYPE_BUILDER = 'builder';
declare const TYPE_UPGRADER = 'upgrader';

type Optional<T> = T | undefined

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
