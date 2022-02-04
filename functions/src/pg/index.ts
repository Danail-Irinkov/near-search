import * as functions from "firebase-functions";
const fl = functions.logger;

import pgDB from "./pgDB";
import near from "../near";

export default {
	queryPublicIndexer: async (query: string) => {
		try {
		let query_time = 20 * 24 * 60 * 60 // days ago
		let block_height_min = near.calcNEARBlockHeight() - query_time
		let block_timestamp_min = (new Date().getTime()  - (query_time * 1000)) * 1000

		fl.log("queryPublicIndexer query", query);
		fl.error("queryPublicIndexer block_height_min", block_height_min);
		fl.error("queryPublicIndexer block_timestamp_min", block_timestamp_min);

		let SQ = `
          SELECT account_id, hits
          FROM (
           SELECT account_id,
              (
                SELECT COUNT(*)
                FROM (
                     SELECT transaction_hash
                     FROM transactions
                     WHERE block_timestamp > ${block_timestamp_min} 
                       AND transactions.receiver_account_id = account_id
                   ) AS transactions
								LEFT JOIN transaction_actions
								ON transactions.transaction_hash = transaction_actions.transaction_hash
                WHERE action_kind = 'FUNCTION_CALL'
              ) AS hits
           FROM (
						    SELECT account_id
						    FROM accounts
						    WHERE last_update_block_height > ${block_height_min} 
						      AND account_id LIKE '${query.length < 4 ? '' : '%'}${query}${query.length < 3 ? '' : '%'}'
						) AS accounts
       ) AS contracts
        WHERE hits > 0
        ORDER BY hits DESC
        LIMIT 50
			`

		// fl.log("queryPublicIndexer query", JSON.stringify(query, null, 2))
		return await pgDB.queryMainnet(SQ)
		} catch (e) {
			fl.error("queryPublicIndexer Error", e)
			return Promise.reject(e)
		}
	},
}
