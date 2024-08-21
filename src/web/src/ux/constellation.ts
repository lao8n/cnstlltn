import { IStackStyles, IStackItemTokens } from '@fluentui/react'

export const constellationStackStyle: IStackStyles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }
}

export const constellationHeaderStackStyle: IStackStyles = {
    root: {
        justifyContent: 'space-between',
    }
}

export const stackItemPadding: IStackItemTokens = {
    padding: 10,
}