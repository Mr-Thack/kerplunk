<script lang='ts'>
    import { userDataStore } from '$library/stores';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Alerter from '$library/alerter';
    import { joinChat, type Chatroom, getChatrooms } from '$lib/convo';
    import { base } from '$app/paths';
    import { getModalStore } from '@skeletonlabs/skeleton';


    const alerter = new Alerter(getModalStore());

    var chatrooms: Array<Chatroom> = [];
    var updateInterval: NodeJS.Timeout;
    let chatroomList: HTMLElement;
  
    window.addEventListener('resize', () => {
        if(window.innerWidth < 1024) {
            try {
                chatroomList.style.maxHeight = (window.innerHeight - 304).toString()+"px";
            } catch (e) {
                console.log(e);
                // Real men don't solve their problems
            }
        } else {
            chatroomList.style.maxHeight = (window.innerHeight - 218).toString()+"px";
        }
    });

    async function updateChats() {
        chatrooms = await getChatrooms();
    }

    onMount(async function() {
        if(window.innerWidth < 1024) {
            try {
                chatroomList.style.maxHeight = (window.innerHeight - 304).toString()+"px";
            } catch (e) {
                console.log(e);
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
            alerter.proompt('Enter Password', async (pwd: string) => {
                if (await joinChat(alerter, room, pwd)) {
                    goto(base + '/chat');
                }
            });
        } else if (await joinChat(alerter, room)) {
            goto(base + '/chat');
        }
    }
  
    onDestroy(() => {
        clearInterval(updateInterval);
    });
</script>
<h1 class="h1 text-center my-4">Add a chat:</h1>  
<div class="flex flex-row justify-center">
    <button class='btn mb-10 text-center variant-filled mx-2' on:click={() => {goto(base + '/chatrooms')}}> 
        <span class="material-symbols-outlined">
              arrow_back_ios
        </span>
        Back
    </button>
</div>
<div bind:this={chatroomList} class="m-4 overflow-auto">
    {#if chatrooms.length}
        {#each chatrooms as chatroom}
            <button class="btn flex flex-col bg-gradient-to-br mt-2 mx-auto pr-6 w-full md:w-7/12 lg:w-5/12 text-sm lg:text-base rounded-lg"
                    on:click={() => join(chatroom.name, chatroom.isPwd)}>
                <div class="p-4 flex flex-row justify-center variant-filled-primary w-full ml-2 rounded-t-lg">
                    <p>{chatroom.name}</p>
                    {#if chatroom.isPwd}
                        <p class="material-symbols-outlined mx-2">lock</p>
                    {/if}
                </div>
                <div class="flex flex-row justify-center p-4 variant-ghost-primary w-full rounded-b-lg">
                    <p class="material-symbols-outlined">person</p>
                    <p>{chatroom.users}</p>
                </div>
            </button>
            <br />
        {/each}
    {:else}
        <h2 class="h2 text-center">No chatrooms were found</h2>
    {/if}
</div>
