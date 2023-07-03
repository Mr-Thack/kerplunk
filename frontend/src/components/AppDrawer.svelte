<script lang="ts">
  import {Avatar, Drawer, drawerStore} from '@skeletonlabs/skeleton';
  import { goto } from '$app/navigation';
  import { logout } from '$lib/auth';
  import { userDataStore } from '$lib/stores';
  import KPost from '$components/KPost.svelte';
  import KTextArea from '$components/KTextArea.svelte';
	import { onMount } from 'svelte';
	import { getConvoInfo } from '$library/convo';
  import { base } from '$app/paths';
	import { salert } from '$library/alerts';
	import { get, post } from '$library/endpoint';

  let chatName: string;
  let width = window.screen.width;

  window.addEventListener('resize', () => {
    if (width != window.screen.width) {
      drawerStore.close()
      width = window.screen.width;
    }
    
  });

  function openSettings() {
    goto(base + "/settings")
    drawerStore.close();
  }

  async function setChat() {
    const data = await getConvoInfo($userDataStore.cid);
    chatName = data.name;
  }

  $: {
    if ($userDataStore.cid) {
      setChat()
    }
  }

  async function updateChat() {
    if ($drawerStore.meta.owner) {
      await post('convos/'+$drawerStore.meta.cid+'/info', {"name": chatName}, $userDataStore.token).then((upload) => {
        if (upload.status === 200) {
          $userDataStore.convo = chatName
              salert("Your changes were updated successfully.")
          } else {
              salert("There was an error updating your changes.")
          }
      });
    }

  }

  async function deleteChat() {
    if ($drawerStore.meta.owner) {
      drawerStore.close()
      await get('convos/'+$drawerStore.meta.cid+'/delete', $userDataStore.token).then((rez) => {
        goto(base + "/chatrooms")
      })
    }
  }

  onMount(async () => {
    const data = await getConvoInfo($userDataStore.cid);
    chatName = data.name;
  })
  
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

  const drawerBtnsAccount = [
    new DrawerBtn("Settings", "settings", openSettings),
    new DrawerBtn("Sign Out", "logout", logout)
  ];

  const drawerBtnsChat = [
    new DrawerBtn("Update", "sync", updateChat),
    new DrawerBtn("Delete Chat", "delete", deleteChat)
  ];
</script>

<Drawer class="align-center text-center mx-auto" on:backdrop={setChat}>
	{#if $drawerStore.id == 'drawerAccount'}
    <div class="justify-center">
      <div class="rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 py-4 mb-2 lg:mb-8">
        {#if $userDataStore.photo}
          <Avatar src={$userDataStore.photo} width="w-20 lg:w-40" rounded="rounded-full" class="mx-auto"/>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto w-20 lg:w-40" enable-background="new 0 0 20 20" viewBox="0 0 20 20" fill="#FFFFFF"><g><rect fill="none"/></g><g><g><path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        {/if}
      </div>
      <h2 class="h3 lg:h2 text-center lg:mb-4 max-w-md mx-auto font-medium h-10">{$userDataStore.name}</h2>
      <h3 class="h4 lg:h3 text-center mb-3 max-w-md mx-auto h-8">{$userDataStore.school}</h3>
      <div class="flex justify-center m-4 lg:m-12">
        {#each drawerBtnsAccount as btn}
          <button type="button" class="btn variant-filled-primary mx-auto text-sm lg:text-base h-8 lg:h-10" on:click={btn.func}>
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
            src={$drawerStore.meta.users[msg.author].photo}
            like={async () => await $drawerStore.meta.like(msg.mid)} 
            isReply={true} />
        </div>
      {/each}
    </div>
  {:else if $drawerStore.id == "drawerChat"}
  <p class="p mt-4">Chat Name</p>
  <input class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Chat Name" type='text' disabled={!($drawerStore.meta.owner)} placeholder='Chatroom Name' bind:value={chatName}/>
  <div class="flex justify-center m-4 lg:m-8">
    {#each drawerBtnsChat as btn}
      <button type="button" class="btn variant-filled-primary mx-auto text-sm lg:text-base h-8 lg:h-10" on:click={btn.func} disabled={!($drawerStore.meta.owner)}>
        <span class="material-symbols-outlined">{btn.icon}</span>
        <span>{btn.text}</span>
      </button>
    {/each}
  </div>
  <p class={$drawerStore.meta.owner? "p mt-4 hidden": 'p mt-4'}>You are not the owner of this chatroom.</p>
  {:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>
