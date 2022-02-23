<template>
	<div class="contracts pl-8" v-show="store.showContracts && store.resultsContracts && store.resultsContracts.length">
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
						 style="color: #555"
						 @click="fetchContract(contract)">
					<h3 class="text-headline text-left" :style="{ 'font-size': calcFontSize(contract.account_id.length) }">
						{{ contract.account_id }}
						<span class="contract-spinner" v-if="contract.parsingContract">
							<fa-icon icon="circle-notch" class="fa-spin"/>
						</span>
					</h3>
				</div>
				<div class="col-span-2">
					<h3 class="text-headline text-center justify-center transition-all flex-row"
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
											 :class="{ 'rotate-chevron-down': isContractMethodOpened(index, method)}"
											 icon="chevron-right"/>
							<div class="method ml-4 pointer text-lg" :class="{ 'font-medium': contract?.method_hints[method]?.total_hits }">
								{{ method }}
								<span class="text-md font-light">
									{{ contract?.method_hints[method] ? '('+ contract.method_hints[method].total_hits +')' : '' }}
								</span>
							</div>
						</div>
						<expand-height-transition class="col-span-12">
							<div class="row text-left pl-8 pointer" style="min-height: 24px"
									 v-if="isContractMethodOpened(index, method)">
								<div class="method-inputs col-span-10 grid grid-cols-12">
									<div class="col-span-1 text-center">
										<fa-icon icon="list-ul" class="align-bottom mt-3"/>
									</div>
									<div class="col-span-11 relative">
										<textarea-auto
											:v-model="store.resultsContracts[index].methods[method].arguments"
											:value="getArgumentsPlaceholder(contract.method_hints[method])"
											type="text"
											class="m-0 p-2"
										/>
										<span class="absolute" style="right: -7px; top: 15px; font-size: 12px;">
											{JSON}
										</span>
									</div>
									<div class="col-span-1 text-center">
										<fa-icon icon="hand-holding-usd" class="align-bottom mt-3"/>
									</div>
									<div class="col-span-11 relative">
										<input
											v-model="store.resultsContracts[index].methods[method].deposit"
											type="text"
											class="m-0 mb-4 p-2"
										/>
										<div>
											<span class="absolute right-8" style="top: 3px; font-size: 18px;line-height: 38px"
														v-if="contract?.method_hints[method]?.avg_deposit">
														Avg ~ {{ Math.round(contract.method_hints[method].avg_deposit) }}
											</span>
											<span class="absolute right-0" style="top: 3px; font-size: 27px;">
														Ⓝ
											</span>
										</div>
									</div>
								</div>
								<div class="method-actions grid col-span-2 text-center justify-center items-center">
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
<!--										<div class="col-span-2 inline-grid justify-center">-->
<!--											<fa-icon icon="clipboard-list" class="self-center"/>-->
<!--										</div>-->
										<div class="col-span-12 relative">
											<textarea-auto class="m-0 p-2 text-sm"
																		 :value="store.resultsContracts[index].methods[method].logs"
																		 disabled>
											</textarea-auto>
											<span class="textarea-label">
														Logs
													</span>
										</div>
									</div>
									
									<div class="grid grid-cols-12 col-span-12" v-if="store.resultsContracts[index].methods[method].result">
