class Logger {
    error(message?: any, ...optionalParams: any[]) {
        console.log(message, ...optionalParams)
    }
    log(message?: any, ...optionalParams: any[]) {
        console.log(message, ...optionalParams)
    }
    warn(message?: any, ...optionalParams: any[]) {
        console.log(message, ...optionalParams)
    }
}
export const logger = new Logger()
