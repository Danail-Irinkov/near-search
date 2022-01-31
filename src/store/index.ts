import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useMainStore = defineStore({
	id: 'main',
	state: () => ({
		contracts: useStorage('contracts', [])
	}),
	getters: {
		getContracts(): [] {
			return this.contracts
		},
	},
	actions: {
		getContractById(account_id: string): any {
			console.log('getContractById', account_id)
			let index = this.contracts.findIndex((c: Contract)=> c.account_id === account_id)
			let contract = null

			console.log('getContractById index', index)
			if(index !== -1)
				contract = this.contracts[index]

			return contract
		},
		updateContract(contract: Contract) {
			console.log('updateContract', contract)
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
export interface Contract {
	account_id: string;
	hits: number;
	parsingContract: boolean;
	show_methods: boolean;
	methods?: [];
	probableInterfaces?: [];
	byMethod?: object;
}
