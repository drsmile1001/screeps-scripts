class Tool{
    /**所有creep */
    Creeps = (function(){
        let allCreeps :Array<Creep> = [];
        for (const name in Game.creeps) {
            const creep = Game.creeps[name];
            allCreeps.push(creep);
          }
        return allCreeps;
    })()
}

export let tool = new Tool();
