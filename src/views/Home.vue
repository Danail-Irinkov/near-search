<template>
	<div class="header" id="wikiApp">
		<Head>
			<title>NEAR Search</title>
			<meta name="description" content="Search the NEAR Network for Contracts and review their methods" />
		</Head>
		<h1 class="cover-heading">NEAR Search</h1>
		<div class="medium-6 medium-offset-3 ctrl px-6">
			<form class="searchForm" @submit.prevent="submitSearch">
				<input type="text" v-model="searchQuery" placeholder="Search NEAR Contracts">
				<span v-show="searchQuery" class="remove-btn"
							@click="removeSearchQuery">
					<fa-icon icon="times"/>
				</span>
				<span class="search-btn" @click="submitSearch">
					<fa-icon v-if="isSearching" icon="spinner" class="fa-spin"/>
					<fa-icon v-else icon="search"/>
				</span>
				<span class="search-btn-mock" v-if="showMockResult" @click="mockSearch">
					<fa-icon v-if="isSearching" icon="spinner" class="fa-spin"/>
					<fa-icon v-else icon="chevron-right"/>
				</span>
			</form>
		</div>
		<expand-height-transition>
			<div class="contracts pl-8" v-show="isResult">
				<div class="row">
					<div class="row" style="max-height: 36px">
						<div class="mb-2 transition-all"
									:class="{'col-span-6': show_hits, 'col-span-8': !show_hits }">
							<h3 class="text-headline text-left"></h3>
						</div>
						<div class="col-span-2 mb-2"
								 v-tooltip:right.tooltip="'Deposits Total Ⓝ in the last 4 weeks'">
							<fa-icon icon="funnel-dollar" style="font-size: 24px"/>
						</div>
						<div class="mb-2 transition-all cursor-pointer"
								 :class="{'col-span-2 show': show_hits, 'col-span-1 shift-left': !show_hits }"
								 v-tooltip:right.tooltip="'Method Calls in the last 4 weeks'">
							<fa-icon icon="stopwatch" style="font-size: 24px" @click="show_hits = !show_hits"/>
						</div>
						<div class="mb-2"
								 :class="{'col-span-1': show_hits, 'col-span-1': !show_hits }">
	<!--						<h4 class="text-headline text-center italic">-->
	<!--							<fa-icon icon="cog"/>-->
	<!--						</h4>-->
						</div>
					</div>
					<div class="row"
						 v-for="(contract, contract_index) in contracts">
						<div class="link transition-all"
								 :class="{'col-span-6': show_hits, 'col-span-8': !show_hits }"
								 @click="fetchContract(contract)">
							<h3 class="text-headline text-left">
								{{ contract.account_id }}
								<span class="contract-spinner" v-if="contract.parsingContract">
									<fa-icon icon="circle-notch" class="fa-spin"/>
								</span>
							</h3>
						</div>
						<div class="col-span-2">
							<h3 class="text-headline text-center transition-all"
									:class="{'font-semibold': abbreviateNumber(contract.total_deposits).indexOf('K') !== -1, 'font-bold text-slate-800': abbreviateNumber(contract.total_deposits).indexOf('M') !== -1}">
								{{ abbreviateNumber(contract.total_deposits) }}
							</h3>
						</div>
						<div class="col-span-2 transition-all hidden-right" v-if="show_hits"
								 :class="{ 'show': show_hits, 'font-semibold': abbreviateNumber(contract.total_deposits).indexOf('K') !== -1, 'font-bold text-slate-800': abbreviateNumber(contract.total_deposits).indexOf('M') !== -1}">
							<h3 class="text-headline text-center">{{ abbreviateNumber(contract.hits) }}</h3>
						</div>
						<div class="col-span-2">
							<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'NEAR Explorer'">
								<button class="outline-0" style="font-size: 24px; overflow: hidden;"
												v-if="contracts[contract_index].account_id"
												@click="openLinkNewTab(`https://explorer.near.org/accounts/${contracts[contract_index].account_id}`)">
									<img :src="NEARsvg" class="near-explorer-logo" alt="near-explorer-logo" />
								</button>
							</div>
							<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Stats Gallery'">
								<button class="outline-0" style="font-size: 24px; overflow: hidden;"
												v-if="contracts[contract_index].account_id"
												@click="openLinkNewTab(`https://stats.gallery/mainnet/${contracts[contract_index].account_id}/overview?t=week`)">
									<img :src="statsGalleryLogo" class="stats-gallery-logo" alt="stats-gallery-logo" />
								</button>
							</div>
						</div>
						<div v-if="(!contract.methods || !Object.keys(contract.methods).length) && contract.show_methods"
								 class="col-span-12 text-left text-lg pl-4 my-4">
							No Contract Found
						</div>
						<div v-if="contract.methods && contract.show_methods" class="col-span-12">
							<div v-for="(value, method) in contract.methods" class="method w-full">
								<div class="text-left w-full"
										 @click="toggleMethod(contract_index, method)">
									<fa-icon class="method-chevron ml-4"
													 :class="{ 'rotate-chevron-down': isContractMethodOpened(contract_index, method)}"
											icon="chevron-right"/>
									<div class="method ml-4 pointer text-lg">
										{{ method }}
									</div>
								</div>
								<expand-height-transition class="col-span-12">
									<div class="row text-left pl-8 pointer" style="min-height: 24px"
											 v-if="isContractMethodOpened(contract_index, method)">
										<div class="method-inputs col-span-9 grid grid-cols-12">
											<div class="col-span-2 text-center">
												<fa-icon icon="list-ul" class="align-bottom mt-3"/>
											</div>
											<div class="col-span-10 relative">
												<input
													v-model="contracts[contract_index].methods[method].arguments"
													type="text"
													class="m-0 p-2"
												/>
												<span class="absolute" style="right: -7px; top: 15px; font-size: 12px;">
													{JSON}
												</span>
											</div>
											<div class="col-span-2 text-center">
												<fa-icon icon="hand-holding-usd" class="align-bottom mt-3"/>
											</div>
											<div class="col-span-10 relative">
												<input
													v-model="contracts[contract_index].methods[method].deposit"
													type="text"
													class="m-0 mb-4 p-2"
												/>
												<span class="absolute right-0" style="top: 3px; font-size: 27px;">
													Ⓝ
												</span>
											</div>
										</div>
										<div class="method-actions grid col-span-3 text-center justify-center items-center">
											<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Call Function'">
												<button class="outline-0" style="font-size: 32px; transform: scale(0.8)"
																@click="callMethod(contract_index, method)">
													<fa-icon v-if="isContractMethodInCall(contract_index, method)" icon="circle-notch" class="fa-spin"/>
													<fa-icon v-else icon="play"/>
												</button>
											</div>
										</div>
										<div class="grid grid-cols-12 col-span-9">
											<div class="grid grid-cols-12 col-span-12" v-if="contracts[contract_index].methods[method].logs">
												<div class="col-span-2 inline-grid justify-center">
													<fa-icon icon="clipboard-list" class="self-center"/>
												</div>
												<div class="col-span-10 relative">
													<textarea-auto class="m-0 p-2"
																				 :value="contracts[contract_index].methods[method].logs"
																				 disabled>
													</textarea-auto>
													<span class="textarea-label">
														Logs
													</span>
												</div>
											</div>
											
											<div class="grid grid-cols-12 col-span-12" v-if="contracts[contract_index].methods[method].result">
												<div class="col-span-2 inline-grid justify-center">
													<fa-icon icon="receipt" class="self-center"/>
												</div>
												<div class="col-span-10 relative">
													<textarea-auto class="m-0 p-2"
																				 :value="contracts[contract_index].methods[method].result"
																				 disabled
																				 :rows="2">
													</textarea-auto>
													<span class="textarea-label">
														Result
													</span>
												</div>
											</div>
										</div>
										<div class="method-actions grid col-span-3 text-center justify-center items-center">
											<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Clear Logs'">
												<button class="outline-0" style="font-size: 24px"
																v-if="contracts[contract_index].methods[method].logs"
																@click="contracts[contract_index].methods[method].logs = ''">
													<fa-icon icon="times"/>
												</button>
											</div>
											<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Clear Result'">
												<button class="outline-0" style="font-size: 24px"
																v-if="contracts[contract_index].methods[method].result"
																@click="contracts[contract_index].methods[method].result = ''">
													<fa-icon icon="times"/>
												</button>
											</div>
										</div>
									</div>
								</expand-height-transition>
							</div>
						</div>
					</div>
				</div>
			</div>
		</expand-height-transition>
	</div>
