import { Sheet } from '../../sheet'
import { ColumnId, RowId } from '@honeysheet/shared'
import { Destroyable } from '../../../tools'
import { FontSize, LineHeight } from '../../constant'
import { Context } from '../../context'
import { ActionType } from '../../action/action'
import { getCellIdByRcId } from '../../cell/id'

function createSelectionDiv(): HTMLDivElement {
    const div = document.createElement('div')
    div.style.boxSizing = 'border-box'
    div.style.position = 'absolute'
    div.style.contain = 'content'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.backgroundColor = 'rgba(255, 255, 255, .1)'
    div.style.border = `1px solid red`
    return div
}

function createSelectionEditInput(): HTMLInputElement {
    const input = document.createElement('input')
    input.setAttribute(
        'style',
        `
        display: block;
        border: none;
        padding: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        outline: 1px solid skyblue;
        font: ${FontSize}px/${LineHeight}px Verdana;
    `,
    )
    return input
}

export class SelectedArea extends Destroyable {
    div = createSelectionDiv()
    constructor(
        private readonly sheet: Sheet,
        context: Context,
        public rowIds: Array<RowId>,
        public columnIds: Array<ColumnId>,
    ) {
        super()
        this.listenForEnterEdit(context)
        this.onDestroy(() => this.div.remove())
    }
    private enterEdit = (context: Context) => {
        const rowId = this.rowIds[this.rowIds.length - 1]
        const columnId = this.columnIds[this.columnIds.length - 1]
        const cell = this.sheet.getCell(
            this.rowIds[this.rowIds.length - 1],
            this.columnIds[this.columnIds.length - 1],
        )
        if (!cell) {
            return
        }
        const value = cell.v
        const input = createSelectionEditInput()
        input.value = String(value)
        this.div.appendChild(input)
        input.focus({ preventScroll: true })

        const quitEdit = () => {
            input.remove()
            this.listenForEnterEdit(context)
        }
        input.addEventListener('blur', quitEdit, { once: true })
        input.addEventListener('keydown', (event) => {
            if (event.code === 'Enter') {
                context.workbook.dispatch({
                    type: ActionType.UPDATE_CELL_V,
                    sheetId: this.sheet.id,
                    cellId: getCellIdByRcId(columnId, rowId),
                    v: input.value,
                })
                input.blur()
            }
            if (event.code === 'Escape') {
                input.blur() // trigger quitEdit()
            }
        })
    }

    private listenForEnterEdit(context: Context) {
        this.div.addEventListener('dblclick', () => this.enterEdit(context), {
            once: true,
        })
    }
}
