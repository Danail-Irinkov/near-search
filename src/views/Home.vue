<template>
	<div class="header" id="wikiApp">
		<Head>
			<title>NEAR Search</title>
			<meta name="description" content="Search the NEAR Network for Contracts and review their methods" />
		</Head>
		
		<!--		// BODY    -->
		<img :src="SearchNearLogo" alt="Search NEAR Logo" class="mb-16" />
		
		<SearchBar />
		
		<expand-height-transition>
			<ResultsContracts />
		</expand-height-transition>
		
	</div>
</template>

<script>
import {Head} from '@egoist/vue-head'
import SearchNearLogo from '../assets/SearchNearLogo2.svg'
import SearchBar from '../components/SearchBar.vue'
import ResultsContracts from '../components/ResultsContracts.vue'

export default {
	name: 'SearchNearHome',
	setup() {
		return {
			SearchNearLogo
		};
	},
	components: {
		ResultsContracts,
		SearchBar,
		Head,
	},
	data() {
		return {
		}
	},
	filters: {
	}
}
</script>

<style lang="scss">
$c-white: #F7EFE2;
$c-black: #00000042;
$c-warning: #F9A603;
$c-near: #999999FF;
$c-near-blue: #00bcd4;
body,
html {
	width: 100%;
	height: 100%;
	background: val($c-white);
	font-family: 'Source Sans Pro', sans-serif;
}
a {
	color: #333;
}

h1,
h2 {
	font-family: 'Source Sans Pro', sans-serif;
}

.header {
	color: #555;
	height: 100%;
	text-align: center;
	padding: 12vh 0;
	max-width: 600px;
	margin: 0 auto;
}

.header .cover-heading {
	font-size: 46px;
	color: val($c-near);
	margin-top: 1.6rem;
	margin-bottom: 1.6rem;
}

.text-body-1 {
	font-size: 15px;
	line-height: 20px;
	padding-top: 12px;
	margin-bottom: 1.4rem;
	letter-spacing: 0;
}

/* Material Design code below */
.raised-button {
	display: inline-block;
	text-align: center;
	line-height: 1;
	cursor: pointer;
	-webkit-appearance: none;
	transition: all 0.25s ease-out;
	vertical-align: middle;
	border: 1px solid transparent;
	border-radius: 2px;
	padding: 0.85em 1em;
	margin: 0 1rem 1rem 0;
	font-size: 0.9rem;
	background: var($c-near);
	color: var($c-white);
}
.raised-button:hover, .raised-button:focus {
	background: var($c-warning);
	color: var($c-white);
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
}

button:focus 		{ outline:none; }
input:focus 		{ outline:none; }

