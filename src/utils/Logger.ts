class Logger {
    error(message?: any, ...optionalParams: any[]) {
        console.error(message, ...optionalParams)
    }
    log(message?: any, ...optionalParams: any[]) {
        console.log(message, ...optionalParams)
    }
    warn(message?: any, ...optionalParams: any[]) {
        console.warn(message, ...optionalParams)
    }
}
export const logger = new Logger()
