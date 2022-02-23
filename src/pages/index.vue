<template>
	<div class="content" id="searchNEAR">
		<Head>
			<title>NEAR Search</title>
			<meta name="description" content="Search the NEAR Network for Contracts and review their methods" />
		</Head>
		
		<!--		// BODY    -->
		<img :src="SearchNearLogo" alt="Search NEAR Logo" class="mb-16" />
		<SearchBar />
		
		<expand-height-transition>
			<ResultsContracts />
		</expand-height-transition>
		
	</div>
</template>

<script>
import {Head} from '@egoist/vue-head'
import SearchNearLogo from '../assets/SearchNearLogo2.svg'
import SearchBar from '../components/SearchBar.vue'
import ResultsContracts from '../components/ResultsContracts.vue'

export default {
	name: 'SearchNearHome',
	setup() {
		return {
			SearchNearLogo
		};
	},
	components: {
		ResultsContracts,
		SearchBar,
		Head,
	},
	data() {
		return {
		}
	},
	filters: {
	}
}
</script>

<style lang="scss">

</style>
