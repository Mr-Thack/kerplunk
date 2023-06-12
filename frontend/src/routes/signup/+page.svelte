<script lang="ts">
	import Credentials from '$components/Credentials.svelte'
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import zxcvbn from 'zxcvbn';
	import { goto } from '$app/navigation';
	import { post } from '$lib/endpoint';
	import checkCredentials from '$lib/login';
	import { userDataStore } from '$lib/stores';
	
	// We just need to initialize them to avoid errors
	let password='';

	const MINREQ = 4; // Minimum required score for signup (on scale 1-5)
	const passwordModal: ModalSettings = {
		type: 'alert',
		title: '',
		body: ''
	}

	const successSignupModal: ModalSettings = {
		type: 'alert',
		title: 'Congrats! You\'ve been signed up!',
		body: 'Head over to your home page!',
		buttonTextCancel: 'Yay!',
		response: () => goto('/home')
	}

	const failureSignupModal: ModalSettings = {
		type: 'alert',
		title: 'Oh No! There\'s an Error! Contact Help if Needed!',
		body: '', // Fill this with error detail later
		buttonTextCancel: 'OK'
	}


	async function check(username: string, p: string, email: string)
	{
    // We pass this to Credentials (at bottom) To check with
		password=p;  // we need to set our current password to password returned
		let score = zxcvbn(password).score + 1;
		// normally returns on scale 0-4, add 1 to get scale 1-5

		
		// After parsing the results, open the modal to show results to the user
		passwordModal.body = "On a Scale from 1 to 5, you got: " + score;
		passwordModal.title = (score >= MINREQ)? "Signing up Now..." : "Try a Stronger Password";
		 
		modalStore.trigger(passwordModal);
		if (score >= MINREQ) {
			const rez = await post('signup',
				{
				'uname': username,
				'pwd': password,
				'email': email
				})
			console.log(rez);
			// It doesn't know rez has a detail, and I don't feel like figuring out how to tell it
			// @ts-ignore
			if (rez.error) {
				// data.detail exists, but typescript doesn't know about it
				// so, we're going to ignore type checking on this line
				// @ts-ignore
				failureSignupModal.body = rez.data.detail;
				modalStore.trigger(failureSignupModal);
			} else {
				// Now, we'll sign the user up and redirect them to the home page
				const token = await checkCredentials(email, password);
				userDataStore.write('token', token);

				modalStore.trigger(successSignupModal);
			}
		}	
	}

</script>
<Credentials check={check} title='Sign Up!'/> 
