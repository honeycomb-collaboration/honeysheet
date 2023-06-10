export class Exception {
    name: any
    message: any
    constructor(name: any,message: any){
        this.name = name
        this.message = message
    }
    toString() {
        return this.name +":"+ this.message
    }
}