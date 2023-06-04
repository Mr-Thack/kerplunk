<script lang="ts">
	import checkCredentials from '$lib/login';
	import Credentials from '$components/Credentials.svelte';
  import { userDataStore } from '$library/stores'
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';

  let check = (uname:string, pwd:string, email:string) => Promise<void>;
		
  onMount(() => {
	  check = async function (uname: string, pwd: string, email: string) {
		  const token = await checkCredentials(email, pwd);
        if (browser && token) {
          userDataStore.update(u => ({ ...u, 'token' : token }) );
          goto('/home');
        }
	    }
    }
	);
</script>
<Credentials check={check} title='Log In!'/>
