<template>
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
		</form>
	</div>
</template>
<script>
import deepmerge from 'deepmerge'
import {useStore} from '../store/index'

export default {
	name: 'SearchBar',
	props: {
	},
	data() {
		return {
			isSearching: false,
			searchQuery: '',
		}
	},
	setup() {
		const store = useStore()
		return {
			store
		};
	},
	methods: {
		async submitSearch() {
			try {
				// console.log('submitSearch Start', API_URL) // Also works
				console.time('queryPool')
				console.log('searchQuery', this.searchQuery)
				this.isSearching = true;
				let res = await this.axios.post(window.API_URL+'/queryIndexer', { query: this.searchQuery })
				console.timeEnd('queryPool')
				console.log('queryPool res', res.data.contracts)
				this.contracts = [...res.data.contracts]
				
				this.updateContractsFromLocalStorage()
				
				this.isSearching = false
				this.store.showContracts = !!(this.contracts && this.contracts.length)
				return res
			} catch (e) {
				this.isSearching = false
				console.timeEnd('queryPool')
				console.error('queryPool err', e)
				return Promise.reject(e)
			}
		},
		updateContractsFromLocalStorage() {
			let stored_contracts = this.store.contracts
			
			for (let key in this.contracts) {
				let contract = this.contracts[key]
				let stored_index = stored_contracts.findIndex((c)=> c.account_id === contract.account_id)
				console.log('stored_contracts', stored_contracts[stored_index])
				if(stored_index !== -1) {
					console.log('stored_contracts merged', deepmerge(contract, stored_contracts[stored_index]))
					this.contracts[key] = deepmerge(contract, stored_contracts[stored_index])
				}
			}
			
			this.store.resultsContracts = [...this.contracts]
		},
		removeSearchQuery() {
			this.searchQuery = '';
			this.store.showContracts = false;
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

.searchForm {
	margin-bottom: 1rem;
	position: relative;
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

// Slide Out animation

@keyframes resize-to {
	from {
		width: 0;
	}
	to {
		width: 100px;
	}
}
</style>
