const CellXPadding = 2

export function drawCell(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    text?: string | number,
): void {
    const _x = x + 0.5
    const _y = y + 0.5
    // border
    ctx.beginPath()
    ctx.moveTo(_x + width, _y)
    // right border
    ctx.lineTo(_x + width, _y + height)
    // bottom border
    ctx.lineTo(_x, _y + height)
    ctx.stroke()

    // cell text
    if (text !== undefined) {
        const textX = _x + CellXPadding
        const textY = _y + height / 2
        ctx.fillText(String(text), textX, textY)
    }
}
