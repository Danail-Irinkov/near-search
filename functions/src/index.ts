import * as functions from "firebase-functions";
import pgDB from "./pgDB";

const cors = require('cors')({origin: true});
const fl = functions.logger;

export const queryIndexer = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			fl.log("queryIndexer input", req.body);
			let words = String(req.body.query).split(' ')[0]

			let query_time = 20 * 24 * 60 * 60 // days ago
			let block_height_min = calcNEARBlockHeight() - query_time
			let block_timestamp_min = (new Date().getTime()  - (query_time * 1000)) * 1000

			fl.log("queryIndexer words", words);
			fl.error("queryIndexer block_height_min", block_height_min);
			fl.error("queryIndexer block_timestamp_min", block_timestamp_min);

			let query = `
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
						      AND account_id LIKE '${words.length < 4 ? '' : '%'}${words}${words.length < 3 ? '' : '%'}'
						) AS accounts
       ) AS contracts
        WHERE hits > 0
        ORDER BY hits DESC
        LIMIT 50
			`

			fl.log("queryIndexer query", JSON.stringify(query, null, 2))
			let result = await pgDB.queryMainnet(query)

			fl.log("queryIndexer result", result.rows)

			res.send({ contracts: result.rows })
			return result
		}catch (e) {
			fl.error("queryIndexer Error", e)
			res.status(502).send("Server Error")
			return Promise.reject(e)
		}
	})
});

function calcNEARBlockHeight() {
	let initial_block_time = new Date(Date.parse('22 Apr 2020 00:00:00 GMT')).getTime()/1000 - 2000000
	return Math.round(new Date().getTime()/1000 - initial_block_time)
}
