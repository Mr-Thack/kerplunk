<script lang='ts'>
  import { get, post, patch } from '$library/endpoint';
	import { userDataStore } from '$library/stores';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { modalStore } from '@skeletonlabs/skeleton';
  import type { ModalSettings } from '@skeletonlabs/skeleton';
  import { salert, falert } from '$library/simpleAlert';

  var chatName: string;
  var chatPwd: string;

  const chatModalName: ModalSettings = {
    type: 'prompt',
    title: 'Chatroom Name:',
    value: '',
    valueAttr: {
      type: 'text',
      minlength: '1',
      required: true
    },
    response: (name: string) => chatName = name 
  }

  const chatModalPwd: ModalSettings = {
    type: 'prompt',
    title: 'Chatroom Password (Leave empty for no password):',
    value: '',
    valueAttr: {
      type: 'text',
      minlength: '4',
      required: false
    },
    response: (pwd: string) => { chatPwd = pwd; makeRoom(); }
  }

  async function updateChats() {
    chatrooms = (await get('chats')).data.chatrooms.split(' ').filter((name: string) => name.length != 0);
  };


  var chatrooms: string[] = [];
  var updateInterval: number; // setInterval type is number
  onMount( async function() {
    updateChats();
    updateInterval = setInterval(async function() {
      await updateChats();
    }, 5000);
  });

  async function join(room: string) {
    if (!$userDataStore.token) {
      console.log($userDataStore);
      falert('Login First!!', () => {
        goto('/login')  
      });
    } else {
      const r = await patch('chats', {}, {'name': room}, $userDataStore.token);
      if (r.error) {
        salert(`JOIN ERROR: ${r.data}`);
      } else {
        $userDataStore.cid = r.data.cid;
        goto('/chat');
      }
    }
  }

 

  async function promptRoom() {
    modalStore.trigger(chatModalName);
    modalStore.trigger(chatModalPwd);

  }

  async function makeRoom() {
    const data = {
      name: chatName,
      pwd: chatPwd,
      public: (chatPwd === ""),
      temp: false // [TODO] Rework API  
    }
    console.log(data);
    const r = await post('chats', data, $userDataStore.token);
    console.log(r)
    if (r.error) {
      salert(`ERROR MAKING: ${r.data}`);
    } else {
      salert('All\'s well! Should show up soon!')
    }
 }   
  
  onDestroy(() => {
    clearInterval(updateInterval);
  });

</script>

<button class='btn mb-10 text-center variant-filled' on:click={promptRoom}>Make Your Own!</button>
<h1 class="h1 text-center mb-5">Chatrooms:</h1>

{#if chatrooms.length}
  {#each chatrooms as chatroom}
    <button class="btn mt-3 w-25" on:click={() => join(chatroom)}>Join {chatroom}</button>
  {/each}
{:else}
  <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
{/if}

<!--
<div class='modal'>
    <input id='openRoom' type='checkbox' />
    <label for='openRoom' class='overlay' />
    <article>
        <header>
            <center><h3>Create Chatroom</h3></center>
            <label for='openRoom' class='close'>&times</label>
        </header>
        <section class='content'>
            <input type='text' bind:value={data.name} placeholder='Chatroom name'>
            <input type='password' bind:value={data.pwd} placeholder='Chatroom password'>
            <label>
                <input type='checkbox' bind:checked={data.public}>
                <center><span class='toggle button'>
                    {#if !data.public}
                        Make Public
                    {:else}
                        Make Private
                    {/if}
                </span></center>
            </label>
            <input type=checkbox bind:checked={data.temp}>
        </section>
        <footer>
        <label for='openRoom' style='float: right' class='button' on:click|preventDefault={makeRoom}>
            Create!
        </label>
</div>
-->