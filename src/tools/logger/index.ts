export class Logger{
    static trace(message: string, ...args: any[]) {
        console.log(message, ...args)
    }

    static debug(message: string, ...args: any[]) {
        console.log(message, ...args)
        debugger
    }

    static log(message: string, ...args: any[]) {
        console.log(message, ...args)
    }

    static info(message: string, ...args: any[]) {
        console.log(message, ...args)
    }

    static warn(message: string, ...args: any[]) {
        console.warn(message, ...args)
    }

    static warning(message: string, ...args: any[]) {
        console.log(message, ...args)
    }

    static error(message: string, ...args: any[]) {
        console.error(message, ...args)
    }

    static fatal(message: string, ...args: any[]) {
        console.log(message, ...args)
    }

}