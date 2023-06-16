import { writable } from 'svelte/store';
import { browser } from '$app/environment';


type UserData = {
    token: string,
    uname: string,
    cid: string
}



// This is for getting the user information that's already there,
// in case they like left for a while and came back to their own computer
var initVal;
if (browser) {
    initVal = JSON.parse(window.sessionStorage.getItem('userDataStore') || '{}');
}

function createUserDataStore() {
    const {subscribe, set, update } = writable<UserData>(initVal);
    // Setup our own custom function for updating the userDataStore
    return {
        subscribe,
        write: (key: string, value: any) => update(u => {
            u[key] = value;
            return u;        
        }),
        wipe: () => set({}),
        readonce: (key: string) => {
            let val = ""
            const unsub = subscribe(v => {
                val = (v)? v[key]: v;
            });
            unsub();
            return val;
        }
    }
}

export const userDataStore = createUserDataStore();

// Whenever any change is made to our user data, it is automatically stored in session storage
userDataStore.subscribe((value) => {
    if (browser) {
        window.sessionStorage.setItem('userDataStore', JSON.stringify(value));
    }
});
