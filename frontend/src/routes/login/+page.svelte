<script lang="ts">
	import { checkCredentials } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
	import { getThemeAndAccent } from '$library/theming';
	import { base } from '$app/paths';	
	import { onMount } from 'svelte';
	var email = "", pwd = "", emailBox:HTMLElement, pwdBox:HTMLElement, page:HTMLElement;

    window.addEventListener('resize', () => {
      if(window.innerWidth < 1024) {
        try {
          page.style.maxHeight = (window.innerHeight - 144).toString()+"px";
        } catch {
          // Real men don't solve their problems
        }
      } else {
        page.style.maxHeight = (window.innerHeight).toString()+"px";
      }
    });

	onMount(() => {
		if(window.innerWidth < 1024) {
			try {
			page.style.maxHeight = (window.innerHeight - 144).toString()+"px";
			} catch {
			// Real men don't solve their problems
			}
		} else {
			page.style.maxHeight = (window.innerHeight).toString()+"px";
		}
		pwdBox.addEventListener('keypress', function(event) {
                if (event.key == "Enter") {
                    event.preventDefault();
                    sendLogin()
                }
            });
		emailBox.addEventListener('keypress', function(event) {
			if (event.key == "Enter") {
				event.preventDefault();
				pwdBox.focus()
			}
		});
	})
	
 	async function sendLogin() {
	  const success = await checkCredentials(email, pwd);
		if (browser && success) {
			getThemeAndAccent();
			goto(base + '/home');
		}
	}

</script>
<header class="mx-auto text-center pr-4 h-fill">
	<h2 class="h2">Login!</h2>
</header>
<div bind:this={page} class="w-full lg:h-fill flex items-center">
	<div class='card p-4 w-full max-h-[calc(100vh-142px)] lg:max-h-full m-4'>
		<header class='mx-auto mb-5 text-center'>
			<h2 class="h2 mb-2 lg:mb-16 mt-0">Welcome</h2>
		</header>
		
		<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Email" type='email' bind:value={email} bind:this={emailBox} placeholder='Your Email' />
		<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Password" type='password' bind:value={pwd} bind:this={pwdBox} placeholder='Your Password' />
	
		
		<footer class='flex justify-between m-2'>
			<!-- We have to do it twice bcz Svelte can't handle one {} doing both, also we only check passwd.len in 2nd bc it has priority-->
			<button type="button" class="btn variant-filled-primary text-sm lg:text-base h-8 lg:h-10" disabled={!(email && pwd)} on:click={sendLogin}>Log In!</button>
			
			<a href='{base}/reset' class="btn variant-filled-secondary text-sm lg:text-base h-8 lg:h-10">Forgot Your Password?</a>
			
		</footer>
	</div>
</div>
