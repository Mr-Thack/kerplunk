<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
	import { checkCredentials } from '$lib/auth';
    import { get, post } from '$lib/endpoint';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
	import Alerter from '$lib/alerter';
    import { base } from '$app/paths'; 
    const alerter = new Alerter(getModalStore());

	var email = "", pwd = "";
	
	async function sendReset() {
		let rz = await post('reset', {
			'email': email,
			'pwd': pwd
		});

		if (rz.error) {
			alerter.salert("Error: " + rz.data.detail);
		} else {
			alerter.salert('Check Your Email!');
			alerter.proompt('What is the Code?', async (code: string) => {
				let rez = await get('reset', {
					'code': code
				});
				if (rez.error) {
					alerter.salert("Error: " + rz.data.detail)
				} else {
					alerter.salert("Congrats! The password has been reset!");
					const success = await checkCredentials(alerter, email, pwd);
    			    if (browser && success) {
      			        goto(base + '/home');
    			    }
				}			
			});
		}
	}
</script>
<div class='card p-7'>
	<header class='mx-auto mb-5 text-center'>
		<h2 class="h2">Oh No!!</h2>
	</header>
	
	<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Current Email' />
	<input class="input m-2" title="Password" type='password' bind:value={pwd} placeholder='New Password' />
 
	<button type="button" class="btn variant-filled-secondary" disabled={!(email && pwd)} on:click={sendReset}>Change Password!</button>
</div>

