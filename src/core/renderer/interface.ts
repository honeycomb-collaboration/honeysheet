import { Sheet } from '../sheet'

export interface IRenderer {
    render(sheet: Sheet): void
}
