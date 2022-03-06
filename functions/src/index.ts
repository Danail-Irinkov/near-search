import * as path from 'path'
import * as functions from "firebase-functions";
// import pg from "./pg";
import near from "./near";
import * as kucoin from "./kucoin";
import * as fs from "fs";
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { addRecordsToIndex, SearchRecordsByQuery } from "./elastic";
// @ts-ignore
// import { createScript, reindexFlow, parseDepositNearFields } from "./elastic";
import { Candle } from "../types";

const firebaseConfig: any = {
	apiKey: "AIzaSyDfiXN-vr9aoexpFKBumbyVjGYCEl3REkE",
	authDomain: "near-search-3807d.firebaseapp.com",
	projectId: "near-search-3807d",
	storageBucket: "near-search-3807d.appspot.com",
	messagingSenderId: "852875902491",
	appId: "1:852875902491:web:861fd6ed328a420e7742be",
	measurementId: "G-DC8Y4KN5FM"
};
if(fs.existsSync('./near-search-3807d-firebase-adminsdk-ic0qs-021f1395c1.json') && !firebaseConfig.credential) {
	let serviceAccount = fs.readFileSync(path.resolve('./near-search-3807d-firebase-adminsdk-ic0qs-021f1395c1.json')).toString();
	firebaseConfig.credential = cert(JSON.parse(serviceAccount))
}

initializeApp(firebaseConfig)
const db = getFirestore()
db.settings({ ignoreUndefinedProperties: true })

const cors = require('cors')({origin: true});
const fl = functions.logger;

export const queryIndexer = functions.region('europe-west3').https.onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			fl.log("queryIndexer input", req.body);
			let query = String(req.body.query).replace(' ', '*')
			let contracts = []

			let result: any = await SearchRecordsByQuery('receipts2', {
				query: {
					bool: {
						must: [
							{
								query_string: {
									query: `*${query}*`,
									fields: ['receiver_id', 'method']
								},
							},
							{
								range: {
									block: { gte: getBlockHeightByDaysAgo(28) }
								}
							}
						]
					}
				},
				size: 0,
				aggs: {
					accounts: {
						terms: {
							field: 'receiver_id',
							order: { total_deposits: 'desc' }
						},
						aggs: {
							total_deposits: { sum: { field: 'deposit_near' } },
							avg_deposit: { avg: { field: 'deposit_near' } }
						}
					}
				}
			})
			// console.log("queryIndexer results", result.body.hits.hits.length)
			// console.log("queryIndexer result", result.body.hits.hits[0])
			// console.log("queryIndexer aggregations", result.body.aggregations.accounts.buckets[0])
			// console.log("queryIndexer aggregations.length", result.body.aggregations.accounts.buckets.length)

			for (let agg of result.body.aggregations.accounts.buckets) {
				contracts.push({
					account_id: agg.key,
					hits: agg.doc_count,
					avg_deposit: agg.avg_deposit.value,
					total_deposits: agg.total_deposits.value,
				})
			}

			res.send({ contracts })
			return { contracts }
		}catch (e) {
			fl.error("queryIndexer Error", e)
			res.status(502).send("Server Error")
			return Promise.reject(e)
		}
	})
});

