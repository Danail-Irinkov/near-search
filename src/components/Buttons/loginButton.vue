<template>
	<button class="login-with-google-btn"
					@click="handleClick"
	>
		{{btnTitle}}
	</button>
</template>

<script>
import {useStore} from '../../store/index'
export default {
	name: 'loginButton',
	props: {
		platform: {
			type: String,
			default: 'google'
		}
	},
	inject: ['$firebase', 'wallet'],
	setup() {
		const store = useStore()
		return {
			store
		};
	},
	data: () => ({
	}),
	computed: {
		btnTitle() {
			let title = 'Continue with Google'
			if (this.platform === 'near')
				title = 'Login with NEAR'
			
			return title
		},
	},
	methods: {
		handleClick() {
			if (this.platform === 'google')
				return this.googleLoginLogout()
			if (this.platform === 'near')
				return this.nearLoginLogout()
		},
		async nearLoginLogout() {
			console.log('nearLoginLogout')
			return this.wallet.requestSignIn(
				"srch.near", // contract requesting access
				"Search Near", // optional
				window.location.href, // optional
				window.location.href // optional
			);
		},
		async googleLoginLogout() {
			console.log('googleLoginLogout')
			return this.$firebase.googleSignIn()
		},
		OnGoogleAuthSuccess (idToken) {
			console.log('OnGoogleAuthSuccess', idToken)
			// Receive the idToken and make your magic with the backend
		},
		OnGoogleAuthFail (error) {
			console.log('OnGoogleAuthFail', error)
		}
	}
}
</script>

<style scoped lang="scss">
.google-signin-button {
	color: white;
	background-color: red;
	height: 50px;
	font-size: 16px;
	border-radius: 10px;
	padding: 10px 20px 25px 20px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.login-with-google-btn {
	transition: background-color .3s, box-shadow .3s;
	
	padding: 12px 16px 12px 42px;
	border: none;
	border-radius: 3px;
	box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
	
	color: #757575;
	font-size: 14px;
	font-weight: 500;
	font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
	
	background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
	background-color: white;
	background-repeat: no-repeat;
	background-position: 12px 11px;

&:hover {
	 box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 2px 4px rgba(0, 0, 0, .25);
 }

&:active {
	 background-color: #eeeeee;
 }

&:focus {
	 outline: none;
	 box-shadow:
		 0 -1px 0 rgba(0, 0, 0, .04),
		 0 2px 4px rgba(0, 0, 0, .25),
		 0 0 0 3px #c8dafc;
 }

&:disabled {
	 filter: grayscale(100%);
	 background-color: #ebebeb;
	 box-shadow: 0 -1px 0 rgba(0, 0, 0, .04), 0 1px 1px rgba(0, 0, 0, .25);
	 cursor: not-allowed;
 }
}

</style>
