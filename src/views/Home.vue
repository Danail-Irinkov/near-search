<template>
	<div class="header" id="wikiApp">
		<Head>
			<title>NEAR Search</title>
			<meta name="description" content="Search the NEAR Network for Contracts and review their methods" />
		</Head>
		<h1 class="cover-heading">NEAR Search</h1>
		<div class="medium-6 medium-offset-3 ctrl">
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
			</form>
		</div>
		<transition mode="out-in" name="expand">
			<div class="contracts" v-show="isResult">
				<div class="row">
					<div class="col-span-9 mb-2">
						<h3 class="text-headline text-left"></h3>
					</div>
					<div class="col-span-3 mb-2">
						<h4 class="text-headline text-center italic">Usage</h4>
					</div>
					<div class="row"
						 v-for="contract in contracts">
						<div class="col-span-9 link"
								 @click="fetchContract(contract)">
							<h3 class="text-headline text-left">{{ contract.account_id }}</h3>
						</div>
						<div class="col-span-3">
							<h3 class="text-headline text-center">{{ contract.hits }}</h3>
						</div>
						<transition mode="out-in" name="expand">
							<div v-if="contract.methods && contract.show_methods" class="col-span-12">
								<div v-for="method in contract.methods">
									<h4 class="text-headline text-left">{{ method }}</h4>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import { Head } from '@egoist/vue-head'
import * as nearAPI from 'near-api-js'
import near_config from '../components/near_config'
import {parseContract} from 'near-contract-parser'

export default {
	el: '#near_search',
	name: 'NearSearch',
	components: {
		Head,
	},
	data() {
		return {
			contracts: [],
			isSearching: false,
			isResult: false,
			searchQuery: '',
			network: 'mainnet',
			near: {},
		}
	},
	async mounted() {
		console.log('mounted Start 2', window.API_URL)
		let options = near_config('mainnet')
		
		let keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore()
		
		this.near = await nearAPI.connect({ ...options, deps: { keyStore }});
	},
	computed: {
	
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
				console.log('queryPool res', res)
				this.contracts = [...res.data.contracts]
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
		removeSearchQuery: function() {
			this.searchQuery = '';
			this.isResult = false;
		},
		async fetchContract(contract){
			try {
				console.log('fetchContract Start')
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
					contract.methods = parsed_contract.methodNames
				}
				contract.show_methods = !contract.show_methods
				return parsed_contract
			} catch (e) {
				console.error('fetchContract Error: ', e)
				return Promise.reject(e)
			}
		},
	}
}
</script>

<style lang="scss" scoped>
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
	padding: 10vw 10vh;
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
	letter-spacing: 0;
}

/* vuejs transition */
.expand-transition {
	transition-duration: 0.5s;
	transition: all .5s ease;
	padding: 10px;
	min-height: 1500px;
	overflow: hidden;
}

.expand-enter, .expand-leave {
	height: 0;
	padding: 0 10px;
	opacity: 0;
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
	padding: 1rem 0 0.5rem 0;
	margin: 1.75rem 0 0.5rem;
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
</style>