export const getMethodHints = functions.region('europe-west3').https.onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			fl.log("getMethodHints input", req.body);
			let contract = String(req.body.contract)
			// let method = String(req.body.method)
			let method_hints: any = {}

			let result: any = await SearchRecordsByQuery('receipts2', {
				query: {
					bool: {
						must: [
							{
								match: {
									receiver_id: contract,
								},
							},
							{
								range: {
									block: { gte: getBlockHeightByDaysAgo(28) }
								}
							}
						]
					}
				},
				size: 10000,
			})

			let total_hits = result.body.hits.hits.length
			console.log("queryIndexer result", result.body.hits.hits[0])

			// Merging all method call results to an aggregation of its arguments usage
			for (let hit of result.body.hits.hits) {
				let receipt = hit._source
				if (!method_hints[receipt.method]) {
					method_hints[receipt.method] = {
						total_hits: 0,
						total_deposits: 0,
						avg_deposit: 0,
					}
				}
				method_hints[receipt.method].total_hits += 1
				method_hints[receipt.method].total_deposits += receipt.deposit_near

				for (let argument in receipt.arg_types) {
					if (!method_hints[receipt.method][argument]) {
						method_hints[receipt.method][argument] = {
							type: [receipt.arg_types[argument]],
							used_count: 1
						}
					} else {
						method_hints[receipt.method][argument].used_count++
						if (method_hints[receipt.method][argument].type.indexOf(receipt.arg_types[argument]) === -1)
							method_hints[receipt.method][argument].type.push(receipt.arg_types[argument])
					}
				}
			}

			// Adding used_percent for each argument
			for (let key in method_hints) {
				let method = method_hints[key]
				method.avg_deposit = method.total_deposits/method.total_hits
				for (let key in method) {
					if (typeof method[key] === 'object'){
						method[key].used_percent = method[key].used_count/method.total_hits
					}
				}
			}
			console.log('getMethodHits total_hits', total_hits)
			console.log('getMethodHits method_hints', method_hints)

			res.send({ method_hints })
			return { method_hints }
		}catch (e) {
			fl.error("getMethodHits Error", e)
			res.status(502).send("Server Error")
			return Promise.reject(e)
		}
	})
});

export const updateIndexTest = functions.https.onRequest(async (req, res): Promise<any> => {
	const snapshot = await db.collection('receipts').doc('21T4J4c8Hzo4TxW8JyDHt2hqTDsU6n4Zo5vmvoJGTxTa').get()
	// const receipts =  snapshot.docs.map(doc => doc.data());
	// fl.log('Saved receipts.length', receipts.length)
	console.log('snapshot.data()', snapshot.data())
	// let reIndexing = await reindexFlow('receipts2', 'receipts3')
	// fl.log('Saved Index reIndexing', reIndexing)
	// await createScript()
	// let s1 = await parseDepositNearFields('receipts2')
	// fl.log('Saved Index parseDepositNearFields', s1)
	// let saved = await addRecordsToIndex([snapshot.data()], 'receipts2')
	// fl.log('Saved Index', saved)
	return res.send('Success')
})
export const updateIndex = functions.region('europe-west3').runWith({ memory: '512MB' }).pubsub.schedule('*/5 * * * *').timeZone('EET').onRun(async (context): Promise<any> => {
	try {
		fl.log('updateIndex Start');
		const client = await near.initNEAR()

		console.time('updateIndexTest getBlocks')
		let last_block = await client.connection.provider.block({
			finality: "final",
		})
		let last_parsed_block_id = (await db.collection('state').doc('updateIndex').get()).data()?.last_parsed_block_id || last_block.header.height - 300
		let blocks = []
		let iter = 0
		for (let block_id = last_block.header.height; block_id !== last_parsed_block_id && iter < 300; block_id--) {
			blocks.push(client.connection.provider.block({ blockId: block_id }).catch((e)=>fl.error(e)))
			iter++
		}

		fl.log('blocks.length', blocks.length)
		blocks = await Promise.all(blocks)
		blocks.push(last_block)
		console.timeEnd('updateIndexTest getBlocks')
		// console.log('last_block', last_block)

		let results = []

		console.time('updateIndexTest parseBlocks')
		for (let block of blocks) {
			results.push(near.parseBlock(client, block))
		}
		results = await Promise.all(results)

		let new_receipts = []
		for (let receipts of results){
			new_receipts.push(...receipts)
		}

		fl.log('new_receipts', new_receipts.length)
		console.timeEnd('updateIndexTest parseBlocks')
		console.time('updateIndexTest saving Receipts')
		let saved = await addRecordsToIndex(new_receipts, 'receipts2')
		fl.log('Saved Index', saved)
		// let batch = db.batch();
		// for (let index in new_receipts) {
		// 	let receipt = new_receipts[index]
		// 	batch.set(db.collection('receipts').doc(receipt.receipt_id), receipt);
		// 	if (parseInt(index) % 499 === 0) { // maximum of 500 batched operations in Firestore
		// 		await batch.commit();
		// 		batch = db.batch();
		// 	}
		// }
		// await batch.commit();
		console.timeEnd('updateIndexTest saving Receipts')

		await db.collection('state').doc('updateIndex').set({ last_parsed_block_id: last_block.header.height})
		// res.send('Success')
		return 'Success'
	} catch (e) {
		fl.error('updateIndex Error', e);
		// res.status(502).send('Error')
		return Promise.reject(e)
	}
});

