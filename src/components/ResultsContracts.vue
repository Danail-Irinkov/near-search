<template>
	<div class="contracts pl-8" v-show="store.showContracts">
		<div class="row">
			<div class="row">
				<div class="transition-all col-span-8">
					<h3 class="text-headline text-left"></h3>
				</div>
				<div class="col-span-2">
					<span class="" style="top: 3px; font-size: 32px;"
								v-tooltip:top.tooltip="'Deposits Total Ⓝ in the last 4 weeks'">Ⓝ</span>
					
					<span class="cursor-pointer" style="top: 3px; font-size: 22px;"
								v-tooltip:top.tooltip="'Method Calls in the last 4 weeks'"
								@click="store.show_hits = !store.show_hits">
						/
						<fa-icon icon="stopwatch" />
					</span>
				</div>
				<div class="col-span-2">
<!--					// Header Col for links-->
				</div>
			</div>
			<div class="row"
					 v-for="(contract, index) in store.resultsContracts">
				<div class="link transition-all col-span-8"
						 @click="fetchContract(contract)">
					<h3 class="text-headline text-left" :style="{ 'font-size': calcFontSize(contract.account_id.length) }">
						{{ contract.account_id }}
						<span class="contract-spinner" v-if="contract.parsingContract">
							<fa-icon icon="circle-notch" class="fa-spin"/>
						</span>
					</h3>
				</div>
				<div class="col-span-2">
					<h3 class="text-headline text-center justify-center transition-all"
							:class="{	'text-slate-800': abbreviateNumber(contract.total_deposits).indexOf('M') !== -1 }">
						<span :class="{
							'font-semibold': abbreviateNumber(contract.total_deposits).indexOf('K') !== -1,
							'font-bold': abbreviateNumber(contract.total_deposits).indexOf('M') !== -1
							}">
							{{ abbreviateNumber(contract.total_deposits) }}
						</span>
						
						<Transition name="fade">
							<span v-if="store.show_hits">
								/{{ abbreviateNumber(contract.hits) }}
							</span>
						</Transition>
					</h3>
				</div>
				<div class="col-span-2">
					<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'NEAR Explorer'">
						<button class="outline-0" style="font-size: 24px; overflow: hidden;"
										v-if="store.resultsContracts[index].account_id"
										@click="openLinkNewTab(`https://explorer.near.org/accounts/${store.resultsContracts[index].account_id}`)">
							<img :src="NEARsvg" class="near-explorer-logo" alt="near-explorer-logo"/>
						</button>
					</div>
					<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Stats Gallery'">
						<button class="outline-0" style="font-size: 24px; overflow: hidden;"
										v-if="store.resultsContracts[index].account_id"
										@click="openLinkNewTab(`https://stats.gallery/mainnet/${store.resultsContracts[index].account_id}/overview?t=week`)">
							<img :src="statsGalleryLogo" class="stats-gallery-logo" alt="stats-gallery-logo"/>
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
								 @click="toggleMethod(index, method)">
							<fa-icon class="method-chevron ml-4"
											 :class="{ 'rotate-chevron-down': isContractMethodOpened}"
											 icon="chevron-right"/>
							<div class="method ml-4 pointer text-lg">
								{{ method }}
							</div>
						</div>
						<expand-height-transition class="col-span-12">
							<div class="row text-left pl-8 pointer" style="min-height: 24px"
									 v-if="isContractMethodOpened(index, method)">
								<div class="method-inputs col-span-9 grid grid-cols-12">
									<div class="col-span-2 text-center">
										<fa-icon icon="list-ul" class="align-bottom mt-3"/>
									</div>
									<div class="col-span-10 relative">
										<input
											v-model="store.resultsContracts[index].methods[method].arguments"
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
											v-model="store.resultsContracts[index].methods[method].deposit"
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
														@click="callMethod(index, method)">
											<fa-icon v-if="isContractMethodInCall(index, method)" icon="circle-notch" class="fa-spin"/>
											<fa-icon v-else icon="play"/>
										</button>
									</div>
								</div>
								<div class="grid grid-cols-12 col-span-9">
									<div class="grid grid-cols-12 col-span-12" v-if="store.resultsContracts[index].methods[method].logs">
										<div class="col-span-2 inline-grid justify-center">
											<fa-icon icon="clipboard-list" class="self-center"/>
										</div>
										<div class="col-span-10 relative">
											<textarea-auto class="m-0 p-2"
																		 :value="store.resultsContracts[index].methods[method].logs"
																		 disabled>
											</textarea-auto>
											<span class="textarea-label">
														Logs
													</span>
										</div>
									</div>
									
									<div class="grid grid-cols-12 col-span-12" v-if="store.resultsContracts[index].methods[method].result">
										<div class="col-span-2 inline-grid justify-center">
											<fa-icon icon="receipt" class="self-center"/>
										</div>
										<div class="col-span-10 relative">
											<textarea-auto class="m-0 p-2"
																		 :value="store.resultsContracts[index].methods[method].result"
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
														v-if="store.resultsContracts[index].methods[method].logs"
														@click="store.resultsContracts[index].methods[method].logs = ''">
											<fa-icon icon="times"/>
										</button>
									</div>
									<div class="w-fit h-fit inline-block" v-tooltip:top.tooltip="'Clear Result'">
										<button class="outline-0" style="font-size: 24px"
														v-if="store.resultsContracts[index].methods[method].result"
														@click="store.resultsContracts[index].methods[method].result = ''">
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
</template>
<script>
import NEARsvg from '../assets/NEAR/SVG/near_icon.svg'
import statsGalleryLogo from '../assets/stats_gallery_logo.png'
import near_config from '../components/near_config'
import * as nearAPI from 'near-api-js'
import {parseContract} from 'near-contract-parser'
import { useStore } from '../store/index'

