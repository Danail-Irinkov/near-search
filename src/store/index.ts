import { defineStore } from 'pinia'
import { useStorage, RemovableRef } from '@vueuse/core'

export interface RootState {
	contracts: RemovableRef<Array<Contract>>;
}

export const useMainStore = defineStore({
	id: 'main',
	state: () => {
		return {
			contracts: useStorage('contracts', [])
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
