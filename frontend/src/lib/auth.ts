import { formdata_post, get } from '$lib/endpoint';
import { userDataStore } from '$lib/stores';
import type Alerter from '$lib/alerter';
import getSettings from '$lib/settings';
import { base } from '$app/paths';
import { subscribeNotificationStream } from '$lib/convo';

async function setInfo() {
    const rez = await getSettings(["name", "photo", "schid"]);
    if (rez && !rez.error) {
        userDataStore.write("name", rez.data.name);
        userDataStore.write("photo", rez.data.photo);
        await get('schools/'+rez.data.schid.toString(), {}, userDataStore.get().token).then((schoolInfo) => {
            userDataStore.write("school", schoolInfo.data.name);
        })
        
    }
}

export async function checkCredentials(alerter: Alerter, email: string, pwd: string): Promise<boolean> {
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
        subscribeNotificationStream();
    } else {
        console.log(rez);
        alerter.salert(`LOGIN ERROR: ${rez.data.detail}`);
    }
    return !rez.error;
}

export function logout() {
    // [TODO]
    // As of now, the backend doesn't actually have a logout function
    // But all we really need to do is wipe the user data and reload
    userDataStore.wipe();
    window.location.replace(base + '/');
}
