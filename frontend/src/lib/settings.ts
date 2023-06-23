import { userDataStore } from '$lib/stores';
import { get } from '$lib/endpoint'
import { removeClass, addClass, isClass } from '$lib/generalHelpers';

export default async function getSettings(settings: Array<string>) {
	// Pass in the settings you'd like to get as an array of strings
	return await get('userme', {
	  'fields': settings
	}, userDataStore.readonce('token'));
  }

export async function getThemeAndAccent() {
  var rez = await getSettings(["theme", 'accent']);
  	console.log(rez)
	if (rez && !rez.error) {
		userDataStore.write('accent', rez.data.accent);
		// This seems to fix login theming problems.
		removeClass('dark');
		removeClass('red');
		addClass(rez.data.accent);
		if (rez.data.theme) {
			addClass("light");
		} else {
			addClass("dark");
		}
	} else {
		addClass('red');
	}
}

