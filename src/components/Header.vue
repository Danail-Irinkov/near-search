<template>
<div class="header">
	<AccountSelector/>
</div>
</template>

<script>
import AccountSelector from '../components/Inputs/AccountSelector.vue'
export default {
	name: 'Header',
	components: {
		AccountSelector
	}
}
</script>

<style scoped>
.header {
	@apply pb-4 pt-1 bg-white;
	width: 100%;
	height: 3rem;
}
</style>
