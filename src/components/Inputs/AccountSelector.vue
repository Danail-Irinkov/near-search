<template>
	<div class="account-selector">
		<div class="account-display" @click="store.show_login_dropdown = !store.show_login_dropdown">
			<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="user-icon"><path d="M9.24187 23.0625V22.0625C8.88424 22.0625 8.55384 22.2535 8.37534 22.5634C8.19684 22.8733 8.19743 23.2549 8.37688 23.5643L9.24187 23.0625ZM26.7582 23.0625L27.6232 23.5643C27.8027 23.2549 27.8033 22.8733 27.6248 22.5634C27.4463 22.2535 27.1159 22.0625 26.7582 22.0625V23.0625ZM24.0625 18C24.0625 15.5479 22.5854 13.3373 20.32 12.399L19.5547 14.2467C21.0727 14.8755 22.0625 16.3569 22.0625 18H24.0625ZM20.32 12.399C18.0546 11.4606 15.447 11.9793 13.7132 13.7132L15.1274 15.1274C16.2892 13.9655 18.0366 13.6179 19.5547 14.2467L20.32 12.399ZM13.7132 13.7132C11.9793 15.447 11.4606 18.0546 12.399 20.32L14.2467 19.5547C13.6179 18.0366 13.9655 16.2892 15.1274 15.1274L13.7132 13.7132ZM12.399 20.32C13.3373 22.5854 15.5479 24.0625 18 24.0625V22.0625C16.3569 22.0625 14.8755 21.0727 14.2467 19.5547L12.399 20.32ZM18 24.0625C21.3482 24.0625 24.0625 21.3482 24.0625 18H22.0625C22.0625 20.2437 20.2437 22.0625 18 22.0625V24.0625ZM18.0001 22.0625H9.24187V24.0625H18.0001V22.0625ZM8.37688 23.5643C10.3671 26.9952 14.0336 29.1071 18.0001 29.1071V27.1071C14.7467 27.1071 11.7393 25.3749 10.1069 22.5607L8.37688 23.5643ZM18.0001 29.1071C21.9665 29.1071 25.633 26.9952 27.6232 23.5643L25.8932 22.5607C24.2608 25.3749 21.2535 27.1071 18.0001 27.1071V29.1071ZM26.7582 22.0625H18.0001V24.0625H26.7582V22.0625Z" fill="#A2A2A8"></path><path d="M7.875 18C7.875 12.4081 12.4081 7.875 18 7.875C23.5919 7.875 28.125 12.4081 28.125 18" stroke="#A2A2A8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
			<div class="account-wrapper" data-test-id="currentUser">{{ store?.user?.near_id || 'No Connection' }}</div>
			<div class="icon-wrapper">
				<svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="chevron-icon"><path d="M1 13L7 7L1 1" stroke="#9F9F9F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
			</div>
		</div>
		<div class="account-dropdown" v-if="store.show_login_dropdown">
			<h6 class="text-left" v-if="store.user.near_id"
					style="color: rgb(114 114 122)">
				Account
			</h6>
			<div class="accounts" v-if="store.accounts.length">
				<div v-for="account in store.accounts"
						 @click="updateSelectedAccount(account)"
						 class="account"
						 :class="{ active: account === store.user.near_id}">
					<div>
						<div class="account-id">{{ account }}</div>
						<div class="balance">••••••</div>
					</div>
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="16" fill="#FAFAFA"></rect><g clip-path="url(#clip3123990)"><path d="M14.6 10.8266C15.0589 10.7192 15.5287 10.6655 16 10.6666C20.6667 10.6666 23.3333 16 23.3333 16C22.9287 16.757 22.446 17.4698 21.8933 18.1266M17.4133 17.4133C17.2302 17.6098 17.0094 17.7674 16.7641 17.8767C16.5188 17.986 16.2539 18.0448 15.9854 18.0496C15.7169 18.0543 15.4501 18.0049 15.2011 17.9043C14.952 17.8037 14.7258 17.654 14.5359 17.4641C14.346 17.2742 14.1963 17.0479 14.0957 16.7989C13.9951 16.5499 13.9457 16.2831 13.9504 16.0146C13.9552 15.746 14.0139 15.4812 14.1233 15.2359C14.2326 14.9905 14.3902 14.7697 14.5867 14.5866M19.96 19.96C18.8204 20.8286 17.4327 21.3099 16 21.3333C11.3333 21.3333 8.66667 16 8.66667 16C9.49593 14.4546 10.6461 13.1044 12.04 12.04L19.96 19.96Z" stroke="#2B9AF4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8.66667 8.66669L23.3333 23.3334" stroke="#2B9AF4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip3123990"><rect width="16" height="16" fill="white" transform="translate(8 8)"></rect></clipPath></defs></svg>
				</div>
			</div>
			<button class="near-login" @click="triggerLoginFlow()"
							:disabled="store.trigger_wallet_signin">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#D6EDFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
				NEAR Login
			</button>
		</div>
	</div>
