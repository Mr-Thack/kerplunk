import {formdata_post} from '$library/endpoint'

export default async function checkCredentials(email: string, pwd: string) {
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
        alert(`LOGIN ERROR: ${rez.data.detail}`);
        return false;
    }
}
