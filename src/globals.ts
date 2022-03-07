import 'virtual:windi.css'
import '../node_modules/vue-search-input/dist/styles.css'
import AutoLinker from "autolinker";
import * as firebase from './api/firebase'

export default {
	install: (app:any, state:any) => {
		firebase.init(app, state)
		app
			.provide('$firebase', firebase)
			.provide('$autoLinkText', autoLinkText)
			.provide('$updateQueryStringParameter', updateQueryStringParameter)
			.provide('openLinkNewTab', openLinkNewTab)
			.provide('sleep', sleep)
	},
};

// Global Methods
const autoLinkText = function (text: string, linkClass = 'descriptionLink') {
	return AutoLinker.link(text, {
		newWindow: true,
		className: linkClass,
		truncate: { length: 36, location: 'smart' }
	});
}
const openLinkNewTab = (URL = null) => {
	if (URL)
		window.open(URL, '_blank')
}
const sleep = (ms:number) => {
	return new Promise(resolve => {
		setTimeout(resolve, ms)
	})
}

const updateQueryStringParameter = (uri:string, key:string, value:string) => {
	var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	var separator = uri.indexOf('?') !== -1 ? "&" : "?";
	if (uri.match(re)) {
		return uri.replace(re, '$1' + key + "=" + value + '$2');
	} else {
		return uri + separator + key + "=" + value;
	}
}
