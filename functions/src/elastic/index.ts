// @ts-ignore
import { Client } from '@elastic/elasticsearch'
import { config } from "firebase-functions"
import * as functions from "firebase-functions"
const fl = functions.logger;

const client = new Client({
	cloud: {
		id: 'searchnearnet:ZXVyb3BlLXdlc3QzLmdjcC5jbG91ZC5lcy5pbyRlNWI5M2YyMDMxY2M0MjJmOWExNWVkZDE1ZGU0Y2VlMCQyY2RjOWI4NWU3NzU0ZThhOTA1MmEyNzU0MjA5ODU3Ng=='
	},
	auth: {
		username: config().elastic.username,
		password: config().elastic.password
	}
})
function getCollectionSchema(collection:string){
	let schema = {}

	if (collection === 'receipts') {
		schema = {
			signer_id: { type: 'text' },
			receiver_id: { type: 'text' },
			deposit: { type: 'text' },
			deposit_near: { type: 'double' },
			method: { type: 'text' },
			arg_types: { type: 'object' },
			receipt_id: { type: 'text' },
			block: { type: 'integer' },
		}
	}
	if (collection === 'receipts2') {
		schema = {
			signer_id: { type: 'keyword' },
			receiver_id: { type: 'keyword' },
			deposit: { type: 'keyword' },
			deposit_near: { type: 'double' },
			method: { type: 'keyword' },
			arg_types: { type: 'object' },
			receipt_id: { type: 'keyword' },
			block: { type: 'integer' },
			first: { type: 'text' }, // Dev field for logging
			second: { type: 'text' }, // Dev field for logging
		}
	}
	if (collection === 'receipts3') {
		schema = {
			signer_id: { type: 'text' },
			receiver_id: { type: 'keyword' },
			deposit: { type: 'keyword' },
			deposit_near: { type: 'double' },
			method: { type: 'keyword' },
			arg_types: { type: 'object' },
			receipt_id: { type: 'text' },
			block: { type: 'integer' }
		}
	}

		return schema
}
export async function reindexFlow(collection:string, collection2:string){
	try {
		// Make sure to set mappings in getCollectionSchema() for the new index
		let d = await deleteIndex(collection2)
		console.log('deleteIndex', d.body)

		let c = await createCollection(collection2)
		console.log('createCollection', c.body)

		// let p = await createPipeline(collection2)
		// console.log('createPipeline', p.body)
		// let s00 = await initialState(collection2)
		// console.log('initialState0', s00.body.hits.hits)

		let r = await copyReIndex(collection, collection2)
		console.log('copyReIndex', r.body)

		// await createScript()
		let s1 = await parseDepositNearFields(collection2)
		console.log('parseDepositNearFields', s1.body)
		// let s0 = await initialState(collection2)
		// console.log('initialState', s0.body.hits.hits)
		// let s2 = await getScript()
		// console.log('getScript', s2.body)
		// @ts-ignore
		// let s3 = await testScript(collection2)
		// console.log('testScript', s3.body.hits.hits)


		//
		// let res = await SearchRecordsByQuery(collection2, {
		// 	query: {
		// 		match_all: {}
		// 	}
		// })
		// console.log('SearchRecordsByQuery', res.body.hits.hits)

		// await refreshIndex(collection2)
	} catch (e) {
		// @ts-ignore
		console.log('reindexFlow Err', e?.body?.error || e)
	}
}
export function createCollection(collection:string){
	return client.indices.create({
		index: collection,
		body: {
			mappings: {
				properties: getCollectionSchema(collection)
			}
		}
	}, { ignore: [400] })
}

export async function updateCollectionMapping(collection:string){
	await client.indices.close({index: collection})
	let asd = await client.indices.putMapping({
		index: collection,
		body: {
			properties: getCollectionSchema(collection)
		}
	}, { ignore: [400] })
	console.log('dasfasdfasdf', asd)
	return client.indices.open({index: collection})
}

export async function createPipeline(collection:string){
	return client.ingest.putPipeline({
		id: collection,
		body: {
			description: "convert string to long integer pipeline with handled exceptions",
			version: 1,
			processors: [
				{
					convert: {
						field: "_source.deposit",
						type: "unsigned_long"
					}
				}
			]
		}
	})
}
// Fore testing migration to a new index, when remapping fields
export let test_receipt = '69N6bDVYywqZu18iit28mXxzzNieACvNjuttiHvpeuVc'

