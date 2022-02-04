const path = require('path')
import * as functions from "firebase-functions";
import pg from "./pg";
import near from "./near";
import * as fs from "fs";
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

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
			let words = String(req.body.query).split(' ')[0]

			let result = await pg.queryPublicIndexer(words)
			fl.log("queryIndexer result", result.rows)

			res.send({ contracts: result.rows })
			return result
		}catch (e) {
			fl.error("queryIndexer Error", e)
			res.status(502).send("Server Error")
			return Promise.reject(e)
		}
	})
});

// export const updateIndexTest = functions.https.onRequest(async (req, res): Promise<any> => {
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
			blocks.push(client.connection.provider.block({ blockId: block_id }))
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
		let batch = db.batch();
		for (let index in new_receipts) {
			let receipt = new_receipts[index]
			batch.set(db.collection('receipts').doc(receipt.receipt_id), receipt);
			if (parseInt(index) % 499 === 0) { // maximum of 500 batched operations in Firestore
				await batch.commit();
				batch = db.batch();
			}
		}
		await batch.commit();
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
