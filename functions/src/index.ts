import * as functions from "firebase-functions";
const cors = require('cors')({origin: true});
const fl = functions.logger;
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const queryIndexer = functions.https.onRequest((req, res) => {
	cors(req, res, async () => {
		try {
			fl.info("Hello queryIndexer!", {structuredData: true});

			fl.log("queryIndexer input", req.body);
			fl.log("queryIndexer query", req.query);

			res.send("Hello from Firebase!");
		}catch (e) {
			res.send("Server Error");
		}
	})
});