</template>

<script>
import { Head } from '@egoist/vue-head'
import * as nearAPI from 'near-api-js'
import near_config from '../components/near_config'
import {parseContract} from 'near-contract-parser'
import NEARsvg from '../assets/NEAR/SVG/near_icon.svg'
import statsGalleryLogo from '../assets/stats_gallery_logo.png'
import deepmerge from 'deepmerge'
import { mapStores } from 'pinia'
import { useMainStore } from '../store/index'

export default {
	el: '#near_search',
	name: 'NearSearch',
	inject: {
		openLinkNewTab: {
			from: 'openLinkNewTab'
		}
	},
	setup() {
		return {
			NEARsvg,
			statsGalleryLogo
		};
	},
	components: {
		Head,
	},
	data() {
		return {
			contracts: [],
			isSearching: false,
			isResult: false,
			show_hits: false,
			showMockResult: false,
			searchQuery: '',
			network: 'mainnet',
			near: {},
		}
	},
	async mounted() {
		console.log('mounted Start 2', window.API_URL)
		this.showMockResult = window.API_URL.indexOf('localhost') !== -1
		
		let options = near_config('mainnet')
		
		let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
		
		this.near = await nearAPI.connect({ ...options, deps: { keyStore }});
		
		// TODO: if not logged in with NEAR ask user to requestSigning for him
		
	},
	computed: {
		...mapStores(useMainStore),
	},
	filters: {
	},
	methods: {
		async submitSearch() {
			try {
				// console.log('submitSearch Start', API_URL) // Also works
				console.time('queryPool')
				this.isSearching = true;
				let res = await this.axios.post(window.API_URL+'/queryIndexer', { query: this.searchQuery })
				console.timeEnd('queryPool')
				console.log('queryPool res', res.data.contracts)
				this.contracts = [...res.data.contracts]
				
				this.updateContractsFromLocalStorage()
				
				this.isSearching = false
				this.isResult = this.contracts && this.contracts.length
				return res
			} catch (e) {
				this.isSearching = false
				console.timeEnd('queryPool')
				console.error('queryPool err', e)
				return Promise.reject(e)
			}
		},
		mockSearch() {
			this.contracts = [
				{ account_id: 'daniellau.near', hits: '85' },
		    { account_id: 'dante18.near', hits: '13' },
		    { account_id: 'dangvanha.near', hits: '9' },
		    { account_id: 'danielflanagan.near', hits: '3' }
		  ];
			this.updateContractsFromLocalStorage()
			this.isResult = true;
		},
		updateContractsFromLocalStorage() {
			let stored_contracts = this.mainStore.contracts
			
			for (let key in this.contracts) {
				let contract = this.contracts[key]
				let stored_index = stored_contracts.findIndex((c)=> c.account_id === contract.account_id)
				console.log('stored_contracts', stored_contracts[stored_index])
				if(stored_index !== -1) {
					console.log('stored_contracts merged', deepmerge(contract, stored_contracts[stored_index]))
					this.contracts[key] = deepmerge(contract, stored_contracts[stored_index])
				}
			}
		},
		removeSearchQuery() {
			this.searchQuery = '';
			this.isResult = false;
		},
		isContractMethodOpened(contract_index, method) {
			return this.contracts[contract_index]?.methods[method]?.is_opened
		},
		isContractMethodInCall(contract_index, method) {
			return this.contracts[contract_index]?.methods[method]?.is_in_call
		},
		toggleMethod(contract_index, method) {
			console.log('toggleMethod', method)
			this.contracts[contract_index].methods[method].is_opened = !this.contracts[contract_index].methods[method].is_opened
			
		},
		callMethod(contract_index, method) {
			let contract_id = this.contracts[contract_index].account_id
			console.log('Calling a method', contract_id, method)
			this.mainStore.updateContract(this.contracts[contract_index])
			this.contracts[contract_index].methods[method].is_in_call = !this.contracts[contract_index].methods[method].is_in_call
			
			// TODO: do the calling method flow
			
		},
		async fetchContract(contract){
			try {
				console.log('fetchContract Start')
				contract.parsingContract = true
				let parsed_contract
				if (!contract.methods) {
					const { code_base64 } = await this.near.connection.provider.query({
						account_id: contract.account_id,
						finality: 'final',
						request_type: 'view_code',
					});
					console.log('fetchContract Start 2')
					parsed_contract = await parseContract(code_base64)
					console.log('fetchContract parsed_contract', parsed_contract)
					contract.byMethod = parsed_contract.byMethod
					
					console.log('fetchContract contract', contract)
					if(!contract.methods)
						contract.methods = {}
					
					for (let method of parsed_contract.methodNames) {
						if(method && !contract.methods[method])
							contract.methods[method] = {
							name: method,
							is_opened: false,
							is_in_call: false,
							arguments: '{}',
							deposit: 0,
							logs: '',
							result: '',
						}
					}
					// contract.methods = methods
					contract.probableInterfaces = parsed_contract.probableInterfaces
				}
				contract.show_methods = !contract.show_methods
				contract.parsingContract = false
				
				this.mainStore.updateContract(contract)
				
				return contract
			} catch (e) {
				contract.parsingContract = false
				console.error('fetchContract Error: ', e)
				return Promise.reject(e)
			}
		},
	}
}
</script>

