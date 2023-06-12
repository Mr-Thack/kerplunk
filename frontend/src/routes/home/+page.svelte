<script lang='ts'>
  import { userDataStore } from "$library/stores";
  import { onMount, onDestroy } from "svelte";
  import { goto } from '$app/navigation';
  import getSettings from '$lib/settings';

  

  var uname: string, unsubscribe = () => {};

  onMount(async function () {
    unsubscribe = userDataStore.subscribe(v => uname = v.uname);
    const rez = await getSettings(['uname']);
    if (rez.error) {
      // if your editor is working correctly, you should see 3 errors below
      // that's because typescript doesn't know about data.detail, data.status,
      // and data.uname.
      // There are more important things to work on, so I'm leaving these harmless
      // warning alone for now.
      // @ts-ignore
      alert(`HOME ERROR: ${rez.data.detail}`);
      // @ts-ignore
      if (rez.data.status === 401) {
        goto('/login');
      }
    } else {
      // @ts-ignore
      userDataStore.write('uname', rez.data.uname);
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
