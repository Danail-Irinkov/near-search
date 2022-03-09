// @ts-ignore
import near_config from '../config/near_config'
import * as nearAPI from 'near-api-js'

// Exports
export async function init(app:any, store:any){
	try {
		let network = 'mainnet'
		let options = near_config(network)
		let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()

		// Defaulting to first account in keystore
		if (!store.user?.near_id) {
			store.accounts = [...(await keyStore.getAccounts(network))]
			if (store.accounts[0]) {
				store.user.near_id =  store.accounts[0]
			}
		}

		let near = await nearAPI.connect({ ...options, deps: { keyStore: keyStore }})
		let wallet = new nearAPI.WalletConnection(near, `${network}:${store.user.near_id}:`)
		let account = await near.account(store.user.near_id)
		store.accounts = [...(await keyStore.getAccounts(network))]

		// console.log('init app', app)
		// console.log('init state', state)
		app
			.provide('near', near)
			.provide('keyStore', keyStore)
			.provide('wallet', wallet)
			.provide('account', account)

	return {near, wallet, account}
	} catch (e) {
		console.error('Failed to initiate NEAR API')
	}
}
