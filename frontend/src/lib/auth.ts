import { formdata_post } from '$lib/endpoint';
import { userDataStore } from '$lib/stores';
import { salert } from '$lib/alerts';
import { dev } from '$app/environment';



async function setInfo() {
    const rez = await getSettings(["name", "photo"]);
    if (rez && !rez.error) {
        userDataStore.write("name", rez.data.name);
        userDataStore.write("photo", rez.data.photo);
    }
}

export async function checkCredentials(email: string, pwd: string): Promise<boolean> {
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
        userDataStore.write('token', rez.data.access_token);
        setInfo();
    } else {
        console.log(rez);
        salert(`LOGIN ERROR: ${rez.data.detail}`);
    }
    return !rez.error;
}

export function logout() {
    // [TODO]
    // As of now, the backend doesn't actually have a logout function
    // But all we really need to do is wipe the user data and reload
    userDataStore.wipe();
    window.location.replace(dev? '/':'/index.html');
}
