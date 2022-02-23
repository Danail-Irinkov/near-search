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
	@apply pr-4 pb-2 pt-1 bg-white text-right;
	width: 100%;
	height: calc(1.25rem + 14px);
	position: fixed;
	bottom: 0;
	background-color: rgba(255, 255, 255, 0.69);
}
.link {
	margin: 1rem;
	line-height: 20px;
	font-weight: 500;
}
</style>
