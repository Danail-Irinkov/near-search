// const path = require('path')
// const service_account_key_path = path.resolve('near-api-1d073-beca07097e06.json')
// const test =  require('firebase-functions-test')({
// 	databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`,
// 	storageBucket: `${process.env.GCLOUD_PROJECT}.appspot.com`,
// 	projectId: `${process.env.GCLOUD_PROJECT}`,
// }, service_account_key_path);

const functions = require('firebase-functions');
const chai = require('chai');// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const assert = chai.assert;
const sinon = require('sinon'); // Sinon is a library used for mocking or verifying function calls in JavaScript.
process.env.IS_TEST = 'true'

describe('NEAR Search Tests', () => {
	let myFunctions

	before(() => {
		if (process.env.HIDE_LOGS) {
			sinon.stub(console, 'log')
			sinon.stub(functions.logger, 'log')
		}
		myFunctions = require('../src/index.ts');
	});

	after(() => {
		// Do cleanup tasks.
		if (process.env.HIDE_LOGS) {
			console.log.restore()
			functions.logger.log.restore()
		}
		// test.cleanup();
	});

	describe('Searching for "near"', () => {
		// it('returns a list', async () => {
		// 	try {
		// 		let res = await testHTTPFunction(myFunctions, 'queryIndexer',
		// 			{
		// 				body: {
		// 					query: 'nft'
		// 				}
		// 			}
		// 		)
		// 		// console.warn('Searching for "near"', res)
		// 		// assert.isTrue(!!(res.contracts))
		// 		assert.isTrue(true)
		//
		// 	}catch (e) {
		// 		return Promise.reject(e)
		// 	}
		// })
		// it('returns a method hints', async () => {
		// 	try {
		// 		let res = await testHTTPFunction(myFunctions, 'getMethodHints',
		// 			{
		// 				body: {
		// 					contract: 'srch.near',
		// 					method: 'call_contract'
		// 				}
		// 			}
		// 		)
		// 		// console.warn('Searching for "near"', res)
		// 		// assert.isTrue(!!(res.contracts))
		// 		assert.isTrue(true)
		//
		// 	}catch (e) {
		// 		return Promise.reject(e)
		// 	}
		// })
		// it('returns a list of Tickers from Kucoin', async () => { // Not working with pubsub functions atm
		// 	try {
		// 		let res = await testHTTPFunction(myFunctions, 'updateCandlesIndex',
		// 			{
		// 				body: {
		// 				}
		// 			}
		// 		)
		// 		console.warn('Kucoin Tickers Crazy Candles', res.candles.length)
		// 		// assert.isTrue(!!(res.contracts))
		// 		assert.isTrue(true)
		//
		// 	}catch (e) {
		// 		return Promise.reject(e)
		// 	}
		// })
	})
// 	describe('Updating Indexer', () => {
// 		it('returns a list', async () => {
// 			try {
// 				let res = await testHTTPFunction(myFunctions, 'updateIndexTest',
// 					{
// 						body: {}
// 					}
// 				)
// 				console.warn('Updating Indexer: ', res)
// 				// assert.isTrue(!!(res.contracts))
//
// 			}catch (e) {
// 				return Promise.reject(e)
// 			}
// 		})
// 	})


	// describe('Testing Migration Flow', () => {
	// 	it('returns a list', async () => {
	// 		try {
	// 			let res = await testHTTPFunction(myFunctions, 'updateIndexTest',
	// 				{
	// 					body: {
	// 						query: 'near'
	// 					}
	// 				}
	// 			)
	// 			// console.warn('Searching for "near"', res)
	// 			// assert.isTrue(!!(res.contracts))
	// 			assert.isTrue(res === 'Success')
	//
	// 		}catch (e) {
	// 			return Promise.reject(e)
	// 		}
	// 	})
	// })

})

const hookPostData = {
}

function testHTTPFunction(myFunctions, function_name, manual_request = {}, manual_response = {}) {
	return new Promise((resolve, reject) => {
		try {
			const req = {
				headers: { // Sample Slack request header
				},
				body: {// Sample Slack request body
					...hookPostData
				},
				...manual_request
			};
			// A fake response object, with a stubbed redirect function which does some assertions
			const res = {
				setHeader: sinon.stub(),
				getHeader: sinon.stub(),
				header: (a, b) => { return { send: (s)=>{} }},
				set: (a, b) => {},
				send: (res) => {
					resolve(res);
				},
				...manual_response
			};

			res.status = sinon.stub().returns(res)
			res.end = sinon.stub().returns(res)
			res.json = sinon.stub().returns(res)

			myFunctions[function_name](req, res)
		} catch (e) {
			console.warn('testHTTPFunction err: ', e)
			reject(e)
		}
	});
}
