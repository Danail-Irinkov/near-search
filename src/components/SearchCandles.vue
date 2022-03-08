<template>
<div class="candles-wrapper">
	<h4 class="text-headline mx-auto max-w-fit">
		Crazy Candles
	</h4>
	
	<SearchBar method="queryCandlesIndexer"/>
	
	<expand-height-transition>
		<div v-if="store.showCandles"
				 class="grid grid-cols-12 w-full"
		>
		<div class="smaller-font grid grid-cols-12 col-span-12 mb-4 content-center text-center items-center">
			<h4 class="text-headline mx-auto max-w-fit col-span-3 items-center"
					v-tooltip:top.tooltip="'Hah lol, you know what that means ;)'">
				Pair
			</h4>
			<h4 class="text-headline mx-auto max-w-fit col-span-3 items-center"
					v-tooltip:top.tooltip="'How long ago the candle closed'">
				Time
			</h4>
			<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center"
					v-tooltip:top.tooltip="'Max deviation from the 24h average'">
				Change
			</h4>
			<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center"
					v-tooltip:top.tooltip="'How crazy is the candle?\n\n< 100 - Weak\n100 - 200 - Good\n200+ - INSANE!\n\n A big move is pending!'">
				CrazyN
			</h4>
			<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center">
			
			</h4>
		</div>
		<div class="grid grid-cols-12 col-span-12 content-center text-center items-center"
				v-for="candle of store.resultsCandles">
				<h4 class="text-headline mx-auto max-w-fit col-span-3 items-center">
					{{ candle.symbol }}
				</h4>
				<h4 class="text-headline mx-auto max-w-fit col-span-3 items-center">
					{{ getTimeSince(candle.time) }}
				</h4>
				<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center"
						:class="{red: getChangePercent(candle) < 0, green: getChangePercent(candle) > 0}">
					{{ (getChangePercent(candle)*100).toFixed(0) }}%
				</h4>
				<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center"
						:class="getCrazyClasses(candle)">
					{{ Math.round(candle.crazy_score) }}
				</h4>
				<h4 class="text-headline mx-auto max-w-fit col-span-2 items-center">
					<button class="outline-0" style="font-size: 24px;"
									@click="openLinkNewTab(`https://www.kucoin.com/trade/${candle.symbol}`)"
									v-tooltip:top.tooltip="'KuCoin'">
						<img :src="kuCoinLogo" class="stats-gallery-logo" alt="stats-gallery-logo"/>
					</button>
				</h4>
			</div>
		</div>
	</expand-height-transition>
	
	<span class="kukoin-tag mt-8">
		data provided by
		<a href="https://kucoin.com/" class="link">KuCoin</a>
	</span>
</div>
</template>

<script>
import {useStore} from '../store/index'
import SearchBar from '../components/SearchBar.vue'
import kuCoinLogo from '../assets/kucoin_logo.svg'
export default {
	name: 'SearchCandles',
	inject: ['openLinkNewTab'],
	components: { SearchBar },
	data() {
		return {
			updating: false
		}
	},
	setup() {
		const store = useStore()
		return {
			store,
			kuCoinLogo
		};
	},
	mounted() {
	 this.updateCandles()
	},
	methods: {
		async updateCandles() {
			try {
				this.updating = true
				
				this.updating = false
			} catch (e) {
				console.log('updateCandles Err:', e)
				this.updating = false
				return Promise.reject(e)
			}
		},
		getTimeSince(timestamp){
			return this.$moment(timestamp*1000).fromNow(false)
		},
		getChangePercent(candle){
			let percent = 0
			let up_delta = candle.high - candle.average24Price
			let down_delta = candle.average24Price - candle.low
			
			if(up_delta > down_delta)
				percent = candle.high/candle.average24Price
			else
				percent = -(candle.average24Price/candle.low)
			
			return percent
		},
		getCrazyClasses(candle){
			let classes = ''
			switch (true) {
				case candle.crazy_score < 100:
					classes = 'font-medium'
					break;
				case candle.crazy_score < 200:
					classes = 'font-normal text-orange-500'
					break;
				case candle.crazy_score < 300:
					classes = 'font-semibold text-red-300'
					break;
				case candle.crazy_score < 400:
					classes = 'font-bold text-red-500'
					break;
				case candle.crazy_score >= 400:
					classes = 'font-extrabold text-red-700'
					break;
			}
			
			return classes
		},
	}
}
</script>

<style scoped>
.candles-wrapper {
	@apply pt-0
}
.kukoin-tag {
	@apply w-full block mt-16;
	text-align: end;
}
.green {
	@apply text-bold text-green-500
}
.red {
	@apply text-bold text-red-500
}
.smaller-font > h4 {
	font-size:14px!important;
}
</style>
