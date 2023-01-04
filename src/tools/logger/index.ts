export class Logger {
    static trace(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static debug(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static log(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static info(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static warn(message: string, ...args: unknown[]) {
        console.warn(message, ...args)
    }

    static warning(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }

    static error(message: string, ...args: unknown[]) {
        console.error(message, ...args)
    }

    static fatal(message: string, ...args: unknown[]) {
        console.log(message, ...args)
    }
}
