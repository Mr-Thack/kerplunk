<script lang='ts'>
  import { userDataStore } from "$library/stores";
  import { onMount, onDestroy } from "svelte";
  import { goto } from '$app/navigation';
  import getSettings from '$lib/settings';

  

  var name: string, unsubscribe = () => {};

  onMount(async function () {
    unsubscribe = userDataStore.subscribe(v => name = v.name);
    const rez = await getSettings(['name']);
    if (rez.error) {
      // @ts-ignore
      alert(`HOME ERROR: ${rez.data.detail}`);
      if (rez.status === 401) {
        goto('/login');
      }
    } else {
      // @ts-ignore
      userDataStore.write('name', rez.data.name);
    }
  });

  onDestroy(unsubscribe);
</script>

<h1 class="h1 text-center">
  {#if !name}
    Sign In!
  {:else}
    Welcome, {name}!
  {/if}
</h1>
