const SelectAreaDiv = 'select-area-div'

export function createSelectionDiv(): HTMLDivElement {
    const div = document.createElement('div')
    div.dataset['type'] = SelectAreaDiv
    div.style.boxSizing = 'border-box'
    div.style.position = 'absolute'
    div.style.contain = 'content'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.backgroundColor = 'rgba(255, 255, 255, .1)'
    div.style.border = `1px solid red`
    div.addEventListener('dblclick', (event) => {
        console.warn('dbclick', event)
    })
    return div
}

export function ensureSelectionDivs(container: HTMLElement, count: number): Array<HTMLDivElement> {
    const divs = Array.from(
        container.querySelectorAll<HTMLDivElement>(`[data-type=${SelectAreaDiv}]`),
    )

    if (divs.length > count) {
        divs.slice(count).forEach((div) => div.remove())
        return divs.slice(0, count)
    }

    if (divs.length < count) {
        const newDivs = Array.from({ length: count - divs.length }).map(() => createSelectionDiv())
        container.append(...newDivs)
        return divs.concat(newDivs)
    }

    return divs
}
