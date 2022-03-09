<template>
	<div
		:class="{ disabled: !!disabled }">
		<SearchInput
			:searchIcon="false"
			:shortcutIcon="false"
			:value="modelValue"
			:disabled="disabled"
			:class="{ disabled: !!disabled }"
			@change="updateValue($event.target.value)"
			v-model="modelValue" />
	</div>
</template>

<script>
import SearchInput from 'vue-search-input'
export default {
	name: 'TextInput',
	components: {
		SearchInput
	},
	props: {
		modelValue: String,
		disabled: Boolean,
	},
	data(){
		return {
			touched: false
		}
	},
	methods: {
		updateValue(evt) {
			const value = evt.target && evt.target.value ? evt.target.value : evt
			if (!this.touched && value)
				this.touched = true
			
			this.$emit('update:modelValue', value)
		},
	}
}
</script>

<style scoped lang="scss">
:deep(.search-input-wrapper) {
	border-right: 0;
	border-top: 0;
	border-bottom: 0;
	& > input {
		margin: 0;
	}
}
</style>