<!--										<div class="col-span-2 inline-grid justify-center">-->
<!--											<fa-icon icon="receipt" class="self-center"/>-->
<!--										</div>-->
										<div class="col-span-12 relative">
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
import * as BN from 'bn.js'

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
			near: {},
			keyStore: {},
			wallet: {},
			account : {},
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
	async created() {
		if(this.$route.query.transactionHashes) {
			console.log('this.$route.query.transactionHashes', this.$route.query.transactionHashes)
			// TODO: Add code to get function result and logs when with deposit
		}
		if(this.$route.query.errorCode) {
			console.log('Wallet Error Message:', this.$route.query.errorCode+': '+this.$route.query.errorMessage)
		}
		if(this.$route.query.account_id) {
			this.store.selected_account = this.$route.query.account_id
		}
	},
	async mounted() {
		await this.connectToNEARAccount()
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
		isContractMethodInCall(index, method){
			return this.store.resultsContracts[index]?.methods[method]?.is_in_call
		},
		toggleMethod(index, method) {
			this.store.resultsContracts[index].methods[method].is_opened = !this.store.resultsContracts[index].methods[method].is_opened
			
		},
		async connectToNEARAccount() {
			let options = near_config(this.network)
			this.keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
			
			// Defaulting to first account in keystore
			if (!this.store.selected_account) {
				this.store.accounts = [...(await this.keyStore.getAccounts(this.network))]
				if (this.store.accounts[0]) {
					this.store.selected_account =  this.store.accounts[0]
				}
			}
			
			this.near = await nearAPI.connect({ ...options, deps: { keyStore: this.keyStore }})
			this.wallet = new nearAPI.WalletConnection(this.near, `${this.network}:${this.store.selected_account}:`)
			this.account = await this.near.account(this.store.selected_account)
			this.store.accounts = [...(await this.keyStore.getAccounts(this.network))]
		},
		requestSignIn() {
			this.wallet.requestSignIn(
				"srch.near", // contract requesting access
				"Search Near", // optional
				window.location.href, // optional
				window.location.href // optional
			);
		},
		async callMethod(index, method) {
				const contract = this.store.resultsContracts[index]
				
				if (contract.methods[method].is_in_call) {
					contract.methods[method].is_in_call = false
					return
				}
				
				delete contract.methods[method].logs
				delete contract.methods[method].result
				contract.methods[method].is_in_call = true
				this.store.updateContract(contract) // Not sure if needed /Dan
				
				let   contract_deposit   = contract.methods[method].deposit
				const contract_arguments = contract.methods[method].arguments
				const contract_function  = contract.methods[method].name
				const contract_id 		 	 = contract.account_id
				
				const TAX = new BN.BN("10000000000000000000000", 10);
				if (contract_deposit && contract_deposit > 0) {
					contract_deposit = TAX.add(new BN.BN(nearAPI.utils.format.parseNearAmount(contract_deposit), 10)).toString(10);
				}
			
			try {
				if(!this.wallet.isSignedIn()) {
					contract.methods[method].is_in_call = false;
					return this.requestSignIn()
				}
				
				// const near_cont = new nearAPI.Contract(
				// 	this.wallet.account(),
				// 	"srch.near",
				// 	{
				// 		viewMethods: [],
				// 		changeMethods: ["call_contract"],
				// 		sender: this.wallet.account(),
				// 		meta: 'some info'
				// 	}
				// );
				
				const meta = JSON.stringify({
					account_id: this.wallet.getAccountId(),
					contract: contract_id,
					method: contract_function,
					args: contract_arguments,
				})
				
				// Capturing Logs from 'near-api-js'
				console.stdlog = console.log.bind(console);
				let logs = [];
				console.log = function(){
					logs.push(...Array.from(arguments));
					console.stdlog.apply(console, arguments);
				}
				// let result = await near_cont.call_contract(
				// 		{ account_id: contract_id, method_name: contract_function, args: contract_arguments },
				// 		"300000000000000",
				// 		contract_deposit,
				// 	);
				const result = await this.account.functionCall({
					contractId: 'srch.near',
					methodName: 'call_contract',
					args: { account_id: contract_id, method_name: contract_function, args: contract_arguments },
					gas: "300000000000000",
					attachedDeposit: contract_deposit,
					meta: meta,
					walletMeta: meta,
					walletCallbackUrl: window.location.href
				});
				console.log = console.stdlog.bind(console);
				// console.log("Contract logs: ", logs)
				// Capturing Logs from 'near-api-js' - END console.log restored
				
				let logs_str = ''
				logs.map((log, index)=>{
					logs_str += log.replace('\tLog [srch.near]: ', `Log: `)+'\n'
				})
				contract.methods[method].logs = logs_str
				
				if (result.status.SuccessValue) {
					contract.methods[method].result = JSON.stringify(JSON.parse(Buffer.from(result.status.SuccessValue, 'base64').toString(), null, 2))
				} else {
					console.log("Contract err result: ", result.status)
				}
				contract.methods[method].is_in_call = false
				
				this.store.updateContract(contract) // Not sure if needed /Dan
				
			} catch (e) {
				console.error('callMethod err: ', e.toString())
				// TODO: Add Notification
				contract.methods[method].result = e.toString()
				contract.methods[method].is_in_call = false
				// return Promise.reject(e)
			}
		},
		async fetchContract(contract){
			try {
				if (contract.show_methods) { // just collapsing details
					return contract.show_methods = !contract.show_methods
				}
				
				// console.log('fetchContract Start')
				contract.parsingContract = true
				let parsed_contract
				if (!contract.methods) {
					const { code_base64 } = await this.near.connection.provider.query({
						account_id: contract.account_id,
						finality: 'final',
						request_type: 'view_code',
					});
					// console.log('fetchContract Start 2')
					parsed_contract = await parseContract(code_base64)
					// console.log('fetchContract parsed_contract', parsed_contract)
					contract.byMethod = parsed_contract.byMethod
					
					// console.log('fetchContract contract', contract)
					if(!contract.methods)
						contract.methods = {}
					
					for (let method of this.removeDuplicatedMethods(parsed_contract.methodNames)) {
						if(method && !contract.methods[method])
							contract.methods[method] = {
								name: method,
								is_opened: false,
								is_in_call: false,
								arguments: '',
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
				
				await	this.fetchContractHints(contract)
				
				return contract
			} catch (e) {
				contract.parsingContract = false
				console.error('fetchContract Error: ', e)
				return Promise.reject(e)
			}
		},
		async fetchContractHints(contract){
			try {
				let res = await this.axios.post(window.API_URL+'/getMethodHints',
		 {
						contract: contract.account_id
					}
				)
				contract.method_hints = res.data.method_hints
			} catch (e) {
				console.error('fetchContractHints Error: ', e)
				return Promise.reject(e)
			}
			
		},
		getArgumentsPlaceholder(method_hints = null) { //For some reason Contract parser returns each method twice, I am removing the snake case ones
			if (!method_hints) return '{}'
			
			let placeholder = '{'
			let just_hints =  Object.keys(method_hints)
				.filter( key => typeof method_hints[key] === 'object')
				.sort(function(a, b) {
					// console.log('sort a', method_hints[a].used_count - method_hints[b].used_count)
					return method_hints[b].used_count - method_hints[a].used_count;
				})
				.reduce( (res, key) => (res[key] = method_hints[key], res), {} );
			
			let length = Object.keys(just_hints).length
			let index = 0
			
			for (let key in just_hints) {
				let value = just_hints[key]
				if (typeof value === 'object') {
					if (index > 0 && index < length) {
						placeholder += ','
					}
					placeholder += ` "${key}": "${value.used_percent < 0.8 ? '?' : ''}${value.type}"`
					index++
				}
			}
			placeholder += ' }'

			return JSON.stringify(JSON.parse(placeholder), null, 2)
		},
		removeDuplicatedMethods(methods) { //For some reason Contract parser returns each method twice, I am removing the snake case ones
			let filtered_methods = []
			
			for (let method of methods) {
				let snake_case_method = method.replace(/[A-Z]/g, (letter, index) => { return index === 0 ? letter.toLowerCase() : '_'+ letter.toLowerCase();});
				let camel_case_method = method.toLowerCase().replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
				if (!filtered_methods.includes(method) && !filtered_methods.includes(snake_case_method) && !filtered_methods.includes(camel_case_method))
					filtered_methods.push(method)
			}
			return filtered_methods
		}
	},
	watch: {
		async 'store.show_login_dropdown'(val){
			if (val) {
				this.store.accounts = [...(await this.keyStore.getAccounts(this.network))]
				console.log('show_login_dropdown.store.accounts', this.store.accounts)
			}
		},
		async 'store.trigger_wallet_signin'(val){
			if (val) {
				// await this.wallet.signOut()
				await this.requestSignIn()
				this.store.trigger_wallet_signin = !this.store.trigger_wallet_signin
			}
		},
		async 'store.update_selected_account'(val){
			console.log('update_selected_account', val)
			if (val) {
				await this.connectToNEARAccount()
				this.store.update_selected_account = false
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
