<script lang='ts'>
  import { userDataStore } from "$library/stores";
  import { onMount, onDestroy } from "svelte";
  import { get } from "$library/endpoint";
  import { goto } from '$app/navigation';
	import Layout from "../+layout.svelte";

  var uname: string, unsubscribe = () => {};

  onMount(async function () {
    unsubscribe = userDataStore.subscribe(v => uname = v.uname);
    const rez = await get('userme', { 'fields' : ['uname'] }, $userDataStore.token);
    if (rez.error) {
      alert(`HOME ERROR: ${rez.data.detail}`);
      if (rez.data.status === 401) {
        goto('/login');
      }
    } else {
      userDataStore.update(u => ({...u, 'uname': rez.data.uname}));
    }
  });

  onDestroy(unsubscribe);
</script>

<h1 class="h1 text-center">
  {#if !uname}
    Sign In!
  {:else}
    Welcome {uname}!
  {/if}
</h1>
