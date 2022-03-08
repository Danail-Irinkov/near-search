import {User, Notification} from '../../../src/store'
import {db} from '../index'
import email from './email'
// @ts-ignore
import push_notification_api from './push_notification_api'
import * as functions from "firebase-functions";

const fl = functions.logger;
const notify_platforms = [email, push_notification_api]

export async function sendNotificationToAll(notification:Notification): Promise<any> {
		try {
			let promises:any = []
			let users = await db.collection('users').where('enable_notifications', '==', true).get()

			users.forEach((user) => {
				for (let platform of notify_platforms) {
					promises.push(platform.send(user.data(), notification))
				}
			});

			return Promise.all(promises)
		} catch (e) {
			fl.log('sendNotificationToAll err', e)
			return await Promise.reject(e)
		}
	}
export async function sendNotificationToUser(user:User, notification:Notification): Promise<any> {
	try {
		let promises:any = []
		for (let platform of notify_platforms) {
			promises.push(platform.send(user, notification))
		}
		return await Promise.all(promises)
	} catch (e) {
		fl.log('sendNotificationToUser err', e)
		return Promise.reject(e)
	}
}

