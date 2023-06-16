<script lang="ts">
    import { endpoint } from '$library/endpoint';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/simpleAlert';
	

    let chatbox: HTMLElement, chatInput: HTMLElement;
    var inputText = '';

    function scrollChatBottom(): void {
        chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
    }
		  

    class Message {
        text: string;
        from: string;
    
        public constructor(text: string, from: string) {
            this.text = text;
            this.from = from;
        }
    }

    var messages: Message[] = [];
    
    let socket: WebSocket, 
        sendMessage: () => void;


    onMount(() => {
        if (!$userDataStore.token) {
            falert('Sign in to a chatroom first!', () => {
                goto('/chatrooms')
            });
        } else {
            socket = new WebSocket(`ws://${endpoint('chats')}/${$userDataStore.cid}?token=${$userDataStore.token}`);
            socket.onmessage = function(event) {
                if (!messages.length) {
                    const given_log = event.data.split('\x1e');
                    for (const i in given_log) {
                        messages.push(new Message(given_log[i], ''));
                    }
                    messages = messages;
                } else {
                    messages = [...messages, new Message(event.data, '')]
                }
                setTimeout(scrollChatBottom, 75);
            }
            sendMessage = () => {
                socket.send(inputText);
                inputText = '';
            };
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
                    <p class="font-bold">{msg.from}</p>
                    <!-- add timestamp here -->
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