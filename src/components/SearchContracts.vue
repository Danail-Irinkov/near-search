<template>
	<SearchBar/>
	<expand-height-transition>
		<ResultsContracts/>
	</expand-height-transition>
</template>
<script>
import ResultsContracts from '../components/ResultsContracts.vue'
import SearchBar from '../components/SearchBar.vue'

export default {
	name: 'searchContracts',
	components: {ResultsContracts, SearchBar},
	props: {}
}
</script>
