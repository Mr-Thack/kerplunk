import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';


interface UserData extends Object {
    token?: string,
    name: string,
    cid: string,
    photo: string,
    email?: string,
    theme: number,
    accent: string,
    school: string, 
    convo?: string
}

const defaultValue: UserData = {
    accent: "red",
    theme: 1,
    name: "If you see this, there is an error",
    cid: "",
    school: "If you see this, there is an error",
    photo: ""
}


function createUserDataStore() {
    let tmp = window.sessionStorage.getItem('userDataStore');
    const initVal: UserData = (tmp && tmp != '{}')? JSON.parse(tmp) : defaultValue;

    const store = writable<UserData>(initVal);
    // Setup our own custom function for updating the userDataStore
    return {
        get: () => {
            return get(store);
        },
        set: store.set,
        subscribe: store.subscribe,
        write: (key: string, value: any) => store.update((u: UserData) => {
            u[key as keyof UserData] = value;
            return u;        
        }),
        wipe: () => store.set(defaultValue)
    }
}

export const userDataStore = createUserDataStore();

// Whenever any change is made to our user data, it is automatically stored in session storage
if (browser) {
    userDataStore.subscribe((value) => {
        window.sessionStorage.setItem('userDataStore', JSON.stringify(value));
    });
}
