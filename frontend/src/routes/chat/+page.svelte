<script lang="ts">
    import { Avatar } from '@skeletonlabs/skeleton';
    import { get, post, endpoint } from '$library/endpoint';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
	import getSettings from '$library/settings';
	

    let chatbox: HTMLElement, chatInput: HTMLElement;
    var inputText = '';

    var users;

    async function get_user_info() {
        users = await get("users");
    }

    get_user_info();
    
    // Why isn't it already possible to get the user's name without pinging the server again?
    // also $userDataStore.photo doesn't work
    async function getInfo() {
        var rez = await getSettings(["name", "photo"]);
        if (rez && !rez.error) {
            return rez
        }
    }

    var info = getInfo();

    let chatName: string;

    function scrollChatBottom(): void {
        chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
    }
		  

    class Message {
        text: string;
        author: string;
        replyTo: number;
        time: string;
    
        public constructor(data: {text: string, author: string, replyTo: number, time: string}) {
            this.text = data.text;
            this.author = data.author;
            this.replyTo = data.replyTo;
            this.time = data.time;
        }

        public humanTime(): string {
            let d = new Date(this.time);
            // [TODO]: Check if the user uses 12 hour or 24 hour time
            let h = d.getHours();
            let m = d.getMinutes();
            if (true) {  // User uses 12 hour time
                return (h > 12? h - 12:h) + ':' + (m < 10? '0' + m: m) + ' ' + (h>12?'P.M.':'A.M.');
            } else {
                return h + ':' + m;
            }
        }
    }

    var messages: Message[] = [];
    
    async function sendMessage() {
        await post(`convos/${$userDataStore.cid}`, {
            'text': inputText
            //, 'reply_to': 
        })
        inputText = '';
    }

    onMount(async () => {
        if (!$userDataStore.token) {
            falert('Sign in to a chatroom first!', () => {
                goto('/chatrooms')
            });
        } else {
            // @ts-ignore
            chatName = (await get(`convos/${$userDataStore.cid}/info`, {}, $userDataStore.token)).data.name
        
            // Get all the messages
            // @ts-ignore
            messages = (await get(`convos/${$userDataStore.cid}`, {
                'start': 0
                // @ts-ignore
                }, $userDataStore.token)).data.map((data) => {
                    return new Message(data)
                });

            // Now scroll to the bottom
            setTimeout(scrollChatBottom, 75);

            // Setup the Event Stream
            var es = new EventSource(`http://${endpoint('stream_convos')}/${$userDataStore.cid}?token=${$userDataStore.token}&start=${messages.length}`)
            es.onmessage = function (event) {
                messages = [...messages, new Message(JSON.parse(event.data))]
                setTimeout(scrollChatBottom, 75)
            }
            
            chatInput.addEventListener('keypress', function(event) {
                if (event.key == "Enter") {
                    event.preventDefault();
                    sendMessage()
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
    {#await info}
        <p class="p">Please Wait...</p>
    {:then variable}
        {#each messages as msg}
            {#if msg.author === "SYSTEM"}
                <div class="grid gap-4 text-center w-full">
                    <!-- We can add avatars later.... -->
                    <div class="rounded-tl-none border-0 space-y-2 w-full mb-8">
                        <p>{msg.text+" - "+msg.humanTime()}</p>
                    </div>
                </div>
            {:else if msg.author === variable.data.name}
                <div class="grid grid-cols-[1fr_auto_auto] justify-items-end gap-2 text-right">
                    <div class="card p-4 rounded-tr-none space-y-2 variant-filled-primary">
                        <header class="flex justify-between items-center">
                            <p class="font-bold mr-4">{msg.author}</p>
                            <p>{msg.humanTime()}</p>
                        </header>
                        <p>{msg.text}</p>
                    </div>
                    {#if variable.data.photo}
                        <Avatar src={variable.data.photo} width="w-12 m-2" />
                    {:else}
                        <svg id="no-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="64px" viewBox="0 0 20 20" width="64px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                    {/if}
                    </div>
                {:else}
                    <div class="grid grid-cols-[auto_auto_1fr] gap-2 text-left">
                        {#await users}
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="64px" viewBox="0 0 20 20" width="64px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                        {:then userInfo} 
                            {#if userInfo.data[msg.author].photo === ""}
                                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="64px" viewBox="0 0 20 20" width="64px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                            {:else}
                                <Avatar src={userInfo.data[msg.author].photo} width="w-12 m-2" />
                            {/if}
                        {/await}
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
    {/await}

</section>

    <div class="input-group input-group-divider flex flex-shrink-0 h-full rounded-container-token mb-4">
        <textarea
            bind:this={chatInput}
            bind:value={inputText}
            class="bg-transparent border-0 ring-0 flex-grow h-fit overflow-hidden resize-none"
            name="prompt"
            placeholder="Message Here..."
            rows="1" />
        <button class="variant-filled-primary material-symbols-outlined h-100" on:click={sendMessage}>send</button>
    </div>
</div>