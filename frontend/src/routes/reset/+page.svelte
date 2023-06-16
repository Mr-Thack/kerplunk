<script lang="ts">
  import { goto } from '$app/navigation';
	import { get, post } from '$lib/endpoint';
	import { salert, proompt } from '$lib/simpleAlert';
	
	var email = "", pwd = "";
	
 	async function sendRequest() {
		let rz = await post('reset', {
			'email': email,
			'pwd': pwd
		});

		if (rz.error) {
			// @ts-ignore
			salert(rz.data.detail);
		} else {
			salert('Check Your Email!');
			proompt('What is the Code?', async (code: string) => {
				let rez = await get('reset', {
					'code': code
				});
				if (rez.error) {
					// @ts-ignore
					salert(rz.data.detail)
				} else {
					salert("Congrats! The password has been reset!")
					goto('/login');
				}
			});
		}
	} 

	/*
	  const token = await checkCredentials(email, pwd);
    if (browser && token) {
      userDataStore.write('token', token);
      goto('/home');
    }
	}
	*/

</script>
<div class='card p-7 m-4'>
	<header class='mx-auto mb-5 text-center'>
		<h2 class="h2">Oh No!</h2>
	</header>
	
	<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Your Currently Registered Email' />
	<input class="input m-2" title="Password" type='password' bind:value={pwd} placeholder='What Password Do You Want?' />
 
	
	<footer class='flex justify-between m-2'>
		<button type="button" class="btn variant-filled-success" disabled={!(email && pwd)} on:click={sendRequest}>Reset!</button>
		
		<a type="button" class='btn variant-filled-secondary' href='/login'>Login Instead!</a>
	</footer>
	
</div>

