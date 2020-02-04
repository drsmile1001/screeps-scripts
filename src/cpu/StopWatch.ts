export class StopWatch {
    static startNew() {
        const sw = new StopWatch()
        sw.start()
        return sw
    }
    startTime?: number
    startCpu?: number
    endTime?: number
    endCpu?: number
    start() {
        this.startTime = new Date().getTime()
        this.startCpu = Game.cpu.getUsed()
    }

    stop() {
        this.endTime = new Date().getTime()
        this.endCpu = Game.cpu.getUsed()
        return {
            timeSpan: this.endTime - this.startTime!,
            cpuCost: this.endCpu - this.startCpu!
        }
    }
}
