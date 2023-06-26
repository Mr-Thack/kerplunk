<script lang='ts'>
	import { userDataStore } from '$library/stores';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { salert, proompt } from '$library/alerts';
  import { joinConvo, makeConvo, getConvoInfo, type Class } from '$lib/convo';
  import getSettings from '$lib/settings';
  
  let classes: Array<Class> =  [];

  async function updateClasses() {
    // @ts-ignore
    const cids: Array<string> = (await getSettings(['convos'])).data.convos;
    classes = [];
    cids.forEach(async (cid: string) => {
      // @ts-ignore
      const cls: Class = await getConvoInfo(cid);
      console.log(cls);
      if (!cls.chatroom) {
        cls.cid = cid;
        classes.push(cls);
        classes = classes;  // Force rerender DOM
        console.log(classes);
      }
    })
  };


  var updateInterval: number; // setInterval type is number
  onMount( async function() {
    if (!$userDataStore.token) {
      goto('/login');
    }
    updateClasses();
  });

  async function join(room: string) {
    if (await joinConvo(room)) {
      goto('/class');
    } // No need to handle error, because it's handled in joinConvo()
  }

  async function makeClassroom(name: string, pwd: string) {
    if (await makeConvo(name, pwd, false)) {
      salert("All's well! Should show up soon!");
      setTimeout(updateClasses, 5000);
    }
  }

  async function promptRoom() {
    proompt("Name of the Class?", (name: string) => {
      if (name) {
        proompt("Password Of The Class?", async (pwd: string) => {
          if (pwd) {
            makeClassroom(name, pwd);
          } else {
            salert("You need a class password, for now.");
          }
        });
      } else {
        salert("You need a class name!")
      }
    });
  }

 
  onDestroy(() => {
    clearInterval(updateInterval);
  });

</script>
<div class="max-h-[calc(100vh-134px)] m-4 overflow-auto">
  <button class='btn mb-10 text-center variant-filled' on:click={promptRoom}>Make Your Own!</button>
  <h1 class="h1 text-center mb-5">Your Classes:</h1>

  <!-- Redo this to make it look more class like -->
  {#if classes.length}
    {#each classes as cls}
      <button class="btn bg-gradient-to-br variant-filled-secondary mt-3 w-25 text-sm lg:text-base h-8 lg:h-10" on:click={() => join(cls.name)}>Enter {cls.name}</button>
      <br />
    {/each}
  {:else}
    <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
  {/if}
</div>