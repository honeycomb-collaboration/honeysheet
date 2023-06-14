export interface MessagePortToWorkerData {
    url: string
    payload?: string
}

export interface MessagePortFromWorkerData {
    url: string
    payload: string
}