[type="text"], [type="password"], [type="date"], [type="datetime"], [type="datetime-local"], [type="month"], [type="week"], [type="email"], [type="number"], [type="search"], [type="tel"], [type="time"], [type="url"], [type="color"], textarea {
	display: block;
	box-sizing: border-box;
	width: 100%;
	height: 2.4375rem;
	padding: 0.5rem;
	border: 0;
	margin: 0 0 1rem;
	font-family: inherit;
	font-size: 1rem;
	color: var($c-near);
	background-color: var($c-white);
	box-shadow: none;
	border-radius: 0;
	transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
	-webkit-appearance: none;
	-moz-appearance: none;
}
input[type="text"], input[type="password"], input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="month"], input[type="week"], input[type="email"], input[type="number"], input[type="search"], input[type="tel"], input[type="time"], input[type="url"], input[type="color"], textarea {
	//padding: 1rem 0 0.5rem 0;
	//margin: 1.75rem 0 0.5rem;
	border-bottom: 1px solid #e0e0e0;
	border-radius: 0;
	background: transparent;
}
input[type="text"]::-webkit-input-placeholder, input[type="text"]::-webkit-input-placeholder, input[type="password"]::-webkit-input-placeholder, input[type="password"]::-webkit-input-placeholder, input[type="date"]::-webkit-input-placeholder, input[type="date"]::-webkit-input-placeholder, input[type="datetime"]::-webkit-input-placeholder, input[type="datetime"]::-webkit-input-placeholder, input[type="datetime-local"]::-webkit-input-placeholder, input[type="datetime-local"]::-webkit-input-placeholder, input[type="month"]::-webkit-input-placeholder, input[type="month"]::-webkit-input-placeholder, input[type="week"]::-webkit-input-placeholder, input[type="week"]::-webkit-input-placeholder, input[type="email"]::-webkit-input-placeholder, input[type="email"]::-webkit-input-placeholder, input[type="number"]::-webkit-input-placeholder, input[type="number"]::-webkit-input-placeholder, input[type="search"]::-webkit-input-placeholder, input[type="search"]::-webkit-input-placeholder, input[type="tel"]::-webkit-input-placeholder, input[type="tel"]::-webkit-input-placeholder, input[type="time"]::-webkit-input-placeholder, input[type="time"]::-webkit-input-placeholder, input[type="url"]::-webkit-input-placeholder, input[type="url"]::-webkit-input-placeholder, input[type="color"]::-webkit-input-placeholder, input[type="color"]::-webkit-input-placeholder, textarea::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
	color: var($c-black);
}
input[type="text"]:-moz-placeholder, input[type="text"]::-moz-placeholder, input[type="password"]:-moz-placeholder, input[type="password"]::-moz-placeholder, input[type="date"]:-moz-placeholder, input[type="date"]::-moz-placeholder, input[type="datetime"]:-moz-placeholder, input[type="datetime"]::-moz-placeholder, input[type="datetime-local"]:-moz-placeholder, input[type="datetime-local"]::-moz-placeholder, input[type="month"]:-moz-placeholder, input[type="month"]::-moz-placeholder, input[type="week"]:-moz-placeholder, input[type="week"]::-moz-placeholder, input[type="email"]:-moz-placeholder, input[type="email"]::-moz-placeholder, input[type="number"]:-moz-placeholder, input[type="number"]::-moz-placeholder, input[type="search"]:-moz-placeholder, input[type="search"]::-moz-placeholder, input[type="tel"]:-moz-placeholder, input[type="tel"]::-moz-placeholder, input[type="time"]:-moz-placeholder, input[type="time"]::-moz-placeholder, input[type="url"]:-moz-placeholder, input[type="url"]::-moz-placeholder, input[type="color"]:-moz-placeholder, input[type="color"]::-moz-placeholder, textarea:-moz-placeholder, textarea::-moz-placeholder {
	color: var($c-black);
}
input[type="text"]:focus, input[type="password"]:focus, input[type="date"]:focus, input[type="datetime"]:focus, input[type="datetime-local"]:focus, input[type="month"]:focus, input[type="week"]:focus, input[type="email"]:focus, input[type="number"]:focus, input[type="search"]:focus, input[type="tel"]:focus, input[type="time"]:focus, input[type="url"]:focus, input[type="color"]:focus, textarea:focus {
	border: none;
	border-bottom: 2px solid var($c-warning);
	box-shadow: none;
	position: relative;
	top: 1px;
	background: transparent;
}
input[type="text"].with-floating-label + label.floating-label, input[type="password"].with-floating-label + label.floating-label, input[type="date"].with-floating-label + label.floating-label, input[type="datetime"].with-floating-label + label.floating-label, input[type="datetime-local"].with-floating-label + label.floating-label, input[type="month"].with-floating-label + label.floating-label, input[type="week"].with-floating-label + label.floating-label, input[type="email"].with-floating-label + label.floating-label, input[type="number"].with-floating-label + label.floating-label, input[type="search"].with-floating-label + label.floating-label, input[type="tel"].with-floating-label + label.floating-label, input[type="time"].with-floating-label + label.floating-label, input[type="url"].with-floating-label + label.floating-label, input[type="color"].with-floating-label + label.floating-label, textarea.with-floating-label + label.floating-label {
	font-size: 1rem;
	color: var($c-black);
	position: relative;
	top: -35px;
	transition: top .45s ease-in-out, color .45s ease-in-out, font-size .45s ease-in-out;
	height: 0;
	cursor: text;
}
input[type="text"].with-floating-label:focus + label.floating-label, input[type="text"].with-floating-label:valid + label.floating-label, input[type="password"].with-floating-label:focus + label.floating-label, input[type="password"].with-floating-label:valid + label.floating-label, input[type="date"].with-floating-label:focus + label.floating-label, input[type="date"].with-floating-label:valid + label.floating-label, input[type="datetime"].with-floating-label:focus + label.floating-label, input[type="datetime"].with-floating-label:valid + label.floating-label, input[type="datetime-local"].with-floating-label:focus + label.floating-label, input[type="datetime-local"].with-floating-label:valid + label.floating-label, input[type="month"].with-floating-label:focus + label.floating-label, input[type="month"].with-floating-label:valid + label.floating-label, input[type="week"].with-floating-label:focus + label.floating-label, input[type="week"].with-floating-label:valid + label.floating-label, input[type="email"].with-floating-label:focus + label.floating-label, input[type="email"].with-floating-label:valid + label.floating-label, input[type="number"].with-floating-label:focus + label.floating-label, input[type="number"].with-floating-label:valid + label.floating-label, input[type="search"].with-floating-label:focus + label.floating-label, input[type="search"].with-floating-label:valid + label.floating-label, input[type="tel"].with-floating-label:focus + label.floating-label, input[type="tel"].with-floating-label:valid + label.floating-label, input[type="time"].with-floating-label:focus + label.floating-label, input[type="time"].with-floating-label:valid + label.floating-label, input[type="url"].with-floating-label:focus + label.floating-label, input[type="url"].with-floating-label:valid + label.floating-label, input[type="color"].with-floating-label:focus + label.floating-label, input[type="color"].with-floating-label:valid + label.floating-label, textarea.with-floating-label:focus + label.floating-label, textarea.with-floating-label:valid + label.floating-label {
	color: var($c-near-blue);
	font-size: 0.75rem;
	top: -56px;
}
textarea, pre {
	border: 0;
	font-size: 1rem;
	width: 100%;
	padding: 10px;
	border-bottom: 1px solid #eeeeee;
}

// Slide Out animation

.resizable-div {
	 width: 100%;
	 animation-name: resize-to;
	 animation-duration: 0.5s;
}
@keyframes resize-to {
	from {width: 0;}
	to {width: 100px;}
}
</style>
