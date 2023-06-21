<script lang="ts">
	import { checkCredentials } from '$lib/auth';
  import { get ,post } from '$lib/endpoint';
	import { userDataStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
	import { salert, proompt } from '$lib/alerts';
	
	var email = "", pwd = "";
	
	async function sendReset() {
		let rz = await post('reset', {
			'email': email,
			'pwd': pwd
		});

		if (rz.error) {
			// @ts-ignore
			salert("Error: " + rz.data.detail);
		} else {
			salert('Check Your Email!');
			proompt('What is the Code?', async (code: string) => {
				let rez = await get('reset', {
					'code': code
				});
				if (rez.error) {
					// @ts-ignore
					salert("Error: " + rz.data.detail)
				} else {
					salert("Congrats! The password has been reset!");
					const token = await checkCredentials(email, pwd);
    			if (browser && token) {
      			userDataStore.write('token', token);
      			goto('/home');
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

