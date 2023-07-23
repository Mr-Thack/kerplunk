<script lang='ts'>
  import { userDataStore } from "$library/stores";
  import { onMount, onDestroy } from "svelte";
  import { goto } from '$app/navigation';
  import getSettings from '$lib/settings';
  import { base } from '$app/paths';

  var accent = 'red';

  var name: string, unsubscribe = () => {};

  onMount(async function () {
    unsubscribe = userDataStore.subscribe(v => name = v.name);
    const rez = await getSettings(['name', 'accent']);
    if (rez.error) {
      // @ts-ignore
      alert(`HOME ERROR: ${rez.data.detail}`);
      if (rez.status === 401) {
        goto(base + '/login');
      }
    } else {
      // @ts-ignore
      accent = rez.data.accent
      userDataStore.write('name', rez.data.name);
    }
  });

  onDestroy(unsubscribe);
</script>

<img src={base + "/icon_"+accent+"_cropped.png"} alt="Kerplunk Logo" class="w-32 lg:w-64 mx-auto mt-4 mb-8" />
<h1 class="h3 lg:h1 text-center">
  {#if !name}
    Sign In!
  {:else}
    Welcome, {name}! 
  {/if}
</h1>
