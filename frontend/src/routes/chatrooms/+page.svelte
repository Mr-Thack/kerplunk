<script lang='ts'>
  import { get, post, patch } from '$library/endpoint';
	import { userDataStore } from '$library/stores';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { salert, falert, askbool, proompt } from '$library/alerts';

  var chatName: string = "", chatPwd: string = "";

  async function updateChats() {
    // @ts-ignore
    chatrooms = (await get('chats')).data.chatrooms;
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
      falert('Login First!!', () => {
        goto('/login')  
      });
    } else {
      const r = await patch('chats', {}, {'name': room}, userDataStore.readonce('token'));
      console.log(r)
      if (r.error) {
        salert(`JOIN ERROR: ${r.data}`);
      } else {
        // @ts-ignore
        userDataStore.write('cid', r.data.cid);
        goto('/chat');
      }
    }
  }

 

  async function promptRoom() {
    proompt("Name of the chatroom?", (r: string) => {
      chatName = r;
      if (chatName) {
        askbool('Do You Want a Password?', (b: boolean) => {
          if (b) {
            proompt("Password Of The Chat Room?", (p: string) => {
              chatPwd = p;
              makeRoom();
            });
          } else {
            makeRoom();
          }
        });
      } else {
        salert("You need a chat room name!")
      }
    });
  }

  async function makeRoom() {
    const data = {
      name: chatName,
      pwd: chatPwd,
      public: (chatPwd === ""),
      temp: false // [TODO] Rework API  
    }
    const r = await post('chats', data, $userDataStore.token);
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
    <button class="btn bg-gradient-to-br variant-filled-secondary mt-3 w-25" on:click={() => join(chatroom)}>Join {chatroom}</button>
    <br />
  {/each}
{:else}
  <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
{/if}