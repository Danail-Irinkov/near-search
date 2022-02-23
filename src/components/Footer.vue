<template>
<div class="footer">
	<router-link class="link" to="/" v-if="$route.path !== '/'">Home</router-link>
	<router-link class="link" to="/about">About</router-link>
	<router-link class="link" to="/terms">Terms</router-link>
</div>
</template>

<script>
export default {
	name: 'Footer',
}
</script>

<style scoped>
.footer {
	@apply pb-2 pt-1 bg-white;
	width: 100%;
	height: calc(1.25rem + 14px);
	position: fixed;
	bottom: 0;
	opacity: 0.7;
}
.link {
	margin: 1rem;
	line-height: 20px;
}
</style>
