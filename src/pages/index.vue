<template>
	<div class="content" id="searchNEAR">
		<Head>
			<title>NEAR Search</title>
			<meta name="description" content="Search the NEAR Network for Contracts and review their methods" />
		</Head>
		
		<!--		// BODY    -->
		<img :src="SearchNearLogo" alt="Search NEAR Logo" class="mb-8 cursor-pointer"
				 @click="redirectHome()" />
		<Tabs class="my-8 cursor-pointer"
					ref="tabs"
					v-if="beta"
					:tabs="tabs"
					@clickedTab="handleTabChange"></Tabs>
		<searchContracts v-if="selected_tab === 'Contracts'"/>
		<SearchStaking v-if="selected_tab === 'Staking'"/>
		<SearchCandles v-if="selected_tab === 'Candles'"/>
		<SearchNotify v-if="selected_tab === 'Notify'"/>
	
	</div>
</template>

<script>
import {Head} from '@egoist/vue-head'
import SearchNearLogo from '../assets/SearchNearLogo2.svg'
import SearchContracts from '../components/SearchContracts.vue'
import SearchStaking from '../components/SearchStaking.vue'
import SearchCandles from '../components/SearchCandles.vue'
import SearchNotify from '../components/SearchNotify.vue'
import Tabs from '../components/Inputs/Tabs.vue'

export default {
	name: 'SearchNearHome',
	inject: ['$updateQueryStringParameter'],
	setup() {
		return {
			SearchNearLogo
		};
	},
	components: {
		SearchContracts,
		SearchStaking,
		SearchCandles,
		SearchNotify,
		Tabs,
		Head,
	},
	data() {
		return {
			tabs: ['Contracts', 'Staking', 'Candles', 'Notify'],
			selected_tab: 'Contracts'
		}
	},
	mounted() {
		if(this.$route.query.tab)
			this.$refs.tabs.changeIndex(this.tabs.indexOf(this.$route.query.tab))
	},
	watch: {
		'$route.query'(){
			if(this.$route.query.tab)
				this.$refs.tabs.changeIndex(this.tabs.indexOf(this.$route.query.tab))
		}
	},
	computed:{
		beta() {
			return !!this.$route.query.beta
		}
	},
	methods: {
		handleTabChange(data){
			if (window) {
				let new_url = this.$updateQueryStringParameter(window.location.href, 'tab', data.tab)
				if(window.location.href !== new_url)
					window.history.pushState("", `NEAR - ${data.tab}`, new_url);
			}
			this.selected_tab = data.tab
		},
		redirectHome(){
			window.location.replace('https://searchnear.net')
		}
	}
}
</script>

