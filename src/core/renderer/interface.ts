import { Sheet } from '../sheet'
import { Destroyable } from '../interfaces/Destroyable'

export interface IRenderer extends Destroyable {
    render(sheet: Sheet): void
    resize(container: HTMLElement): boolean
}
