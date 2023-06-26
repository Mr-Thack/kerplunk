<script lang="ts">
    import KTextArea from '$components/KTextArea.svelte';
    import KMessage from '$components/KMessage.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { Message, type User, type Users, sendMessage, 
        getMessages, subscribeEventStream, getConvoInfo} from '$lib/convo';
	import { browser } from '$app/environment';
    

    let chatbox: HTMLElement;

    var users: Users;

    let chatName: string;

    var header:HTMLElement; var inputbox:HTMLElement;

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

    function getTotalHeight(element: HTMLElement) {
        const height = element.offsetHeight;
        const style = getComputedStyle(element);
        const marginTop = parseInt(style.getPropertyValue('margin-top'));
        const marginBottom = parseInt(style.getPropertyValue('margin-bottom'));
        return height + marginTop + marginBottom;
    }

    function calculateHeight() {
        console.log(window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox))
        return window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox)
    }

    window.addEventListener('resize', () => {
        try {
            chatbox.style.maxHeight = calculateHeight().toString()+"px";
            chatbox.style.minHeight = calculateHeight().toString()+"px";
        } catch {
            // Real men don't solve their problems
        }
    });

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
        chatbox.style.maxHeight = calculateHeight().toString()+"px";
        chatbox.style.minHeight = calculateHeight().toString()+"px";
    })
    
</script>
<div class="flex flex-col overflow-hidden px-4 lg:pl-0">
    <div class="h-auto flex flex-row variant-filled-primary mt-4 p-1" bind:this={header}>
        <a class="btn-icon material-symbols-outlined w-8 h-8" href="/chatrooms">arrow_back_ios</a>
        <h3 class="h3 px-2 my-auto">{chatName? chatName: 'Loading...'}</h3>
        <button class="material-symbols-outlined ml-auto mr-3 w-8 h-8 my-auto">settings</button>
    </div>
    <section bind:this={chatbox}
        class="p-4 overflow-y-auto space-y-4"
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
    <div bind:this={inputbox}>
        <KTextArea onclick={sendMsg} sendOnEnter={true} />
    </div>
    
</div>