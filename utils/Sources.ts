export class Sources {
    public static getClosestSource(creep: Creep): Source {
        const sources = creep.room.find(FIND_SOURCES);
        let closest = 10000;
        let result = sources[0];
        sources.forEach(element => {
            const dist = creep.pos.getRangeTo(element.pos)
            if (dist < closest) {
                closest = dist;
                result = element;
            }
        });
        return result;
    }
}
