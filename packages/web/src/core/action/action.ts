import { Action } from '@honeysheet/shared'

export interface ActionTarget {
    dispatch(action: Action): void

    apply(action: Action): void

    revoke(action: Action): void
}