<style lang="scss">
$c-white: #F7EFE2;
$c-black: #00000042;
$c-warning: #F9A603;
$c-near: #999999FF;
$c-near-blue: #00bcd4;
body,
html {
	width: 100%;
	height: 100%;
	background: val($c-white);
	font-family: 'Source Sans Pro', sans-serif;
}
a {
	color: #333;
}

.ctrl {
	margin-bottom: 1.6rem;
}

h1,
h2 {
	font-family: 'Source Sans Pro', sans-serif;
}

.header {
	color: #555;
	height: 100%;
	text-align: center;
	padding: 12vh 0;
	max-width: 600px;
	margin: 0 auto;
}

.header .cover-heading {
	font-size: 46px;
	color: val($c-near);
	margin-top: 1.6rem;
	margin-bottom: 1.6rem;
}
.remove-btn {
	font-size: 26px;
	color: val($c-warning);
	cursor: pointer;
	top: 0;
	right: 36px;
	position: absolute;
}
.search-btn {
	font-size: 26px;
	color: val($c-warning);
	cursor: pointer;
	top: 0;
	right: 0;
	position: absolute;
	transform: rotate(70deg);
}
.search-btn-mock {
	font-size: 26px;
	color: val($c-warning);
	cursor: pointer;
	top: 0;
	right: -30px;
	position: absolute;
}
.contract-spinner {
	//@apply col-span-12 py-4;
	font-size: 36px;
	color: val($c-warning);
	display: inline-block;
	float: right;
	transform: scale(0.8);
	& > svg {
		margin: 0 auto;
	}
}
.method {
	//font-size: 26px;
	color: val($c-warning);
	cursor: pointer;
	display: inline-block;
}
.method-chevron {
	//font-size: 26px;
	width: 16px;
	height: 16px;
	color: val($c-warning);
	cursor: pointer;
	display: inline-block;
	top: 1px;
	position: relative;
	transition-duration: 0.5s;
}
.rotate-chevron-down {
	transform: rotateZ(90deg);
}
.searchForm {
	margin-bottom: 2.6rem;
	position: relative;
}

