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
    console.log(initVal);
}

console.log('Init val:');
console.log(initVal);
export const userDataStore = writable<UserData>(initVal);

userDataStore.subscribe((value) => {
    if (browser) {
        window.sessionStorage.setItem('userDataStore', JSON.stringify(value));
    }
});
