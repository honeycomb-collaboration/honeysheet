import { IRenderer } from '../interface'
import { Sheet } from '../../sheet'
import { Destroyable, Logger } from '../../../tools'
import { ColumnHeadHeight, ColumnWidth, RowHeadWidth, RowHeight } from '../../constant'
import { indexToColumnName } from '../../column'
import { createSelectionDiv, ensureSelectionDivs } from './selection'
import { drawCell } from './cell'

const FontSize = 12
const LineHeight = 16
const RightPadding = 120
const BottomPadding = 60

/**
 * Canvas 2d Renderer
 */
export class Canvas2dRenderer extends Destroyable implements IRenderer {
    private scale = 1
    private readonly canvas = document.createElement('canvas')
    private sheet?: Sheet
    private scrollTop = 0
    private maxScrollTop = 0
    private scrollLeft = 0
    private maxScrollLeft = 0
    private readonly handleResize: () => void

    constructor(private readonly container: HTMLElement) {
        super()
        this.canvas.style.display = 'block'
        const selectDiv = createSelectionDiv()

        container.style.contain = 'content'
        container.appendChild(this.canvas)
        this.resize(container)

        this.handleResize = () => {
            const changed = this.resize(container)
            if (changed) {
                this.doRender()
            }
        }
        window.addEventListener('resize', this.handleResize)
        container.addEventListener('wheel', this.handleWheel, {
            passive: false,
        })

        this.canvas.addEventListener('mousedown', (event) => {
            if (this.sheet) {
                this.sheet.selectArea({
                    x: event.offsetX - RowHeadWidth + this.scrollLeft,
                    y: event.offsetY - ColumnHeadHeight + this.scrollTop,
                })
                this.showSelectArea()
            }
        })

        this.onDestroy(() => {
            container.removeChild(this.canvas)
            container.removeChild(selectDiv)
            window.removeEventListener('resize', this.handleResize)
            container.removeEventListener('wheel', this.handleWheel)
        })
    }

    public render(sheet: Sheet): void {
        this.sheet = sheet
        this.doRender()
    }

    private showSelectArea() {
        if (!this.sheet) {
            return
        }
        const areas = ensureSelectionDivs(this.container, this.sheet.selection.length)
        this.sheet.loopSelection(({ x, y, width, height }, index) => {
            let areaDiv = areas[index]
            if (!areaDiv) {
                areaDiv = createSelectionDiv()
                this.container.appendChild(areaDiv)
            }

            areaDiv.style.transform = `translate(${x - this.scrollLeft}px, ${y - this.scrollTop}px)`
            areaDiv.style.width = width + 1 + 'px' // 1 is necessary because the outline needs cover all borders
            areaDiv.style.height = height + 1 + 'px' // 1 is necessary because the outline needs cover all borders
        })
    }

    private doRender(): void {
        Logger.debug('render called.')
        if (!this.sheet) {
            return
        }
        const sheet = this.sheet
        const ctx = this.canvas.getContext('2d')
        if (!ctx) {
            throw new Error('canvas context null')
        }

        const canvasWidth = this.canvas.width
        const canvasHeight = this.canvas.height

        // clear
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)

        // scale
        ctx.resetTransform()
        ctx.scale(this.scale, this.scale)

        // text config
        ctx.font = `${FontSize}px/${LineHeight}px Verdana`
        ctx.textBaseline = 'middle'
        this.maxScrollLeft = Math.max(
            sheet.width - canvasWidth / this.scale + RightPadding * this.scale,
            0,
        )
        this.maxScrollTop = Math.max(
            sheet.height - canvasHeight / this.scale + BottomPadding * this.scale,
            0,
        )
        const startColumnIndex = sheet.getColumnIndex(this.scrollLeft)
        const endColumnIndex = sheet.getColumnIndex(this.scrollLeft + canvasWidth)
        const startRowIndex = sheet.getRowIndex(this.scrollTop)
        const endRowIndex = sheet.getRowIndex(this.scrollTop + canvasHeight)
        // loop draw cells
        sheet.iterateCellGrid(
            { startRowIndex, endRowIndex, startColumnIndex, endColumnIndex },
            (rowIndex, columnIndex, cell) => {
                const x = RowHeadWidth + columnIndex * ColumnWidth - this.scrollLeft
                const y = ColumnHeadHeight + rowIndex * RowHeight - this.scrollTop
                ctx.lineWidth = 1 / this.scale
                drawCell(ctx, x, y, ColumnWidth, RowHeight, cell?.v)
            },
        )

        // clear column head
        ctx.clearRect(RowHeadWidth, 0, canvasWidth, ColumnHeadHeight)
        // clear row head
        ctx.clearRect(0, ColumnHeadHeight, RowHeadWidth, canvasHeight)

        // draw column head
        sheet.iterateColumns((columnIndex) => {
            const x = RowHeadWidth + columnIndex * ColumnWidth - this.scrollLeft
            ctx.lineWidth = 1 / this.scale
            drawCell(ctx, x, 0, ColumnWidth, ColumnHeadHeight, indexToColumnName(columnIndex))
        })

        // draw row head
        sheet.iterateRows((rowIndex) => {
            const y = ColumnHeadHeight + rowIndex * RowHeight - this.scrollTop
            ctx.lineWidth = 1 / this.scale
            drawCell(ctx, 0, y, RowHeadWidth, RowHeight, rowIndex + 1)
        })

        // draw left-top cell
        ctx.clearRect(0, 0, RowHeadWidth, ColumnHeadHeight)
        drawCell(ctx, 0, 0, RowHeadWidth, ColumnHeadHeight)
    }

    private readonly handleWheel = (event: WheelEvent) => {
        if (event.ctrlKey) {
            return
        }

        event.preventDefault()
        let scrollTop = this.scrollTop
        let scrollLeft = this.scrollLeft
        switch (event.deltaMode) {
            case WheelEvent.DOM_DELTA_PIXEL: {
                scrollTop += event.deltaY
                scrollLeft += event.deltaX
                break
            }
            case WheelEvent.DOM_DELTA_LINE: {
                scrollTop += event.deltaY * RowHeight
                scrollLeft += event.deltaX * ColumnWidth
                break
            }
            case WheelEvent.DOM_DELTA_PAGE: {
                scrollTop += event.deltaY * this.canvas.height * 0.8
                scrollLeft += event.deltaX * this.canvas.width * 0.8
                break
            }
        }

        scrollTop = Math.min(Math.max(scrollTop, 0), this.maxScrollTop)
        scrollLeft = Math.min(Math.max(scrollLeft, 0), this.maxScrollLeft)

        if (scrollLeft !== this.scrollLeft || scrollTop !== this.scrollTop) {
            this.scrollLeft = scrollLeft
            this.scrollTop = scrollTop
            this.doRender()
            this.showSelectArea()
        }
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