</template>

<script>
import { useStore } from '../../store/index'
export default {
	name: 'AccountSelector',
		// 'near', 'keyStore', 'wallet', 'account' ],
	inject: ['$firebase', 'wallet'],
	setup() {
		const store = useStore()
		return {
			store
		};
	},
	data() {
		return {
		}
	},
	mounted() {
		// if (this.store?.user?.near_id)
		// 	this.$firebase.loginUserWithNearId(this.store.user.near_id)
	},
	methods: {
		async triggerLoginFlow(){
			// this.store.trigger_wallet_signin = !this.store.trigger_wallet_signin
			
			this.wallet.requestSignIn(
				"srch.near", // contract requesting access
				"Search Near", // optional
				window.location.href, // optional
				window.location.href // optional
			);
		},
		async updateSelectedAccount(account){
			try {
				// await this.$firebase.loginUserWithNearId(account)
				this.store.user.near_id = account
				await this.$firebase.updateUser(this.store.user)
				this.store.update_selected_account = true
				this.store.show_login_dropdown = false
			} catch (e) {
			
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.account-selector {
	width: fit-content;
	margin-left: auto;
}
.account-display {
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	color: white;
	font-size: 14px;
	box-sizing: inherit;
	background-color: rgb(240, 240, 241);
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	border-radius: 40px;
	padding: 2px 5px 2px 2px;
	cursor: pointer;
	user-select: none;
	width: fit-content;
	margin-left: auto;
}
.icon-wrapper {
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	color: white;
	font-size: 14px;
	cursor: pointer;
	user-select: none;
	box-sizing: inherit;
	background-color: rgb(229, 229, 230);
	min-width: 28px;
	min-height: 28px;
	width: 28px;
	height: 28px;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 50%;
	transform: rotate(90deg);
}
.account-wrapper {
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	cursor: pointer;
	user-select: none;
	box-sizing: inherit;
	font-weight: 600;
	font-size: 14px;
	margin: 0px 14px 0px 9px;
	white-space: nowrap;
	max-width: 150px;
	overflow: hidden;
	text-overflow: ellipsis;
	color: rgb(114, 114, 122);
}
.account-selector {
	-webkit-text-size-adjust: 100%;
	tab-size: 4;
	line-height: inherit;
	-webkit-font-smoothing: antialiased;
	text-align: center;
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	color: white;
	font-size: 14px;
	cursor: pointer;
	user-select: none;
	box-sizing: border-box;
	border-width: 0;
	border-style: solid;
	border-color: #e4e4e7;
	--tw-ring-offset-width: 0px;
	--tw-ring-offset-color: #fff;
	--tw-ring-color: rgba(59, 130, 246, 0.5);
	--tw-ring-offset-shadow: 0 0 #0000;
	--tw-ring-shadow: 0 0 #0000;
	--tw-shadow: 0 0 #0000;
	transition: all 0.75s ease;
}
.account-dropdown {
	z-index: 10;
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	font-size: 14px;
	box-sizing: inherit;
	position: absolute;
	top: 70px;
	right: 16px;
	border-radius: 8px;
	background-color: white;
	color: rgb(74, 79, 84);
	width: 280px;
	box-shadow: rgba(0, 0, 0, 0.07) 0px 45px 56px, rgba(0, 0, 0, 0.043) 0px 10.0513px 12.5083px, rgba(0, 0, 0, 0.027) 0px 2.99255px 3.72406px;
	padding: 16px;
}
.accounts {
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	font-size: 14px;
	color: rgb(74, 79, 84);
	box-sizing: inherit;
	padding: 0px;
	box-shadow: none;
	border-radius: 0px;
	margin: 0 0 24px 0;
}
.account {
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	font-size: 14px;
	box-sizing: inherit;
	border-radius: 8px;
	padding: 15px;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: justify;
	justify-content: space-between;
	cursor: pointer;
	color: rgb(114, 114, 122);
	margin: 8px 0px;
	&.active {
		border: 1px solid rgb(143, 205, 255);
		background-color: rgb(240, 249, 255);
		cursor: default;
	}
}
.near-login {
	box-sizing: inherit;
	font-family: Inter, Lato, "Lucida Grande", Tahoma, sans-serif;
	cursor: pointer;
	outline: none;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	padding: 0px;
	width: 100% !important;
	color: rgb(255, 255, 255);
	margin: 0px 0px 0px;
	font-weight: 600;
	height: 44px;
	border-radius: 30px;
	transition: all 100ms ease 0s;
	font-size: 14px;
	word-break: keep-all;
	border: 2px solid rgb(0, 114, 206);
	background: rgb(0, 114, 206);
	& > svg {
		@apply mr-2
	}
}
</style>
