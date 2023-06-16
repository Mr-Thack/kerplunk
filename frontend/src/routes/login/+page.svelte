<script lang="ts">
	import { checkCredentials } from '$lib/auth';
  import { userDataStore } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';


	var email = "", pwd = "";
	
 	async function send() {
	  const token = await checkCredentials(email, pwd);
    if (browser && token) {
      userDataStore.write('token', token);
      goto('/home');
    }
	}

</script>
<div class='card p-7'>
	<header class='mx-auto mb-5 text-center'>
		<h2 class="h2">Welcome</h2>
	</header>
	
	<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Your Email' />
	<input class="input m-2" title="Password" type='password' bind:value={pwd} placeholder='Your Password' />
 
	
	<footer class='flex justify-between m-2'>
		<!-- We have to do it twice bcz Svelte can't handle one {} doing both, also we only check passwd.len in 2nd bc it has priority-->
		<button type="button" class="btn variant-filled" disabled={!(email && pwd)} on:click={send}>Log In!</button>
		
		<a type="button" class='btn variant-filled-success' href='/reset'>Forgot Your Password?</a>
	</footer>
	
</div>

