<script lang="ts">
    import KTextArea from '$components/KTextArea.svelte';
    import KMessage from '$components/KMessage.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { base } from '$app/paths';
    import { Message, type Users, sendMessage, getMessages, getConvoInfo} from '$lib/convo';
    import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';
    
    /* import { invoke } from '@tauri-apps/api/tauri'
    invoke('plugin:AndroidNotifications|createNotificationChannel', {channel_id:"base", channel_name:"Notifications"})
    invoke('plugin:AndroidNotifications|createNotificationChannel', {channel_id:"messages", channel_name:"Chat Messages", channel_desc:"Messages sent in chats you are in."})

    function sendNotification(title:string, content:string) {
        invoke('plugin:AndroidNotifications|simpleNotification', {id:1, title:title, content:content, channel_id:"base"}).then((value) => {
            console.log(value);
        })
    }*/

    /*
    var chatMessages: Array<any> = [];

    function sendChatNotification(text: string, time: number, sender: string, b64: string) {
        chatMessages.push({text:text, time:time, sender:sender, avatarBase64:b64})
        console.log(chatMessages)
        
        invoke('plugin:AndroidNotifications|chatNotification', {id:2, messages:chatMessages, channel_id:"messages"}).then((value) => {
            console.log(value);
        })
    }
    */
    // sendNotification("Android Notifications Initialized!", "Good Luck")
    
    let chatbox: HTMLElement;
    var users: Users;
    var owner: string;
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
        return window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox) - 1
    }

    function scale() {
        chatbox.style.maxHeight = calculateHeight().toString()+"px";
        chatbox.style.height = calculateHeight().toString()+"px";
    }


    let mustRerender = false;
    // I need to set a 50ms timeout for this anyway,
    // so for optimization, I'm putting them in the same loop

    function intervalHandler() {
        if (mustRerender) {
            scrollChatBottom();
            mustRerender = false;
        }
        fetchNewMessages();
        // I don't know what this is for, but I kept it here in case you need it Johnathan
        // sendChatNotification(m.text, m.unixTime(), m.author, users[m.author].photo.split(",")[1]);
     }
            
    function fetchNewMessages() {
        if (window.mqueue) {
            let message = window.mqueue.shift();
            if (message) {
                messages = [...messages, message];
                fetchNewMessages();
                mustRerender = true;
            }
        }
    }

    onDestroy(() => {
       $userDataStore.cid = ""; 
    });

    onMount(async () => {
        scale();
        if (!$userDataStore.token) {
            falert('Open a chatroom first!', () => {
                goto(base + '/chatrooms')
            });
        }

        const data = await getConvoInfo($userDataStore.cid);
        users = data.users;
        $userDataStore.convo = data.name;
        owner = data.owner;
        
        // Get all the messages
        // @ts-ignore
        messages = await getMessages($userDataStore.cid);
        // Now scroll to the bottom
        setTimeout(scrollChatBottom, 150);


        setInterval(intervalHandler, 50);
        // Setup the Event Stream
        /*
        subscribeEventStream($userDataStore.cid, async (m: Message) => {
            if (!Object.keys(users).includes(m.author)) {
                users = (await getConvoInfo($userDataStore.cid)).users;
            }
            messages = [...messages, m];
            sendChatNotification(m.text, m.unixTime(), m.author, users[m.author].photo.split(",")[1]);
            setTimeout(scrollChatBottom, 75)
        }, messages.length);
        */
        /*
        subscribeNotificationStream(async (cid: string, m: Message) => {
            console.log(m);
            console.log(cid);
        });*/

        window.addEventListener('resize', () => {
            try {
                scale();
            } catch {
                // Real men don't solve their problems
            }
        });
    })

    async function openDrawer() {
        var drawerChat : DrawerSettings;
    
        if (window.innerWidth <= 639) {
            drawerChat = {
                id: 'drawerChat',
                width: 'w-screen',
                height: 'h-[220px]',
                padding: 'p-4',
                rounded: 'rounded-xl',
                position: 'top',
                meta: { owner: $userDataStore.name === owner, cid: $userDataStore.cid }
            };
        } else if (window.innerWidth <= 1024) {
            drawerChat = {
                id: 'drawerChat',
                width: 'w-[340px]',
                height: 'h-full',
                padding: 'p-4',
                rounded: 'rounded-xl',
                position: 'right',
                meta: { owner: $userDataStore.name === owner, cid: $userDataStore.cid }
            };
        } else {
            drawerChat = {
                id: 'drawerChat',
                width: 'w-[280px] md:w-[480px]',
                padding: 'p-4',
                rounded: 'rounded-xl',
                position: 'right',
                meta: { owner: $userDataStore.name === owner, cid: $userDataStore.cid }
            }
        }
        drawerStore.open(drawerChat);
    }
    
</script>
<div class="flex flex-col overflow-hidden px-4 lg:pl-0">
    <div class="h-auto flex flex-row variant-filled-primary mt-4 p-1" bind:this={header}>
        <a class="btn-icon material-symbols-outlined w-8 h-8" href="{base}/chatrooms">arrow_back_ios</a>
        <h3 class="h3 px-2 my-auto">{$userDataStore.convo? $userDataStore.convo: 'Loading...'}</h3>
        <button class="material-symbols-outlined ml-auto mr-3 w-8 h-8 my-auto" on:click={openDrawer}>settings</button>
    </div>
    <section bind:this={chatbox}
        class="p-1 overflow-y-auto space-y-4"
        class:placeholder='{!messages.length}'
        class:animate-pulse='{!messages.length}'>
        {#if !$userDataStore.name || !users || !messages.length}
            <p class="p w-full">Please Wait...</p>
        {:else}
            {#each messages as msg}
                {#if msg.author === "SYSTEM"}
                    <div class="grid gap-4 text-center w-full">
                        <!-- We can add avatars later.... -->
                        <div class="border-0 space-y-2 w-full mb-4 variant-filled-surface p-2 w-9/12 mx-auto rounded-xl">
                            <p class="text-xs lg:text-base">{msg.text+" - "+msg.humanTime()}</p>
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
        <KTextArea onclick={sendMsg} ontype={scale} sendOnEnter={true} />
    </div>
    
</div>