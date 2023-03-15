import { IRenderer } from './interface'
import { deleteAllKeys } from '../../uitls/desturct'
import { Sheet } from '../sheet'
import { forEach2dArray } from '../../uitls/2dArray'

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
    }

    public destroy() {
        deleteAllKeys(this)
    }

    public resize(container: HTMLElement) {
        const scale = Math.max(window.devicePixelRatio, 2) // 2x scale at least
        const width = container.clientWidth
        const height = container.clientHeight
        this.canvas.style.width = width + 'px'
        this.canvas.style.height = height + 'px'
        this.canvas.width = width * scale
        this.canvas.height = height * scale
        this.scale = scale
    }

    render(sheet: Sheet): void {
        const cells = sheet.cells
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('canvas context null')
        }

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
