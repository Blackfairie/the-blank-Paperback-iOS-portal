import {DUINavigationButton,
    SourceStateManager} from '@paperback/types'
import {setStateData,
    retrieveStateData} from './Common'

export const authSettingsMenu = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'auth_settings',
        label: 'Authentication',
        form: App.createDUIForm({
            sections: async () => {
                const values = await retrieveStateData(stateManager)
                return [
                    App.createDUISection({
                        id: 'information',
                        header: undefined,
                        isHidden: false,
                        rows: async () => [
                            App.createDUIMultilineLabel({
                                label: 'TheBlank API Key',
                                value: 'You can get your API key from TheBlank website',
                                id: 'description'
                            })
                        ]
                    }),
                    App.createDUISection({
                        id: 'authSettings',
                        header: 'Authentication Settings',
                        footer: 'Never share your API key with anyone',
                        isHidden: false,
                        rows: async () => [
                            App.createDUIInputField({
                                id: 'apiKey',
                                label: 'API Key',
                                value: App.createDUIBinding({
                                    async get() {
                                        return values.apiKey
                                    },
                                    async set(newValue) {
                                        values.apiKey = newValue
                                        await setStateData(stateManager, values)
                                    }
                                })
                            })
                        ]
                    })
                ]
            }
        })
    })
}