export class Destroyable {
    private readonly revokers: Array<() => void> = []

    public onDestroy(revoker: () => void) {
        this.revokers.push(revoker)
    }

    public destroy() {
        console.warn(this, 'destroyed')
        this.revokers.forEach((revoker) => revoker())
        Object.keys(this).forEach((key) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            delete this[key]
        })
    }
}
