import { IRenderer } from './interface'
import { deleteAllKeys } from '../../uitls/desturct'
import { Sheet } from '../sheet'
import { forEach2dArray } from '../../uitls/2dArray'
import { Logger } from '../../tools'

const RowHeight = 20
const ColumnWidth = 80
const FontSize = 14
const LineHeight = 16
const CellXPadding = 2

/**
 * Canvas 2d Renderer
 */
export class Canvas2dRenderer implements IRenderer {
    private scale = 1
    private readonly canvas = document.createElement('canvas')

    constructor(container: HTMLElement) {
        this.canvas.style.display = 'block'
        container.appendChild(this.canvas)
        this.resize(container)
    }

    public destroy() {
        deleteAllKeys(this)
    }

    public resize(container: HTMLElement): boolean {
        const scale = Math.max(window.devicePixelRatio, 2) // 2x scale at least
        const width = container.clientWidth
        const height = container.clientHeight
        let changed = false
        if (width + 'px' !== this.canvas.style.width) {
            this.canvas.style.width = width + 'px'
            changed = true
        }
        if (height + 'px' !== this.canvas.style.height) {
            this.canvas.style.height = height + 'px'
            changed = true
        }
        if (width * scale !== this.canvas.width) {
            this.canvas.width = width * scale
            changed = true
        }
        if (height * scale !== this.canvas.height) {
            this.canvas.height = height * scale
            changed = true
        }
        if (scale !== this.scale) {
            this.scale = scale
            changed = true
        }
        return changed
    }

    render(sheet: Sheet): void {
        Logger.trace('render called.')
        const cells = sheet.cells
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('canvas context null')
        }

        // clear
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        // scale
        ctx.scale(this.scale, this.scale)

        // text config
        ctx.font = `${FontSize}px/${LineHeight}px Verdana`
        ctx.textBaseline = 'middle'

        // loop draw cells
        forEach2dArray(cells, (item, rowIndex, columnIndex) => {
            const x = columnIndex * ColumnWidth + 1
            const y = rowIndex * RowHeight + 1

            // border
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + ColumnWidth, y)
            ctx.lineTo(x + ColumnWidth, y + RowHeight)
            ctx.lineTo(x, y + RowHeight)
            ctx.closePath()
            ctx.lineWidth = 1 / this.scale
            ctx.stroke()

            // cell text
            const textX = x + CellXPadding
            const textY = y + RowHeight / 2
            ctx.fillText(String(item.v), textX, textY)
        })
    }
}
