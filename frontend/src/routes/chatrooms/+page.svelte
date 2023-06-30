<script lang='ts'>
  import { get } from '$library/endpoint';
	import { userDataStore } from '$library/stores';
  import { onDestroy, onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { salert, askbool, proompt } from '$library/alerts';
  import { joinChat, makeConvo } from '$lib/convo';
  import { base } from '$app/paths';
  
  var chatName: string = "", chatPwd: string = "";
  var chatrooms: string[] = [];
  var updateInterval: number; // setInterval type is number
  let chatroomList:HTMLElement;

  window.addEventListener('resize', () => {
        try {
          chatroomList.style.maxHeight = (window.innerHeight - 134).toString()+"px";
        } catch {
            // Real men don't solve their problems
        }
  });

  
  async function updateChats() {
    // @ts-ignore
    chatrooms = (await get('chats')).data.chatrooms;
    console.log(chatrooms);
  };

    
      
  onMount( async function() {
    chatroomList.style.maxHeight = (window.innerHeight - 134).toString()+"px";
    if (!$userDataStore.token) {
      goto(base + '/login');
    }
    updateChats();
    updateInterval = setInterval(updateChats, 5000);
  });

  async function join(room: string) {
    if (await joinChat(room)) {
      goto(base + '/chat');
    }
  }

  async function makeChatroom(chatName: string, chatPwd: string) {
    return await makeConvo(chatName, chatPwd, true)
  }

  async function promptRoom() {
    proompt("Name of the chatroom?", async (r: string) => {
      var create = true;
      chatName = r;
      if (chatName) {
        askbool('Do You Want a Password?', async (b: boolean) => {
          if (b) {
            proompt("Password Of The Chat Room?", async (p: string) => {
              chatPwd = p;
            })
          }
        });
      } else {
        var create = false;
        salert("You need a chat room name!")
      }
      if (create) {
        if (await makeChatroom(chatName, chatPwd)) {
          salert("All's well! Should show up soon!");
        }
        
    }
    });
  }

 
  onDestroy(() => {
    clearInterval(updateInterval);
  });

</script>
<div bind:this={chatroomList} class="m-4 overflow-auto">
  <button class='btn mb-10 text-center variant-filled' on:click={promptRoom}>Make Your Own!</button>
  <h1 class="h1 text-center mb-5">Chatrooms:</h1>  
  {#if chatrooms.length}
    {#each chatrooms as chatroom}
      <button class="btn bg-gradient-to-br variant-filled-secondary mt-3 w-25 text-sm lg:text-base h-8 lg:h-10" on:click={() => join(chatroom)}>Join {chatroom}</button>
      <br />
    {/each}
  {:else}
    <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
  {/if}
</div>
