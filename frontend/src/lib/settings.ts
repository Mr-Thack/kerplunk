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
	if (rez && !rez.error) {
		if (!rez.data.theme) {
			addClass('dark');
      addClass('red');
		} else {
		  removeClass('dark');
		  removeClass('red');
		  addClass(rez.data.accent);
    }
	} else {
		addClass('red');
	}
}

