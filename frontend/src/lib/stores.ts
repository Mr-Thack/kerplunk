import { writable } from 'svelte/store';
import { browser } from '$app/environment';




type UserData = {
    token: string,
    uname: string,
    cid: string
}



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
        })  
    }
}

export const userDataStore = createUserDataStore();

// Whenever any change is made to our user data, it is automatically stored in session storage
userDataStore.subscribe((value) => {
    if (browser) {
        window.sessionStorage.setItem('userDataStore', JSON.stringify(value));
    }
});


export function isLoggedIn() {
    return userDataStore.token !== "" && userDataStore.token !== undefined;
}
