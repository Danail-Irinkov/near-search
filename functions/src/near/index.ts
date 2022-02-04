// import rpc from './rpc'
import {Near, NearConfig} from "near-api-js/lib/near";
import * as nearAPI from "near-api-js";
import {ReceiptDoc, TransactionDoc} from "../types";

export default {
	initNEAR: async function (): Promise<Near> {
		const keyStore = new nearAPI.keyStores.InMemoryKeyStore()
		const config: NearConfig = {
			networkId: "mainnet",
			nodeUrl: "https://rpc.mainnet.near.org",
			walletUrl: "https://wallet.mainnet.near.org",
			helperUrl: "https://helper.mainnet.near.org",
			headers: {'searchNEAR': 'indexing'},
			keyStore,
			// explorerUrl: "https://explorer.mainnet.near.org",
		};
		return nearAPI.connect(config)
	},
	calcNEARBlockHeight: () => {
		let initial_block_time = new Date(Date.parse('22 Apr 2020 00:00:00 GMT')).getTime()/1000 - 2000000
		return Math.round(new Date().getTime()/1000 - initial_block_time)
	},
	getChunk: async function (near: Near, chunk_hash: string): Promise<any> {
		return near.connection.provider.chunk(chunk_hash);
	},
	parseBlock: async function (near: Near, block: any): Promise<any> {
		let chunk_queries = []

		// console.time('parseBlock get Chunks')
		for (let chunk of block.chunks) {
			if (chunk.chunk_hash) {
				// fl.log('updateIndex shard_id', chunk.chunk_hash, chunk.shard_id);
				chunk_queries.push(this.getChunk(near, chunk.chunk_hash))
			}
		}
		let chunks = await Promise.all(chunk_queries)
		// console.timeEnd('parseBlock get Chunks')

		// let transactions: any = []
		let receipts: any = []

		for (let chunk of chunks) {
			// _parseTransactions(block.header.height, chunk, transactions) // Disabled as receipts are better proof of activity
			_parseReceipts(block.header.height, chunk, receipts)
		}

		// return {transactions, receipts}
		return receipts
	},
}

// @ts-ignore
function _parseTransactions(block: number, chunk: any, transactions: any) {
	for (let transaction of chunk.transactions){
		// console.log('updateIndex transaction', transaction)
		let transaction_doc: TransactionDoc = {
			signer_id: transaction.signer_id,
			receiver_id: transaction.receiver_id,
			hash: transaction.hash,
			block: block,
		}
		for (let action of transaction.actions){
			if (action.FunctionCall) {
				// console.log('updateIndex method_name', action.FunctionCall.method_name, action.FunctionCall.deposit);
				// console.log('updateIndex FunctionCall', action.FunctionCall.method_name);
				transaction_doc.method = action.FunctionCall.method_name
				transaction_doc.deposit = action.FunctionCall.deposit
				if (action.FunctionCall.args && action.FunctionCall.args.length > 0 && action.FunctionCall.args.length < 250) {
					// console.time('parseBlock Args')
					let json_string = Buffer.from(action.FunctionCall.args, 'base64').toString()
					let args_json
					let arg_types: any = {}

					try {
						args_json = JSON.parse(json_string)
					} catch (e) {
						// console.log('JSON.parse err: ', json_string)
					}

					if(args_json) {
						// transaction_doc.args = action.FunctionCall.args
						// transaction_doc.args_json = action.FunctionCall.args_json
						// console.log('updateIndex args', args_json)
						for (let key in args_json) {
							arg_types[key] = typeof args_json[key]
						}
					}
					if (arg_types) {
						// console.log('updateIndex arg_types', arg_types)
						transaction_doc.arg_types = arg_types
					}
					// console.timeEnd('parseBlock Args')
				}
				transactions.push(transaction_doc)
			}
		}
	}
}

function _parseReceipts(block: number, chunk: any, receipts: any) {
	for (let receipt of chunk.receipts){
		if (receipt?.receipt?.Action) {
			// console.log('updateIndex receipt', receipt)
			let receipt_doc: ReceiptDoc = {
				signer_id: receipt.receipt.Action.signer_id,
				receiver_id: receipt.receiver_id,
				receipt_id: receipt.receipt_id,
				block: block,
			}

			for (let action of receipt.receipt.Action.actions){
				// console.log('updateIndex action', action)
				if (action.FunctionCall) {
					// console.log('updateIndex method_name', action.FunctionCall.method_name, action.FunctionCall.deposit);
					// console.log('updateIndex FunctionCall', action.FunctionCall.method_name);
					receipt_doc.method = action.FunctionCall.method_name
					receipt_doc.deposit = action.FunctionCall.deposit
					if (action.FunctionCall.args && action.FunctionCall.args.length > 0 && action.FunctionCall.args.length < 250) {
						// console.time('parseBlock Args')
						let json_string = Buffer.from(action.FunctionCall.args, 'base64').toString()
						let args_json
						let arg_types: any = {}

						try {
							args_json = JSON.parse(json_string)
						} catch (e) {
							// console.log('JSON.parse err: ', json_string)
						}

						if(args_json) {
							// receipt_doc.args = action.FunctionCall.args
							// receipt_doc.args_json = action.FunctionCall.args_json
							// console.log('updateIndex args', args_json)
							for (let key in args_json) {
								arg_types[key] = typeof args_json[key]
							}
						}
						if (arg_types) {
							// console.log('updateIndex arg_types', arg_types)
							receipt_doc.arg_types = arg_types
						}
						// console.timeEnd('parseBlock Args')
					}

					// console.log('updateIndex receipt_doc', receipt_doc);
					if(receipt_doc.deposit !== '0' || receipt_doc.receiver_id !== 'aurora')
						receipts.push(receipt_doc)
				}
			}
		}
	}
}
