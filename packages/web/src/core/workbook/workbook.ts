import { Destroyable, Logger } from '../../tools'
import { Sheet } from '../sheet'
import { Server } from '../../server'
import { Canvas2dRenderer, IRenderer } from '../renderer'
import { AuthorizationOption } from '../constant'
import { ActionTarget } from '../action/action'
import { getRcIdByCellId } from '../cell'
import {
    Action,
    type ActionBroadcast,
    type ActionResponse,
    ActionType,
    BROADCAST_HEAD,
    RESPONSE_HEAD,
    SheetId,
} from '@honeysheet/shared'

export type WorkbookOptions = {
    defaultColumnCount: number // 默认列数
    defaultRowCount: number // 默认行数
    defaultColumnWidth: number // 默认列宽
    defaultRowHeight: number // 默认行高
    name: string // Workbook 名称
    sheets?: Sheet[] // sheet 页配置
    server?: Server
    authorization?: AuthorizationOption[] // 权限配置
}

export class Workbook extends Destroyable implements ActionTarget {
    private static readonly record = new WeakMap<HTMLDivElement, Workbook>()
    public readonly name: string
    private readonly sheetMap = new Map<SheetId, Sheet>()
    private readonly defaultColumnCount: number // 默认列数
    private readonly defaultRowCount: number // 默认行数
    private readonly defaultColumnWidth: number // 默认列宽
    private readonly defaultRowHeight: number // 默认行高
    private currentSheetId?: SheetId
    private readonly server?: Server
    private readonly renderer: IRenderer
    private readonly authorization: Set<AuthorizationOption> // 权限配置

    constructor(
        container: HTMLDivElement | null, // div 容器
        opts: WorkbookOptions,
    ) {
        super()
        if (!container) {
            console.error(container, 'does not exist')
            throw new Error('Container does not exist')
        }

        if (Workbook.record.has(container)) {
            console.error(container, 'already is a honeysheet')
            throw new Error('Already a honeysheet')
        }

        this.renderer = new Canvas2dRenderer(container, { workbook: this })
        this.name = opts.name
        this.defaultColumnCount = opts.defaultColumnCount
        this.defaultRowCount = opts.defaultRowCount
        this.defaultColumnWidth = opts.defaultColumnWidth
        this.defaultRowHeight = opts.defaultRowHeight
        this.authorization = new Set(opts.authorization)
        if (opts.sheets) {
            this.addSheets(opts.sheets)
        }
        if (opts.server) {
            this.server = opts.server
            this.server.onAction((action) => this.handle(action))
            this.onDestroy(() => this.server?.destroy())
        }

        Logger.info('初始化 Workbook=', opts.name)
        Workbook.record.set(container, this)
        this.onDestroy(() => Workbook.record.delete(container))
    }

    public addSheets(sheets: Sheet[]) {
        sheets.forEach((sheet) => {
            this.sheetMap.set(sheet.id, sheet)
        })
        if (!this.currentSheetId && sheets[0]) {
            this.currentSheetId = sheets[0].id
            this.renderer.renderSheet(sheets[0])
        }
    }

    private handle([head, ab]: ActionResponse | ActionBroadcast) {
        if (head === RESPONSE_HEAD) {
            switch (ab.type) {
                case ActionType.OPEN: {
                    console.warn('TODO handle open response', ab) // TODO
                    break
                }
                case ActionType.UPDATE_CELL_V: {
                    const { ok } = ab
                    if (!ok) {
                        console.warn(
                            'TODO handle action response not ok, should interrupt later editing',
                            ab,
                        ) // TODO
                    }
                    break
                }
            }
        } else if (head === BROADCAST_HEAD) {
            switch (ab.type) {
                case ActionType.OPEN: {
                    console.warn('TODO handle open broadcast', ab) // TODO
                    break
                }
                case ActionType.UPDATE_CELL_V: {
                    const { v, sheetId, cellId } = ab
                    const sheet = this.sheetMap.get(sheetId)
                    const { rowId, columnId } = getRcIdByCellId(cellId)
                    sheet?.updateCell(rowId, columnId, v)
                    this.renderer.renderCell(rowId, columnId)
                }
            }
        }
    }

    public dispatch(action: Action) {
        this.apply(action)
        this.server?.sendAction(action)
    }

    public apply(action: Action) {
        switch (action.type) {
            case ActionType.UPDATE_CELL_V: {
                const { v, sheetId, cellId } = action
                const sheet = this.sheetMap.get(sheetId)
                const { rowId, columnId } = getRcIdByCellId(cellId)
                sheet?.updateCell(rowId, columnId, v)
                this.renderer.renderCell(rowId, columnId)
            }
        }
    }

    public revoke(action: Action) {
        console.warn('TODO revoke', action) // TODO
    }
}
