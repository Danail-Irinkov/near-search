<template>
<div class="staking-wrapper">
	<h4 class="text-headline mx-auto max-w-fit mb-4">
		Get Notified for events
	</h4>
	<googleButton
		v-if="!$firebase.userIsLoggedIn"
		class="my-4"
	></googleButton>
	<div class="input-block mt-4">
		<a class="col-span-3">Email:</a>
		<TextInput class="col-span-8"
							 @blur="$firebase.updateUser(store.user)"
							 v-model="store.user.email">
		</TextInput>
	</div>
	<div class="input-block">
		<a class="col-span-3 link"
			 href="https://play.google.com/store/apps/details?id=net.xdroid.pn&hl=en&gl=US"
			 target="_blank">
			Push Id:
		</a>
		<TextInput class="col-span-8"
							 @blur="$firebase.updateUser(store.user)"
							 v-model="store.user.xdroid_push_id">
		</TextInput>
	</div>
	<div class="input-block mt-8">
		<a class="col-span-7">
			Enable Notifications
		</a>
		<Toggle class="col-span-4 max-w-fit mx-auto"
						@change="$firebase.updateUser(store.user)"
						v-model="store.user.enable_notifications">
		</Toggle>
	</div>
</div>
</template>

<script>
import {useStore} from '../store/index'
import googleButton from './Buttons/googleButton.vue'
import TextInput from './Inputs/TextInput.vue'
import Toggle from '@vueform/toggle'
import '@vueform/toggle/themes/default.css'

export default {
	name: 'SearchNotify',
	inject: ['$firebase'],
	components: {
		googleButton,
		Toggle,
		TextInput
	},
	setup() {
		const store = useStore()
		return {
			store
		};
	},
	data() {
		return {
			processing: false,
			user: {
				email: ''
			}
		}
	},
	mounted() {
	 this.updateNotifications()
		console.log('mounted user', this.$firebase.getCurrentUser())
	},
	computed: {
	},
	methods: {
		async updateNotifications() {
			try {
				this.processing = true
				
				this.processing = false
			} catch (e) {
				console.log('updateNotifications Err:', e)
				this.processing = false
				return Promise.reject(e)
			}
		},
	}
}
</script>

<style scoped lang="scss">
.staking-wrapper {
	@apply
}
.input-block {
	@apply py-2 grid grid-cols-12 col-span-12 content-center text-center items-center;
	
	//& > * {
	//	@apply content-center items-center text-center align-middle align-center
	//}
}
.toggle-container:focus {
	outline: none;
	box-shadow: none!important;
}
</style>