.text-body-1 {
	font-size: 15px;
	line-height: 20px;
	padding-top: 12px;
	margin-bottom: 1.4rem;
	letter-spacing: 0;
}

.text-headline {
	font-size: 24px;
	line-height: 32px;
	//padding-top: 16px;
	//margin-bottom: 12px;
	height: 100%;
	letter-spacing: 0;
	word-break: break-word;
	display:flex;
	justify-content:center;
	align-items:center;
	text-align: center;
}

/* Material Design code below */
.raised-button {
	display: inline-block;
	text-align: center;
	line-height: 1;
	cursor: pointer;
	-webkit-appearance: none;
	transition: all 0.25s ease-out;
	vertical-align: middle;
	border: 1px solid transparent;
	border-radius: 2px;
	padding: 0.85em 1em;
	margin: 0 1rem 1rem 0;
	font-size: 0.9rem;
	background: var($c-near);
	color: var($c-white);
}
.raised-button:hover, .raised-button:focus {
	background: var($c-warning);
	color: var($c-white);
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
}

button:focus 		{ outline:none; }
input:focus 		{ outline:none; }

[type="text"], [type="password"], [type="date"], [type="datetime"], [type="datetime-local"], [type="month"], [type="week"], [type="email"], [type="number"], [type="search"], [type="tel"], [type="time"], [type="url"], [type="color"], textarea {
	display: block;
	box-sizing: border-box;
	width: 100%;
	height: 2.4375rem;
	padding: 0.5rem;
	border: 0;
	margin: 0 0 1rem;
	font-family: inherit;
	font-size: 1rem;
	color: var($c-near);
	background-color: var($c-white);
	box-shadow: none;
	border-radius: 0;
	transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
	-webkit-appearance: none;
	-moz-appearance: none;
}
input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="week"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="time"], input[type="url"], input[type="color"], textarea {
	//padding: 1rem 0 0.5rem 0;
	//margin: 1.75rem 0 0.5rem;
	border-bottom: 1px solid #e0e0e0;
	border-radius: 0;
	background: transparent;
}
input[type="text"]::-webkit-input-placeholder, input[type="text"]::-webkit-input-placeholder, input[type="password"]::-webkit-input-placeholder, input[type="password"]::-webkit-input-placeholder, input[type="date"]::-webkit-input-placeholder, input[type="date"]::-webkit-input-placeholder, input[type="datetime"]::-webkit-input-placeholder, input[type="datetime"]::-webkit-input-placeholder, input[type="datetime-local"]::-webkit-input-placeholder, input[type="datetime-local"]::-webkit-input-placeholder, input[type="month"]::-webkit-input-placeholder, input[type="month"]::-webkit-input-placeholder, input[type="week"]::-webkit-input-placeholder, input[type="week"]::-webkit-input-placeholder, input[type="email"]::-webkit-input-placeholder, input[type="email"]::-webkit-input-placeholder, input[type="number"]::-webkit-input-placeholder, input[type="number"]::-webkit-input-placeholder, input[type="search"]::-webkit-input-placeholder, input[type="search"]::-webkit-input-placeholder, input[type="tel"]::-webkit-input-placeholder, input[type="tel"]::-webkit-input-placeholder, input[type="time"]::-webkit-input-placeholder, input[type="time"]::-webkit-input-placeholder, input[type="url"]::-webkit-input-placeholder, input[type="url"]::-webkit-input-placeholder, input[type="color"]::-webkit-input-placeholder, input[type="color"]::-webkit-input-placeholder, textarea::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	color: var($c-black);
}
input[type="text"]:-moz-placeholder, input[type="text"]::-moz-placeholder, input[type="password"]:-moz-placeholder, input[type="password"]::-moz-placeholder, input[type="date"]:-moz-placeholder, input[type="date"]::-moz-placeholder, input[type="datetime"]:-moz-placeholder, input[type="datetime"]::-moz-placeholder, input[type="datetime-local"]:-moz-placeholder, input[type="datetime-local"]::-moz-placeholder, input[type="month"]:-moz-placeholder, input[type="month"]::-moz-placeholder, input[type="week"]:-moz-placeholder, input[type="week"]::-moz-placeholder, input[type="email"]:-moz-placeholder, input[type="email"]::-moz-placeholder, input[type="number"]:-moz-placeholder, input[type="number"]::-moz-placeholder, input[type="search"]:-moz-placeholder, input[type="search"]::-moz-placeholder, input[type="tel"]:-moz-placeholder, input[type="tel"]::-moz-placeholder, input[type="time"]:-moz-placeholder, input[type="time"]::-moz-placeholder, input[type="url"]:-moz-placeholder, input[type="url"]::-moz-placeholder, input[type="color"]:-moz-placeholder, input[type="color"]::-moz-placeholder, textarea:-moz-placeholder, textarea::-moz-placeholder {
	color: var($c-black);
}
input[type="text"]:focus, input[type="password"]:focus, input[type="date"]:focus, input[type="datetime"]:focus, input[type="datetime-local"]:focus, input[type="month"]:focus, input[type="week"]:focus, input[type="email"]:focus, input[type="number"]:focus, input[type="search"]:focus, input[type="tel"]:focus, input[type="time"]:focus, input[type="url"]:focus, input[type="color"]:focus, textarea:focus {
	border: none;
	border-bottom: 2px solid var($c-warning);
	box-shadow: none;
	position: relative;
	top: 1px;
	background: transparent;
}
input[type="text"].with-floating-label + label.floating-label, input[type="password"].with-floating-label + label.floating-label, input[type="date"].with-floating-label + label.floating-label, input[type="datetime"].with-floating-label + label.floating-label, input[type="datetime-local"].with-floating-label + label.floating-label, input[type="month"].with-floating-label + label.floating-label, input[type="week"].with-floating-label + label.floating-label, input[type="email"].with-floating-label + label.floating-label, input[type="number"].with-floating-label + label.floating-label, input[type="search"].with-floating-label + label.floating-label, input[type="tel"].with-floating-label + label.floating-label, input[type="time"].with-floating-label + label.floating-label, input[type="url"].with-floating-label + label.floating-label, input[type="color"].with-floating-label + label.floating-label, textarea.with-floating-label + label.floating-label {
	font-size: 1rem;
	color: var($c-black);
	position: relative;
	top: -35px;
	transition: top .45s ease-in-out, color .45s ease-in-out, font-size .45s ease-in-out;
	height: 0;
	cursor: text;
}
input[type="text"].with-floating-label:focus + label.floating-label, input[type="text"].with-floating-label:valid + label.floating-label, input[type="password"].with-floating-label:focus + label.floating-label, input[type="password"].with-floating-label:valid + label.floating-label, input[type="date"].with-floating-label:focus + label.floating-label, input[type="date"].with-floating-label:valid + label.floating-label, input[type="datetime"].with-floating-label:focus + label.floating-label, input[type="datetime"].with-floating-label:valid + label.floating-label, input[type="datetime-local"].with-floating-label:focus + label.floating-label, input[type="datetime-local"].with-floating-label:valid + label.floating-label, input[type="month"].with-floating-label:focus + label.floating-label, input[type="month"].with-floating-label:valid + label.floating-label, input[type="week"].with-floating-label:focus + label.floating-label, input[type="week"].with-floating-label:valid + label.floating-label, input[type="email"].with-floating-label:focus + label.floating-label, input[type="email"].with-floating-label:valid + label.floating-label, input[type="number"].with-floating-label:focus + label.floating-label, input[type="number"].with-floating-label:valid + label.floating-label, input[type="search"].with-floating-label:focus + label.floating-label, input[type="search"].with-floating-label:valid + label.floating-label, input[type="tel"].with-floating-label:focus + label.floating-label, input[type="tel"].with-floating-label:valid + label.floating-label, input[type="time"].with-floating-label:focus + label.floating-label, input[type="time"].with-floating-label:valid + label.floating-label, input[type="url"].with-floating-label:focus + label.floating-label, input[type="url"].with-floating-label:valid + label.floating-label, input[type="color"].with-floating-label:focus + label.floating-label, input[type="color"].with-floating-label:valid + label.floating-label, textarea.with-floating-label:focus + label.floating-label, textarea.with-floating-label:valid + label.floating-label {
	color: var($c-near-blue);
	font-size: 0.75rem;
	top: -56px;
}
textarea, pre {
	border: 0;
	font-size: 1rem;
	width: 100%;
	padding: 10px;
	border-bottom: 1px solid #eeeeee;
}
.textarea-label {
	position:absolute;
	right: 0;
	top: 7px;
	font-size: 12px;
	opacity: 0.7;
}
.near-explorer-logo {
	width: 32px;
	height: 32px;
	transform: scale(1.3);
}
.stats-gallery-logo {
	width: 32px;
	height: 32px;
	transform: scale(0.7);
}
.shift-left {
	font-size: 24px;
	position: relative;
	left: -30px;
	//top: -5px;
}

// Slide Out animation
.transition-all, * {
	transition: all .75s ease;
}

.transition-all.show {
	opacity: 1;
	//height: 150px;
	width: auto!important;
}
.transition-all.hide {
	width: 1px;
	opacity: 0;
}
.hidden-right {
	width: 0!important;
}
.resizable-div {
	 width: 100%;
	 animation-name: resize-to;
	 animation-duration: 0.5s;
}
@keyframes resize-to {
	from {width: 0;}
	to {width: 100px;}
}
</style>
