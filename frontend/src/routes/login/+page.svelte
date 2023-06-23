<script lang="ts">
	import { checkCredentials } from '$lib/auth';
	import { userDataStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
	import getSettings from '$library/settings';
	
	var email = "", pwd = "";
	
 	async function sendLogin() {
	  const token = await checkCredentials(email, pwd);
    if (browser && token) {
      	userDataStore.write('token', token);
	  	var rez = await getSettings(["theme", 'accent']);
		if (!(rez === undefined || rez.error === true)) {
						if (rez.data.theme === 0) {
			document.documentElement.classList.add('dark');
			} else {
			document.documentElement.classList.remove('dark');
			}
			document.documentElement.classList.remove('red');
			document.documentElement.classList.add(rez.data.accent);
		} else {
			document.documentElement.classList.add('red');
		}
      goto('/home');
    }
	}

</script>
<header class="mx-auto text-center pr-4">
	<h2 class="h2">Login!</h2>
</header>
<div class="w-full h-full flex items-center h-screen absolute inset-x-0 inset-y-0 pl-28 pr-4">
	<div class='card p-7 w-full p-12'>
		<header class='mx-auto mb-5 text-center'>
			<h2 class="h2 mb-16 mt-0">Welcome</h2>
		</header>
		
		<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Your Email' />
		<input class="input m-2" title="Password" type='password' bind:value={pwd} placeholder='Your Password' />
	
		
		<footer class='flex justify-between m-2'>
			<!-- We have to do it twice bcz Svelte can't handle one {} doing both, also we only check passwd.len in 2nd bc it has priority-->
			<button type="button" class="btn variant-filled-primary" disabled={!(email && pwd)} on:click={sendLogin}>Log In!</button>
			
			<a href='/reset' class="btn variant-filled-secondary">Forgot Your Password?</a>
			
		</footer>
	</div>
</div>
