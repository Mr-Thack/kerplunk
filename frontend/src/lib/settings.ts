import { userDataStore } from '$lib/stores';
import { get } from '$lib/endpoint'

export default async function getSettings(settings: Array<string>) {
	// Pass in the settings you'd like to get as an array of strings
	return await get('userme', {
	  'fields': settings
	}, userDataStore.get().token);
}
