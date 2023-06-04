import zxcvbn from 'zxcvbn'
import {post} from '$library/endpoint'

export async function checkAndSendCredentials(username: string,
                                              password: string,
                                              email: string) {
	// This will both check (locally) and send the credentials to the server
	let score = zxcvbn(password).score;
	let error = ''
	if (score >= 3) {
		const rez = await post('signup',
                                 {'uname': username,
                                  'pwd': password,
                                  'email': email});
        if (rez.error) {
        	error = rez.data.detail;
        }
	}
	// activate passwdModal (/routes/signup)
	return {
		score: score,
		error: error
	};
}