import { ErrorMapper } from "./ErrorMapper"

export enum LogLevel {
    Information,
    Warning,
    Error
}

class Logger {
    error(message?: any) {
        this.writeLog(message, LogLevel.Error)
    }
    log(message?: any) {
        this.writeLog(message, LogLevel.Information)
    }
    warn(message?: any) {
        this.writeLog(message, LogLevel.Warning)
    }

    private objToString(e: any): string {
        if (e instanceof Error) {
            if ("sim" in Game.rooms) return e.stack ?? ""
            else return ErrorMapper.sourceMappedStackTrace(e)
        } else if (typeof e === "object") {
            return JSON.stringify(e, null, 2)
        } else return e
    }

    writeLog(message: any, level: LogLevel = LogLevel.Information) {
        let color
        let levelText
        switch (level) {
            case LogLevel.Error:
                color = "#ff8080"
                levelText = "錯誤"
                break
            case LogLevel.Warning:
                color = "#ffbf80"
                levelText = "警告"
                break
            default:
                color = "#ffffff"
                levelText = "資訊"
                break
        }
        const text = this.objToString(message)
        console.log(`<span style='color:${color}'>[${levelText}] ${Game.time} ${_.escape(text)}</span>`)
    }
}
export const logger = new Logger()
