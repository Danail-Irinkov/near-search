/**
 * For information on how to use node pg go to https://node-postgres.com/features
 */

// @ts-ignore
import { Pool, Client } from 'pg'

// const pool_testnet = new Pool({connectionString: 'postgres://public_readonly:nearprotocol@testnet.db.explorer.indexer.near.dev/testnet_explorer'})
const pool_mainnet = new Pool({
	connectionString: 'postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer',
	max: 1,
})
// const pool_mainnet = new Client({
// 	connectionString: 'postgres://public_readonly:nearprotocol@mainnet.db.explorer.indexer.near.dev/mainnet_explorer'})

export default {
	/**
	 * THIS IS A READ-ONLY DATABASE
	 *
	 * Example text and params:
	 * ```
	 * const text = 'SELECT * FROM user WHERE id = $1'
	 * const params = [1]
	 * ```
	 * * Take note that params is an array
	 * * Transactions - https://node-postgres.com/features/transactions won't work for that you would need a create a client
	 */
	// async queryTestnet(query_str: string, params: [string]) {
	// 	return pool_testnet.query(query_str, params)
	// },
	/**
	 * THIS IS A READ-ONLY DATABASE
	 * Example text and params:
	 * ```
	 * const text = 'SELECT * FROM user WHERE id = $1'
	 * const params = [1]
	 * ```
	 * * Take note that params is an array
	 * * Transactions - https://node-postgres.com/features/transactions won't work for that you would need a create a client
	 */
	async queryMainnet(query_str: string, params: [] = []) {
		try {
			console.log('queryMainnet Start', params)
			let res = await pool_mainnet.query(query_str, params)
			console.log('queryMainnet End', res.rows)
			return res
		} catch (e) {
			return Promise.reject(e)
		}
	},
}
process.on('exit', function (){
	pool_mainnet.end().then(()=>console.log('POOL Closed exit'))
});
process.on('SIGINT', function (){
	pool_mainnet.end().then(()=>console.log('POOL Closed SIGINT'))
});
process.on('SIGUSR1', function (){
	pool_mainnet.end().then(()=>console.log('POOL Closed SIGUSR1'))
});
process.on('SIGUSR2', function (){
	pool_mainnet.end().then(()=>console.log('POOL Closed SIGUSR2'))
});
process.on('uncaughtException', function (){
	pool_mainnet.end().then(()=>console.log('POOL Closed uncaughtException'))
});
