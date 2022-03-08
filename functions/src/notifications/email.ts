import {User, Notification} from '../../../src/store'
import {db} from "../index";

export default {
	async send(user:User, notification:Notification): Promise<any>{
		try {
			console.log('Sending Notification Email')
			await db.collection("emails")
				.add({
					to: "dan@procc.co",
					message: {
						subject: "searchnear.net - "+notification.title,
						text: notification.subtitle,
						html: "This is a Notification from searchnear.net" +
							"<br>"+
							`<h4>${notification.title}</h4>` +
							`<h4>${notification.subtitle}</h4>` +
							`<a href='${notification.url}'>Open in browser</a>`+
							"<br>"+
							`<a href='https://searchnear.net?beta=true&tab=Notify'>Unsubscribe</a>`,
					},
				})
			return 'Email - Sent'
		} catch (e) {
			return Promise.reject(e)
		}
	}
}
