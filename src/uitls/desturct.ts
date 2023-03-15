export function deleteAllKeys(instance: object): void {
    Object.keys(instance).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete instance[key]
    })
}
