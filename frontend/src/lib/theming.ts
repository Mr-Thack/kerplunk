import { getSettings } from '$lib/settings';
import { userDataStore } from '$lib/stores';


export function removeClass(styleClass: string) {
  // Remove a Style Class from the Document
  document.documentElement.classList.remove(styleClass);
}

export function addClass(styleClass: string) {
  // Add a Style Class to the Document
  document.documentElement.classList.add(styleClass);
}

export function isClass(styleClass: string) {
  // Check if a style class is currently in use
  return document.documentElement.classList.contains(styleClass);
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
