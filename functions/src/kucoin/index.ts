/** Require SDK */
// @ts-ignore
import API from 'kucoin-node-sdk'
import {Candle, Ticker} from "../types";
import * as functions from "firebase-functions";

const fl = functions.logger;

/** Init Configure */
API.init({
	baseUrl: 'https://api.kucoin.com',
	apiAuth: {
		key: '', // KC-API-KEY
		secret: '', // API-Secret
		passphrase: '', // KC-API-PASSPHRASE
	},
	authVersion: 2,
});

/** API use */
export const getAllTickers = async () => {
	return API.rest.Market.Symbols.getAllTickers()
};
export const findCrazyCandles = async (ticker:Ticker, type:string = '1hour', startAt: number = 0, endAt: number = 0):Promise<Candle[]> => {
	try {
		let factor = 1.30
		let low_benchmark = ticker.averagePrice/factor
		let high_benchmark = ticker.averagePrice*factor
		let crazy_candles: Candle[] = []

		// Date Filter
		let date = new Date();
		date.setDate(date.getDate()-1);
		let dates = {
			startAt: Math.round(startAt || date.getTime()/1000),
			endAt: Math.round(endAt || new Date().getTime()/1000),
		}


		let klines: [] = (await API.rest.Market.Histories.getMarketCandles(ticker.symbol, type, dates)).data
		// console.log('klines', {klines})
		if (klines && klines.length)
		for (let kline of klines) {
			if (parseFloat(kline[6])*24/ticker.vol > 3 && (parseFloat(kline[4]) < low_benchmark || parseFloat(kline[3]) > high_benchmark)) {
				// console.log('ticker', ticker, 'ticker')
				// console.log('kline', kline, 'kline')
				let crazy_score = calcCrazyScore(ticker, kline)

				if (crazy_score > 40) {
					let candle:Candle = {
						symbol: ticker.symbol,
						type: type,
						exchange: 'kucoin',
						crazy_score: crazy_score,
						vol24: parseFloat(String(ticker.vol)),
						vol24Value: parseFloat(String(ticker.volValue)),
						average24Price: parseFloat(String(ticker.averagePrice)),
						time: parseInt(kline[0]),
						open: parseFloat(kline[1]),
						close: parseFloat(kline[2]),
						high: parseFloat(kline[3]),
						low: parseFloat(kline[4]),
						volume: parseFloat(kline[5]),
						turnover: parseFloat(kline[6]),
					}
					fl.log('candle', candle)
					crazy_candles.push(candle)
				}
			}
		}
		return crazy_candles
	} catch (e) {
		return Promise.reject(e)
	}
};

function calcCrazyScore(ticker: Ticker, kline: string[]) {
	let cs = 0
	let vol_score = parseFloat(kline[6])*24/ticker.vol
	let open_score = parseFloat(kline[1])/ticker.averagePrice
	let close_score = parseFloat(kline[2])/ticker.averagePrice
	let high_score = parseFloat(kline[3])/ticker.averagePrice
	let low_score = ticker.averagePrice/parseFloat(kline[4])

	// console.log('calcCrazyScore '+ticker.symbol, {
	// 	vol_score,
	// 	open_score,
	// 	close_score,
	// 	high_score,
	// 	low_score,
	// })
	cs = vol_score*2 - open_score - close_score + high_score*2 + low_score*2
	return cs
}
