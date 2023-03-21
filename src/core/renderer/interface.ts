import { Sheet } from '../sheet'
import { Destroyable } from '../../tools'

export interface IRenderer extends Destroyable {
    render(sheet: Sheet): void
}