export async function initialState(collection:string){
	return client.search({
		index: collection,
		body: {
			query: {
				match: {
					receipt_id: test_receipt
				}
			}
		}
	})
}
export async function createScript(){
	return client.putScript({
		id: 'convert_yocto_to_near',
		body: {
			script: {
			lang: 'painless',
			source:
			`
def dYocto = ctx._source.deposit;
double dNear = 0;
if(dYocto != null){
  def first = "0";
  def second = "0";
  int length = dYocto.length();
  int length_mid = dYocto.length() - 24;
  if(length < 25){
    int missing_zeroes = 24 - length;
    def prefix = "";
    int count = 0;
    while (count < missing_zeroes) {
		  prefix = prefix + "0";
		  count = count + 1;
		}
    second = prefix + dYocto;
  } else {
    first = dYocto.substring(0, length_mid);
    second = dYocto.substring(length_mid+1, length);
  } 
  // ctx._source.first = first;
  // second = second.substring(0, 10);
  // ctx._source.second = second;
  dNear = Double.parseDouble(first + "." + second);
}

ctx._source.deposit_near = dNear;
			`
			}
		}
	})
}
export function parseDepositNearFields(collection:string){
	return client.update_by_query({
		index: collection,
		refresh: true,
		body: {
			query: {
				bool: {
					must_not: {
						exists: {
							field: "deposit_near"
						}
					}
				}
			},
			script: {
				id: "convert_yocto_to_near"
			}
		}
	})
}
export function getScript(){
	return client.getScript({
		id: 'convert_yocto_to_near'
	})
}
export async function testScript(collection:string){
	console.time('testScript')
	await client.update_by_query({
		index: collection,
		refresh: true,
		body: {
			query: {
				bool: {
					must_not: {
						exists: {
							field: "deposit_near"
						}
					}
				}
			},
			script: {
				id: "convert_yocto_to_near"
			}
		}
	})

	console.timeEnd('testScript')

	// await (global as any).sleep(2500)
	//
	// return client.search({
	// 	index: collection,
	// 	body: {
	// 		query: {
	// 			match: {
	// 				receipt_id: test_receipt
	// 			}
	// 		}
	// 	}
	// })
}
export function copyReIndex(collection:string, collection2:string){
	return client.reindex({
		refresh: true,
		body: {
			source: {
				index: collection,
				query: {
					match_all: {}
				}
			},
			dest: {
				index: collection2
			}
		}
	})
}
export function refreshIndex(collection:string){
	return client.index({
		index: collection,
		// here we are forcing an index refresh,
		// otherwise we will not get any result
		// in the consequent search
		refresh: true,
		body: {
			receiver_id: 'nearMockUser',
		}
	})
}
export function deleteIndex(collection:string){
	return client.indices.delete({
		index: collection,
	})
}
export async function addRecordsToIndex(records: any[], collection: string = '') {
	try {
		await createCollection(collection)

		const body = records.flatMap(doc => {
			return [
			{
				index: {
					_index: collection,
					_id: doc.receipt_id
				}
			},
			doc,
			{
				update: { // Needed to allow for executing the script to convert string to Near amount
					_index: collection,
					_id: doc.receipt_id
				}
			},
			{
				script: { // Adding field _source.deposit_near by parsing .deposit to double
					id: 'convert_yocto_to_near'
				}
			}
			]})

		const { body: bulkResponse } = await client.bulk({ refresh: true, body })

		console.log('bulkResponse', bulkResponse.items)

		if (bulkResponse.errors) {
			const erroredDocuments: any[] = []
			// The items array has the same order of the dataset we just indexed.
			// The presence of the `error` key indicates that the operation
			// that we did for the document has failed.
			bulkResponse.items.forEach((action: any, i: number) => {
				const operation = Object.keys(action)[0]
				if (action[operation].error) {
					erroredDocuments.push({
						// If the status is 429 it means that you can retry the document,
						// otherwise it's very likely a mapping error, and you should
						// fix the document before to try it again.
						status: action[operation].status,
						error: action[operation].error,
						operation: body[i * 2],
						document: body[i * 2 + 1]
					})
				}
			})
			fl.log(`addRecordsToIndex ${collection} erroredDocuments`+ erroredDocuments.length, erroredDocuments)
			return new Error(`addRecordsToIndex ${collection} erroredDocuments: ` + erroredDocuments.length)
		}

		await refreshIndex(collection)

		return `Saved ${records.length} records`
	}catch (e) {
		return Promise.reject(e)
	}
}

export function SearchRecordsByQuery(collection: string = '', query: object = {} ) {
	return client.search({
		index: collection,
		body: query
	})
}
