<script lang='ts'>
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { userDataStore } from '$library/stores';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Alerter from '$lib/alerter';
    import { joinChat, makeConvo, type Chatroom, getChatrooms } from '$lib/convo';
    import { base } from '$app/paths';


    const alerter = new Alerter(getModalStore());
    var chatName: string = "", chatPwd: string = "";
    var chatrooms: Array<Chatroom> = [];
    var updateInterval: number; // setInterval type is number
    let chatroomList:HTMLElement;

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
        chatrooms = await getChatrooms();
    });

    async function join(room: string) {
        if (await joinChat(alerter, room)) {
            goto(base + '/chat');
        }
    }

    async function makeChatroom(chatName: string, chatPwd: string = '') {
        return await makeConvo(alerter, chatName, chatPwd, true)
    }

    async function promptRoom() {
        alerter.proompt("Name of the chatroom?", async (r: string) => {
            chatName = r;
            if (chatName) {
                alerter.askbool('Do You Want a Password?', async (b: boolean) => {
                if (b) {
                    alerter.proompt("Password Of The Chat Room?", async (p: string) => {
                        chatPwd = p;
                        if (await makeChatroom(chatName, chatPwd)) {
                                alerter.salert("All's well! Should show up soon!");
                            }
                        })
                    } else if (await makeChatroom(chatName)) {
                        alerter.salert("All's well! Should show up soon!");
                    }
                });
            } else {
                alerter.salert("You need a chat room name!")
            }
        });
    }

    onDestroy(() => {
        clearInterval(updateInterval);
    });

</script>
<h1 class="h1 text-center my-4">Chatrooms:</h1>  
<div class="flex flex-row justify-center">
    <button class='btn mb-10 text-center variant-filled mx-2' on:click={promptRoom}>
        <span class="material-symbols-outlined">
            create
        </span>
        Create
    </button>
    <button class='btn mb-10 text-center variant-filled mx-2' on:click={() => {goto(base + '/chatlist')}}>
        <span class="material-symbols-outlined">
            add
        </span>
        Join
    </button>
</div>
<div bind:this={chatroomList} class="m-4 overflow-auto">
  {#if chatrooms.length}
    {#each chatrooms as chatroom}
        <button class="btn flex flex-col bg-gradient-to-br mt-2 mx-auto pr-6 w-full md:w-7/12 lg:w-5/12 text-sm lg:text-base rounded-lg"
                on:click={() => join(chatroom.name)}>
            <div class="p-4 variant-filled-primary w-full ml-2 rounded-t-lg">{chatroom.name}</div>
            <div class="flex flex-row justify-center p-4 variant-ghost-primary w-full rounded-b-lg">
                <p class="material-symbols-outlined">person</p>
                <p>{chatroom.users}</p>
            </div>
        </button>
        <br />
    {/each}
  {:else}
    <h2 class="h2 text-center">Join a chatroom or make one</h2>
  {/if}
</div>
