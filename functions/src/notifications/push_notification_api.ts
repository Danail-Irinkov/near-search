import axios from 'axios'
import {User, Notification} from '../../../src/store'


export default {
	async send(user: User, notification:Notification): Promise<any>{
		try {
			if (!user.xdroid_push_id) return
			console.log('Sending Push Notification', user)
			let api_url = `http://xdroid.net/api/message?k=${user.xdroid_push_id}&t=${encodeURIComponent(notification.title)}&c=${encodeURIComponent(notification.subtitle)}&u=${encodeURIComponent(notification.url)}`

			// console.log(api_url)
			await axios.get(api_url).then((res)=>res.data)
			return 'Push Notification - Sent'
		} catch (e) {
			return Promise.reject(e)
		}
	}
}
