<script lang='ts'>
    import { get } from '$library/endpoint';
      import { userDataStore } from '$library/stores';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { salert, askbool, proompt } from '$library/alerts';
    import { joinChat, makeConvo } from '$lib/convo';
    import { base } from '$app/paths';
    
    var chatName: string = "", chatPwd: string = "";
    var chatrooms: Array<[string, boolean]> = [];
    var updateInterval: NodeJS.Timer; // setInterval type is number
    let chatroomList:HTMLElement;
  
    window.addEventListener('resize', () => {
      if(window.innerWidth < 1024) {
        try {
          chatroomList.style.maxHeight = (window.innerHeight - 304).toString()+"px";
        } catch {
          // Real men don't solve their problems
        }
      } else {
        chatroomList.style.maxHeight = (window.innerHeight - 218).toString()+"px";
      }
    });
  
    async function updateChats() {
      // @ts-ignore
      chatrooms = (await get('chats')).data.chatrooms;
      console.log(chatrooms);
    };
  
      
        
    onMount( async function() {
      if(window.innerWidth < 1024) {
        try {
          chatroomList.style.maxHeight = (window.innerHeight - 304).toString()+"px";
        } catch {
          // Real men don't solve their problems
        }
      } else {
        chatroomList.style.maxHeight = (window.innerHeight - 218).toString()+"px";
      }
      if (!$userDataStore.token) {
        goto(base + '/login');
      }
      updateChats();
      updateInterval = setInterval(updateChats, 5000);
    });
  
    async function join(room: string, isPwd: boolean) {
      if (isPwd) {
        proompt('Enter Password', async (pwd: string) => {
          if (await joinChat(room, pwd)) {
            goto(base + '/chat');
          }
        })
      } else if (await joinChat(room)) {
        goto(base + '/chat');
      }
    }
  
    async function makeChatroom(chatName: string, chatPwd: string = '') {
      return await makeConvo(chatName, chatPwd, true)
    }
  
    async function promptRoom() {
      proompt("Name of the chatroom?", async (r: string) => {
        chatName = r;
        if (chatName) {
          askbool('Do You Want a Password?', async (b: boolean) => {
            if (b) {
              proompt("Password Of The Chat Room?", async (p: string) => {
                chatPwd = p;
                if (await makeChatroom(chatName, chatPwd)) {
                  salert("All's well! Should show up soon!");
                }
              })
            } else if (await makeChatroom(chatName)) {
              salert("All's well! Should show up soon!");
            }
          });
        } else {
          salert("You need a chat room name!")
        }
      });
    }
  
   
    onDestroy(() => {
      clearInterval(updateInterval);
    });
  
  </script>
  <h1 class="h1 text-center my-4">Add a chat:</h1>  
  <div class="flex flex-row justify-center">
    <button class='btn mb-10 text-center variant-filled mx-2' on:click={promptRoom}><span class="material-symbols-outlined">create</span>Create</button>
  </div>
  <div bind:this={chatroomList} class="m-4 overflow-auto">
    {#if chatrooms.length}
      {#each chatrooms as chatroom}
        <div class="btn flex flex-col bg-gradient-to-br mt-2 mx-auto pr-6 w-full md:w-7/12 lg:w-5/12 text-sm lg:text-base rounded-lg" on:click={() => join(chatroom[0], chatroom[1])}>
          <div class="p-4 variant-filled-primary w-full ml-2 rounded-t-lg">{chatroom[0]}</div>
          <div class="flex flex-row justify-center p-4 variant-ghost-primary w-full rounded-b-lg"><p class="material-symbols-outlined">person</p><p>{chatroom[2]}</p></div>
        </div>
        <br />
      {/each}
    {:else}
      <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
    {/if}
  </div>
  