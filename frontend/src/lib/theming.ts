import getSettings from '$lib/settings';
import { setModeCurrent, setModeUserPrefers } from '@skeletonlabs/skeleton';
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
    let noTheme = true;

    if (userDataStore.get('token')) {
        const rez = await getSettings(["theme", 'accent']);
        if (rez && !rez.error) {
            userDataStore.write('accent', rez.data.accent);
            // This seems to fix login theming problems.
            removeClass('dark');
            removeClass('red');
            addClass(rez.data.accent);
            let preferredMode = rez.data.theme === 1;
            setModeCurrent(preferredMode);
            setModeUserPrefers(preferredMode);
            if (preferredMode) {
                addClass("light");
            } else {
                addClass("dark");
            }
            noTheme = false;
        } else {
            // For some reason, dark isn't the default theme anymore. This fixes that.
            addClass("dark");
        }
    }
    
    if (noTheme) {
        addClass('red');
    }
}
