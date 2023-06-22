<script lang="ts">
    import { get, post, endpoint } from '$library/endpoint';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
	

    let chatbox: HTMLElement, chatInput: HTMLElement;
    var inputText = '';

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
                return (h > 12? h - 12:h) + ':' + m + ' ' + (h>12?'P.M.':'A.M.');
            } else {
                return h + ':' + m;
            }
        }
    }

    var messages: Message[] = [];
    
    async function sendMessage() {
        await post(`chats/${$userDataStore.cid}`, {
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
            messages = (await get(`chats/${$userDataStore.cid}`, {
                'start': 0
                // @ts-ignore
                }, $userDataStore.token)).data.map((data) => {
                    return new Message(data)
                });
            setTimeout(scrollChatBottom, 75);
            
            var es = new EventSource(`http://${endpoint('streamchats')}/${$userDataStore.cid}?token=${$userDataStore.token}&start=${messages.length}`)
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
    });
</script>

<div class="grid grid-rows-2 min-h-screen max-h-screen p-4 overflow-hidden">
<section bind:this={chatbox}
    class="w-full row-span-full p-4 overflow-y-auto space-y-4"
    class:placeholder='{!messages.length}'
    class:animate-pulse='{!messages.length}'
    >
    {#each messages as msg}
        <div class="grid grid-cols-[auto_1fr] gap-2">
            <!-- We can add avatars later.... -->
            <div class="card p-4 variant-soft rounded-tl-none space-y-2">
                <header class="flex justify-between items-center">
                    <p class="font-bold mr-4">{msg.author}</p>
                    <p>{msg.humanTime()}</p>
                </header>
                <p>{msg.text}</p>
            </div>
        </div>
    {/each}
</section>

<div class="input-group input-group-divider flex rounded-container-token mt-4">
    <textarea
        bind:this={chatInput}
        bind:value={inputText}
        class="bg-transparent border-0 ring-0 flex-grow"
        name="prompt"
        placeholder="Message Here..."
        rows="1"
    />
    <button class="variant-filled-primary material-symbols-outlined" on:click={sendMessage}>send</button>
</div>
<!--
<div style='margin-top: 1%; margin-left: 15%'>
    <input type='text' id='chat_input' bind:value={input_text} style='width: 75%; margin-right: 1%;'>
    <button on:click={sendMessage}>Send!</button>
</div>
-->
</div>