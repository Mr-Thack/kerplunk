import { formdata_post } from '$lib/endpoint';
import { userDataStore } from '$lib/stores';
import { salert } from '$lib/alerts';
import { dev } from '$app/environment';

export async function checkCredentials(email: string, pwd: string) {
    const data = {
        'grant_type': '',
        // We login with email cuz that doesn't change often
        'username': email,
        'password': pwd,
        'scope': '',
        'client_id': '',
        'client_secret': ''
    };
    const rez = await formdata_post('login', data);
    if (!rez.error) {
        return rez.data.access_token;
    } else {
        console.log(rez);
        salert(`LOGIN ERROR: ${rez.data.detail}`);
        return false;
    }
}

export function logout() {
    // [TODO]
    // As of now, the backend doesn't actually have a logout function
    // But all we really need to do is wipe the user data and reload
    userDataStore.wipe();
    window.location.replace(dev? '/':'/index.html');
}
