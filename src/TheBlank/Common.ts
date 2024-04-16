import {SourceStateManager} from '@paperback/types'

export async function getAuthorizationString(stateManager: SourceStateManager): Promise<string> {
    return (await stateManager.keychain.retrieve('authorization') as string | undefined) ?? ''
}

export async function retrieveStateData(stateManager: SourceStateManager) {
    const apiKey = (await stateManager.keychain.retrieve('apiKey') as string) ?? ''
    return { apiKey }
}

export async function setStateData(stateManager: SourceStateManager, data: Record<string, any>) {
    await setApiKey(stateManager, data['apiKey'] ?? '')
}

async function setApiKey(stateManager: SourceStateManager, apiKey: string) {
    await stateManager.keychain.store('apiKey', apiKey)
}