import {QueryResult} from "pg";
declare module '*';

export interface TransactionDoc {
	hash: string,
	block: number,
	signer_id: string,
	receiver_id: string,
	deposit?: string,
	method?: string,
	arg_types?: object,
}
export interface ReceiptDoc {
	receipt_id?: string,
	block: number,
	signer_id: string,
	receiver_id: string,
	deposit?: string,
	method?: string,
	arg_types?: object,
}
export type BlockId = number | string

export interface Candle {
	symbol: string,
	type: string,
	exchange: string,
	crazy_score: number,
	vol24: number,
	vol24Value: number,
	average24Price: number,
	time: number,
	open: number,
	close: number,
	high: number,
	low: number,
	volume: number,
	turnover: number,
}
export interface Ticker {
	symbol: string,
	symbolName: string,
	buy: number,
	sell: number,
	changeRate: number,
	changePrice: number,
	high: number,
	low: number,
	vol: number,
	volValue: number,
	last: number,
	averagePrice: number,
	takerFeeRate: number,
	makerFeeRate: number,
	takerCoefficient: number,
	makerCoefficient: number
}
