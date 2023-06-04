<script lang="ts">
	import { page } from '$app/stores';
	let uname = '';
	let pwd = '';
	let email = '';
    // Check is actually a function
	export let check: (uname: string, pwd: string, email: string) => void;
	// Title, but we could also put a different prompt
	export let title: string;
  
	function send() {
		check(uname, pwd, email)
	}
	
  const condSignup = (email && uname && pwd);
  const condLogin = (email && pwd);
  var curcond = ($page.url.pathname == '/signup')? condSignup:condLogin;
</script>
<div class='card p-7'>
	<header class='mx-auto mb-5 text-center'>
		<h2 class="h2">Welcome</h2>
	</header>
	
	<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Your Email' />
	<input class="input m-2" title="Password" type='password' bind:value={pwd} placeholder='Your Password' />
  
  {#if $page.url.pathname == '/signup'}
    <input class="input m-2" title="Username" type='text' bind:value={uname} placeholder='Your Username' />
  {/if}
	
	<footer class='flex justify-between m-2'>
		<!-- We have to do it twice bcz Svelte can't handle one {} doing both, also we only check passwd.len in 2nd bc it has priority-->
		<button type="button" class="btn variant-filled" on:click={send} class:success='{curcond}' class:disabled='{!curcond}'>{title}</button>
		
		{#if $page.url.pathname == '/login'}
			<a type="button" class='btn variant-filled' href='/signup'>Sign Up Instead!</a>
		{/if}	
	</footer>
	
</div>