export default {
	name: 'ResultsContracts',
	inject: {
		openLinkNewTab: {
			from: 'openLinkNewTab'
		}
	},
	data() {
		return {
			show_hits: false,
			network: 'mainnet',
			near: {}
		}
	},
	setup() {
		const store = useStore()
		return {
			store,
			NEARsvg,
			statsGalleryLogo
		};
	},
	async mounted() {
		console.log('mounted Start 2', window.API_URL)
		let options = near_config('mainnet')
		
		let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
		
		this.near = await nearAPI.connect({ ...options, deps: { keyStore }});
		
		// TODO: if not logged in with NEAR ask user to requestSigning for him
		
	},
	methods: {
		calcFontSize(length) {
			let base_size = 24
			if (length > 30)
				base_size -= (length - 30) * 0.5
			return base_size+'px'
		},
		isContractMethodOpened(index, method) {
			return this.store.resultsContracts[index]?.methods[method]?.is_opened
		},
		isContractMethodInCall(index, method) {
			return this.store.resultsContracts[index]?.methods[method]?.is_in_call
		},
		toggleMethod(index, method) {
			console.log('toggleMethod', method)
			this.store.resultsContracts[index].methods[method].is_opened = !this.store.resultsContracts[index].methods[method].is_opened
			
		},
		callMethod(index, method) {
			let contract_id = this.store.resultsContracts[index].account_id
			console.log('Calling a method', contract_id, method)
			this.store.updateContract(this.store.resultsContracts[index])
			this.store.resultsContracts[index].methods[method].is_in_call = !this.store.resultsContracts[index].methods[method].is_in_call
			
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
				
				this.store.updateContract(contract)
				
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

h1,
h2 {
	font-family: 'Source Sans Pro', sans-serif;
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

.text-headline {
	font-size: 24px;
	line-height: 32px;
	//padding-top: 16px;
	//margin-bottom: 12px;
	height: 100%;
	letter-spacing: 0;
	word-break: break-word;
	display: flex;
}

/* Material Design code below */

button:focus {
	outline: none;
}

input:focus {
	outline: none;
}

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

textarea, pre {
	border: 0;
	font-size: 1rem;
	width: 100%;
	padding: 10px;
	border-bottom: 1px solid #eeeeee;
}

.textarea-label {
	position: absolute;
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
	left: 12px;
	//top: -5px;
}

// Slide Out animation
.transition-all, * {
	transition: all .75s ease;
}

.transition-all.show {
	opacity: 1;
	//height: 150px;
	width: auto !important;
}

.hidden-right {
	width: 0 !important;
}

@keyframes resize-to {
	from {
		width: 0;
	}
	to {
		width: 100px;
	}
}


.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
