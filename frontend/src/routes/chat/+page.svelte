<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { Message, type User, sendMessage, getChatInfo, getMessages, subscribeEventStream} from '$lib/convo';

    let chatbox: HTMLElement, chatInput: HTMLElement;
    var inputText = '';


    type Users = { [name: string]: User; }
    var users: Users;


    let chatName: string;

    function scrollChatBottom() {
        if (chatbox) {
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
        } else {
            console.log(chatbox);
        }
     }
    
    var messages: Array<Message> = [];
    
    async function sendMsg() {
        await sendMessage($userDataStore.cid, $userDataStore.token, inputText);
        inputText = '';
    }

    onMount(async () => {
        if (!$userDataStore.token) {
            falert('Sign in to a chatroom first!', () => {
                goto('/chatrooms')
            });
        } else {
            const chatInfo = await getChatInfo($userDataStore.cid, $userDataStore.token);

            // @ts-ignore            
            chatName = chatInfo.name;
            // @ts-ignore
            users = {}
            // @ts-ignore
            chatInfo.users.forEach((u: User) => {users[u.name] = u});
            users = users; // To force DOM rerender
            // Get all the messages
            // @ts-ignore
            messages = await getMessages($userDataStore.cid, $userDataStore.token);
            // Now scroll to the bottom
            setTimeout(scrollChatBottom, 150);

            // Setup the Event Stream
            subscribeEventStream($userDataStore.cid, $userDataStore.token, (m: Message) => {
                messages = [...messages, m];
                setTimeout(scrollChatBottom, 75)
            }, messages.length);
            
            chatInput.addEventListener('keypress', function(event) {
                if (event.key == "Enter") {
                    event.preventDefault();
                    sendMsg()
                }
            });
        }

        var textarea = document.querySelector('textarea');
        if (textarea) {
            // Add an event listener for the input event
            textarea.addEventListener('input', function() {
        
                // Reset the textarea's height
                this.style.height = 'auto';

                // Set the textarea's height to match its scrollHeight
                this.style.height = this.scrollHeight + 'px';
            });
        } else {
            console.warn("SOMETHING WENT WRONG WITH THE TEXTAREA!")
        }
    })
    
</script>
<div class="flex flex-col min-h-screen max-h-screen overflow-hidden pr-4">
    <div class="h-auto variant-filled-primary mt-4">
        <h3 class="h3 p-2">{chatName? chatName: 'Loading...'}</h3>
    </div>
    <section bind:this={chatbox}
        class="flex-grow p-4 overflow-y-auto space-y-4"
        class:placeholder='{!messages.length}'
        class:animate-pulse='{!messages.length}'>
        {#if !$userDataStore.name || !users}
            <p class="p">Please Wait...</p>
        {:else}
            {#each messages as msg}
                {#if msg.author === "SYSTEM"}
                    <div class="grid gap-4 text-center w-full">
                        <!-- We can add avatars later.... -->
                        <div class="rounded-tl-none border-0 space-y-2 w-full mb-8">
                            <p>{msg.text+" - "+msg.humanTime()}</p>
                        </div>
                    </div>
                {:else if msg.author === $userDataStore.name}
                    <div class="grid grid-cols-[1fr_auto_auto] justify-items-end gap-2 text-right">
                        <div class="card p-4 rounded-tr-none space-y-2 variant-filled-primary">
                            <header class="flex justify-between items-center">
                                <p class="font-bold mr-4">{msg.author}</p>
                                <p>{msg.humanTime()}</p>
                            </header>
                            <p>{msg.text}</p>
                        </div>
                        {#if $userDataStore.photo}
                            <Avatar src={$userDataStore.photo} width="w-12 m-2" />
                        {:else}
                            <svg id="no-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="64px" viewBox="0 0 20 20" width="64px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                        {/if}
                    </div>
                {:else}
                    <div class="grid grid-cols-[auto_auto_1fr] gap-2 text-left">
                        {#if users[msg.author].photo === ""}
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="64px" viewBox="0 0 20 20" width="64px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                        {:else}
                            <Avatar src={users[msg.author].photo} width="w-12 m-2" />
                        {/if}
                        <div class="card p-4 rounded-tl-none space-y-2 variant-soft">
                            <header class="flex justify-between items-center">
                                <p class="font-bold mr-4">{msg.author}</p>
                                <p>{msg.humanTime()}</p>
                            </header>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                {/if}
            {/each}
        {/if}
    </section>
    <div class="input-group input-group-divider flex flex-shrink-0 h-full rounded-container-token mb-4">
        <textarea
            bind:this={chatInput}
            bind:value={inputText}
            class="bg-transparent border-0 ring-0 flex-grow h-fit overflow-hidden resize-none"
            name="prompt"
            placeholder="Message Here..."
            rows="1" />
        <button class="variant-filled-primary material-symbols-outlined h-100" on:click={sendMsg}>send</button>
    </div>
</div>