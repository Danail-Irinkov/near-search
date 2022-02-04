import {QueryResult} from "pg";

export declare module NodeJS  {
	interface Global {
		fl: string
	}
}
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
