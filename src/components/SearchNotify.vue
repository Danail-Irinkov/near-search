<template>
<div class="staking-wrapper">
	<h4 class="text-headline mx-auto max-w-fit mb-4">
		Get Notified for Candles
	</h4>
	<div>
<!--		<span>2.</span>-->
		<loginButton
			v-if="!$firebase.userIsLoggedIn"
			v-tooltip.top.tooltip="'Login with Google to allow us to notify you'"
			platform="google"
			class="my-4"
		></loginButton>
	</div>
	<div class="input-block mt-4">
		<a class="col-span-3">Email:</a>
		<TextInput class="col-span-8"
							 :disabled="!$firebase.userIsLoggedIn"
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
							 :disabled="!$firebase.userIsLoggedIn"
							 @blur="$firebase.updateUser(store.user)"
							 v-model="store.user.xdroid_push_id">
		</TextInput>
	</div>
	<div class="input-block mt-8"
			 v-tooltip:top.tooltip="'Get instantly notified for Crazy Candles by email or Push Notifications'">
		<a class="col-span-7">
			Enable Notifications
		</a>
		<Toggle class="col-span-4 max-w-fit mx-auto"
						:disabled="!$firebase.userIsLoggedIn"
						@change="$firebase.updateUser(store.user)"
						v-model="store.user.enable_notifications">
		</Toggle>
	</div>
	<div class="input-block mt-8"
			 v-tooltip:top.tooltip="'Get instantly notified for Crazy Candles by email or Push Notifications'">
		<a class="col-span-7">
			Email Notifications
		</a>
		<Toggle class="col-span-4 max-w-fit mx-auto"
						:disabled="!store.user.email"
						@change="$firebase.updateUser(store.user)"
						v-model="store.user.notify_email">
		</Toggle>
	</div>
	<div class="input-block mt-8"
			 v-tooltip:top.tooltip="'Get instantly notified for Crazy Candles by email or Push Notifications'">
		<a class="col-span-7">
			Push Notifications
		</a>
		<Toggle class="col-span-4 max-w-fit mx-auto"
						:disabled="!store.user.xdroid_push_id"
						@change="$firebase.updateUser(store.user)"
						v-model="store.user.notify_push_notification_api">
		</Toggle>
	</div>
</div>
</template>

<script>
import {useStore} from '../store/index'
import loginButton from './Buttons/loginButton.vue'
import TextInput from './Inputs/TextInput.vue'
import Toggle from '@vueform/toggle'
import '@vueform/toggle/themes/default.css'

export default {
	name: 'SearchNotify',
	inject: ['$firebase'],
	components: {
		loginButton,
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
