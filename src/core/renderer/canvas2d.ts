import { IRenderer } from './interface'
import { deleteAllKeys } from '../../uitls/desturct'
import { IterateeResult, Sheet } from '../sheet'
import { Logger } from '../../tools'
import { noop } from '../../uitls/noop'

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
    private refresher = noop
    private scrollTop = 10
    private scrollLeft = 10
    private readonly resizeHandler: () => void

    constructor(container: HTMLElement) {
        this.canvas.style.display = 'block'
        this.canvas.style.border = '1px solid lightgrey'
        container.appendChild(this.canvas)
        this.resizeHandler = () => {
            const changed = this.resize(container)
            if (changed) {
                this.refresher()
            }
        }
        window.addEventListener('resize', this.resizeHandler)
        this.resize(container)
    }

    public destroy() {
        window.removeEventListener('resize', this.resizeHandler)
        deleteAllKeys(this)
    }

    render(sheet: Sheet): void {
        Logger.debug('render called.')
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('canvas context null')
        }

        const width = this.canvas.width
        const height = this.canvas.height

        // clear
        ctx.clearRect(0, 0, width, height)

        // scale
        ctx.resetTransform()
        ctx.scale(this.scale, this.scale)

        // text config
        ctx.font = `${FontSize}px/${LineHeight}px Verdana`
        ctx.textBaseline = 'middle'

        // loop draw cells
        sheet.iterateCellGrid((rowIndex, columnIndex, cell) => {
            const x = columnIndex * ColumnWidth + 1 - this.scrollLeft
            const y = rowIndex * RowHeight + 1 - this.scrollTop

            // skip left invisible area
            if (x < -ColumnWidth) {
                return IterateeResult.NextColumn
            }

            // skip top invisible area
            if (y < -RowHeight) {
                return IterateeResult.NextRow
            }

            // skip right invisible area
            if (x > width) {
                return IterateeResult.NextRow
            }

            // skip bottom invisible area
            if (y > height) {
                return IterateeResult.Break
            }

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
            cell && ctx.fillText(String(cell.v), textX, textY)
        })

        // create a refresher
        this.refresher = () => this.render(sheet)
    }

    private resize(container: HTMLElement): boolean {
        Logger.debug('resize called.')
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
}
