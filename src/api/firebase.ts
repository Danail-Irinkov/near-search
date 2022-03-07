import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore/lite';
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, signInWithCustomToken, updateProfile, updateCurrentUser } from "firebase/auth";

import {User} from '@/store'

const firebaseConfig = {
	apiKey: "AIzaSyDfiXN-vr9aoexpFKBumbyVjGYCEl3REkE",
	authDomain: "near-search-3807d.firebaseapp.com",
	projectId: "near-search-3807d",
	storageBucket: "near-search-3807d.appspot.com",
	messagingSenderId: "852875902491",
	appId: "1:852875902491:web:861fd6ed328a420e7742be",
	measurementId: "G-DC8Y4KN5FM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth();
let vue_app: any
let state: any

auth.onAuthStateChanged(async function(user) {
	console.log('onAuthStateChanged user', user)
	if (user) {
		// User is signed in.
		await loadUser()
		userIsLoggedIn = true
	} else {
		// User is signed out.
		userIsLoggedIn = false
	}
});

// Exports
export function init(app:any, state_ref:any){
	vue_app = app
	state = state_ref
	// console.log('init app', app)
	// console.log('init state', state)
	return true
}
export function getCurrentUser(){
	return auth.currentUser
}

export let userIsLoggedIn = false
export let userDoc: any

export async function loadUser(){
	try {
		console.log('loadUser start')
		if (!auth.currentUser) return console.log('Not Logged in')

		if (!userDoc)
			userDoc = await doc(db, 'users/', auth.currentUser.uid)

		let document = await getDoc(userDoc)
		state.user = document.data()
		console.log('loadUser document', state.user)

	} catch (e: any) {
		const errorMessage = e.message;
		return Promise.reject(errorMessage)
	}
}

export async function updateUser(data: User){
	try {
		if (!auth.currentUser) return alert('Not Logged in')
		if (!userDoc) return alert('No User Found')

		// console.log('updateUser data', data)
		await setDoc(userDoc, data, { merge: true })
		// console.log('updateUser setDoc')

		// let document = await getDoc(userDoc)
		// state.user = document.data()
		// console.log('updateUser document', state.user)

	} catch (e: any) {
		const errorMessage = e.message;
		return Promise.reject(errorMessage)
	}
}

export async function googleSignIn(){
	try {
		let result = await signInWithPopup(auth, provider)
		const credential = GoogleAuthProvider.credentialFromResult(result);
		if (credential?.accessToken) {
			const google_user = result.user;
			const token = credential.accessToken;
			state.user.google_token = token

			if (google_user.email) {
				state.user.email = google_user.email
			}

			await updateUser(state.user)

			return google_user
		} else {
			// Reset Login Form
		}
	} catch (e: any) {
		const errorMessage = e.message;
		const email = e.email;
		const credential = GoogleAuthProvider.credentialFromError(e);
		console.log('signInWithPopup ERR errorMessage', errorMessage)
		console.log('signInWithPopup ERR credential', credential)
		console.log('signInWithPopup ERR email', email)
		return Promise.reject(errorMessage)
	}
}

export function firebaseSignOut(){
	return signOut(auth)
		.then(() => {
			console.log('Google SignOut Success')
			state.user.google_token = null
		}).catch((error) => {
			console.error('Google SignOut ERROR')
			return Promise.reject(error)
	});
}
