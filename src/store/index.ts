import { defineStore } from 'pinia'
import { useStorage, RemovableRef } from '@vueuse/core'
import { Candle } from "../../functions/src/types";

export interface Contract {
	account_id: string;
	hits: number;
	parsingContract: boolean;
	show_methods: boolean;
	methods?: [];
	probableInterfaces?: [];
	byMethod?: object;
}
export interface User {
	email: string;
	near_id: string;
	xdroid_push_id: string;
	google_token: string | null;
	enable_notifications: Boolean;
}
export interface RootState {
	user: User,
	show_login_dropdown: Boolean,
	trigger_wallet_signin: Boolean,
	update_selected_account: Boolean,
	show_hits: Boolean,
	showContracts: Boolean,
	resultsContracts: RemovableRef<Array<Contract>>,
	showCandles: Boolean,
	resultsCandles: RemovableRef<Array<Candle>>,
	contracts: RemovableRef<Array<Contract>>;
	accounts: RemovableRef<Array<String>>;
	selected_account: RemovableRef<String>;
}

export interface Notification {
	title: string,
	subtitle: string,
	url: string,
}

export const useStore = defineStore({
	id: 'main',
	state: () => {
		// @ts-ignore
		return {
			user: useStorage('user', {}),
			show_login_dropdown: false,
			trigger_wallet_signin: false,
			update_selected_account: false,
			show_hits: useStorage('show_hits', false),
			showContracts: useStorage('showContracts', false),
			resultsContracts: useStorage('resultsContracts', []),
			showCandles: useStorage('showContracts', false),
			resultsCandles: useStorage('resultsCandles', []),
			contracts: useStorage('contracts', []),
			accounts: useStorage('accounts', []),
			selected_account: useStorage('selected_account', '')
		} as RootState
	},
	getters: {
		getContracts(): Contract[] {
			return this.contracts
		},
	},
	actions: {
		getContractById(account_id: string): Contract | null {
			console.log('getContractById', account_id)
			let index = this.contracts.findIndex((c: Contract)=> c.account_id === account_id)
			let contract = null

			console.log('getContractById index', index)
			if(index !== -1)
				contract = this.contracts[index]

			return contract
		},
		updateContract(contract: Contract) {
			// console.log('updateContract', contract)
			let index = this.contracts.findIndex((c: Contract)=> c.account_id === contract.account_id)
			if(index === -1)
				this.contracts.push(contract);
			else
				this.contracts.splice(index, 1, contract)
		},
		removeContract(index: number) {
			this.contracts.splice(index, 1)
		}
	},
})
