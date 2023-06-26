<script lang="ts">
  import {Avatar, Drawer, drawerStore} from '@skeletonlabs/skeleton';
  import { goto } from '$app/navigation';
  import { logout } from '$lib/auth';
  import { userDataStore } from '$lib/stores';
  import KPost from '$components/KPost.svelte';
  import KTextArea from '$components/KTextArea.svelte';

  function openSettings() {
    goto("/settings")
    drawerStore.close();
  }
  
  class DrawerBtn {
    text: string;
    icon: string;
    func: () => void;

    constructor(t: string, i: string, f: () => void) {
      this.text = t;
      this.icon = i;
      this.func = f;
    }
  }

  const drawerBtns = [
    new DrawerBtn("Settings", "settings", openSettings),
    new DrawerBtn("Sign Out", "logout", logout)
  ];
</script>

<Drawer class="align-center text-center mx-auto">
	{#if $drawerStore.id == 'drawerAccount'}
    <div class="justify-center">
      <div class="rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 py-4 mb-8">
        {#if $userDataStore.photo}
          <Avatar src={$userDataStore.photo} width="w-20 lg:w-40" rounded="rounded-full" class="mx-auto"/>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-20 lg:w-40" enable-background="new 0 0 20 20" viewBox="0 0 20 20" fill="#FFFFFF"><g><rect fill="none"/></g><g><g><path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        {/if}
      </div>
      <h2 class="h3 lg:h2 text-center mb-4 max-w-md mx-auto font-medium h-10">{$userDataStore.name}</h2>
      <h3 class="h4 lg:h3 text-center mb-3 max-w-md mx-auto h-8">{$userDataStore.school}</h3>
      <div class="flex justify-center m-6 lg:m-12">
        {#each drawerBtns as btn}
          <button type="button" class="btn variant-filled-primary mx-auto" on:click={btn.func}>
            <span class="material-symbols-outlined">{btn.icon}</span>
            <span>{btn.text}</span>
          </button>
        {/each}
      </div>
    </div>
  {:else if $drawerStore.id == "drawerReplies"}
    <KTextArea sendOnEnter={false} onclick={async (text) => {await $drawerStore.meta.reply(text, $drawerStore.meta.mid)}} />
    
    <div class="flex flex-col-reverse overflow-auto-y">
    
      {#each $drawerStore.meta.msgs as msg}
        <div class="my-4">
          <KPost 
            msg={msg} 
            src={(msg.author == $userDataStore.name)? $userDataStore.photo: $drawerStore.meta.users[msg.author].photo}
            like={() => {}} 
            isReply={true} />
        </div>
      {/each}
    </div>
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>
