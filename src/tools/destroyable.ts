import { deleteAllKeys } from '../uitls/desturct'

export class Destroyable {
    private readonly revokers: Array<() => void> = []

    public onDestroy(revoker: () => void) {
        this.revokers.push(revoker)
    }

    public destroy() {
        this.revokers.forEach((revoker) => revoker())
        deleteAllKeys(this)
    }
}
