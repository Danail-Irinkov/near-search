// @ts-ignore
import fetch from 'node-fetch'
// @ts-ignore
import { Near, NearConfig } from 'near-api-js/lib/near';

export default {
	getBlockById: async function (block_id: number): Promise<any> {
		// "https://rpc.testnet.near.org/" // Testnet url
		return fetch("https://rpc.mainnet.near.org/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: "dontcare",
				method: "block",
				params: {
					block_id: block_id
				}
			}),
		});
	},
	getLastBlock: async function (near: Near): Promise<any> {
		return near.connection.provider.block({
			finality: "final",
		});
		// return fetch("https://rpc.mainnet.near.org/", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		jsonrpc: "2.0",
		// 		id: "dontcare",
		// 		method: "block",
		// 		params: {
		// 			finality: 'final'
		// 		}
		// 	}),
		// });
	}
}
