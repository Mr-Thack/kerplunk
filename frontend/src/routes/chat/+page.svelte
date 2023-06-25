<script lang="ts">
    import KTextArea from '$components/KTextArea.svelte';
    import KMessage from '$components/KMessage.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { Message, type User, type Users, sendMessage, 
        getMessages, subscribeEventStream, getConvoInfo} from '$lib/convo';
    

    let chatbox: HTMLElement;


    var users: Users;


    let chatName: string;

    function scrollChatBottom() {
        if (chatbox) {
            chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' });
        } else {
            // There's some weird bug happening every 1 in 5 times where it prints an error to the console
            console.log(chatbox);
        }
     }
    
    var messages: Array<Message> = [];
    
    async function sendMsg(input: string) {
        await sendMessage($userDataStore.cid, input);
    }

    onMount(async () => {
        if (!$userDataStore.token) {
            falert('Sign in to a chatroom first!', () => {
                goto('/chatrooms')
            });
        }

        const data = await getConvoInfo($userDataStore.cid);
        users = data.users;
        chatName = data.name;
        
        // Get all the messages
        // @ts-ignore
        messages = await getMessages($userDataStore.cid);
        // Now scroll to the bottom
        setTimeout(scrollChatBottom, 150);

        // Setup the Event Stream
        subscribeEventStream($userDataStore.cid, async (m: Message) => {
            if (!Object.keys(users).includes(m.author)) {
                users = (await getConvoInfo($userDataStore.cid)).users;
            }
            messages = [...messages, m];
            setTimeout(scrollChatBottom, 75)
        }, messages.length);
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
        {#if !$userDataStore.name || !users || !messages.length}
            <p class="p">Please Wait...</p>
        {:else}
            {#each messages as msg}
                {#if msg.author === "SYSTEM"}
                    <div class="grid gap-4 text-center w-full">
                        <!-- We can add avatars later.... -->
                        <div class="border-0 space-y-2 w-full mb-4 variant-filled-surface p-2 w-9/12 mx-auto rounded-xl">
                            <p>{msg.text+" - "+msg.humanTime()}</p>
                        </div>
                    </div>
                {:else if msg.author === $userDataStore.name}
                    <KMessage isThisUser={true} src={$userDataStore.photo} msg={msg} />
                {:else}
                    <KMessage isThisUser={false} src={users[msg.author].photo} msg={msg} />
                {/if}
            {/each}
        {/if}
    </section>
    <KTextArea onclick={sendMsg} sendOnEnter={true} />
</div>