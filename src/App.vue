<template>
  <div>
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link>-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
@import "./assets/tooltip.scss";
#app {
  font-family: 'SF-Pro-Rounded', 'Segoe UI', Arial, 'Karla', serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.max-w-fit {
	max-width: fit-content;
}
.link {
	@apply no-underline hover:underline cursor-pointer;
	color: #1e4ed5;
}

.row {
	@apply grid col-span-12 grid-cols-12
}

#nav {
  padding: 30px;
}

#nav a {
  padding: 0 8px;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.glow {
	-webkit-animation: glow 1s ease-in-out infinite alternate;
	-moz-animation: glow 1s ease-in-out infinite alternate;
	animation: glow 1s ease-in-out infinite alternate;
}

@-webkit-keyframes glow {
	from {
		text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ec6065, 0 0 40px #e60000, 0 0 50px #e60073, 0 0 60px #e60073, 0 0 70px #e60073;
	}
	to {
		text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4d77, 0 0 50px #ff4d4d, 0 0 60px #ff4da6, 0 0 70px #ff4da6, 0 0 80px #ff4da6;
	}
}
</style>