// export const updateCandlesIndex = functions.https.onRequest(async (req, res): Promise<any> => {
export const updateCandlesIndex = functions.region('europe-west3').runWith({ memory: '512MB' }).pubsub.schedule('5 * * * *').timeZone('EET').onRun(async (context): Promise<any> => {
	try {
		fl.log('updateCandlesIndex Start')
		const tickers = await kucoin.getAllTickers()
		// console.log('updateCandlesIndex tickers', tickers.data)
		let promises: Promise<Candle>[] = []
		let last_candle_timestamp = (await db.collection('state').doc('updateIndex').get()).data()?.last_candle_timestamp || 0
		let now_timestamp = new Date().getTime()/1000
		let factor = 1.30

		for (let ticker of tickers.data.ticker) {
			if (ticker && parseFloat(ticker.volValue) > 10) {
				let low_benchmark = parseFloat(ticker.averagePrice)/factor
				let high_benchmark = parseFloat(ticker.averagePrice)*factor
				if (parseFloat(ticker.high) > high_benchmark || parseFloat(ticker.low) < low_benchmark) {
					// console.log('updateCandlesIndex symbol', ticker.symbol)
					promises.push(kucoin.findCrazyCandles(ticker, '1hour', last_candle_timestamp))
				}
			}

		}

		let candles: Candle[] = (await Promise.all(promises)).flat()
		console.log('updateCandlesIndex candles', candles.length)

		if (candles.length)
			await addRecordsToIndex(candles, 'candles')

		await db.collection('state').doc('updateIndex').set({ last_candle_timestamp: now_timestamp})
		// res.send({candles})
		return candles
	} catch (e) {
		fl.error('updateIndex Error', e);
		// res.status(502).send('Error')
		return Promise.reject(e)
	}
});

export const queryCandlesIndexer = functions.region('europe-west3').https.onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			fl.log("queryCandlesIndexer input", req.body);
			let query = String(req.body.query).replace(' ', '*')

			let date = new Date();
			date.setDate(date.getDate()-7);

			let result: any = await SearchRecordsByQuery('candles', {
				sort : [
					{ crazy_score: 'desc' },
				],
				query: {
					bool: {
						must: [
							{
								query_string: {
									query: `*${query}*`,
									fields: ['symbol']
								},
							},
							{
								range: {
									time: { gte: date.getTime()/1000 }
								}
							}
						]
					}
				},
				size: 100,
			})
			console.log("queryCandlesIndexer results", result.body.hits.hits.length)

			let candles = result.body.hits.hits.map((el: any) => el._source)

			res.send({ candles })
			return { candles }
		}catch (e) {
			fl.error("queryIndexer Error", e)
			res.status(502).send("Server Error")
			return Promise.reject(e)
		}
	})
});

(global as any).sleep = async function(ms:number) {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

function getBlockHeightByDaysAgo(days_ago: number) {
	let referenceBlock = {
		timestamp: 1645589047,
		height: 60077923,
	}

	let seconds_ago = days_ago * 24 * 60 * 60
	let timestamp_now = new Date().getTime()/1000
	let height = Math.round(referenceBlock.height + (timestamp_now - seconds_ago - referenceBlock.timestamp) / 1.266)

	console.log('requested Height', height)
	return height
}
