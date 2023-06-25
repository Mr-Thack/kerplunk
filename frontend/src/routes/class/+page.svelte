<script lang="ts">
    import KTextArea from '$components/KTextArea.svelte';
    import KAvatar from '$components/KAvatar.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { Message, type User, sendMessage, getConvoInfo, getMessages} from '$lib/convo';

    let feed: HTMLElement;


    type Users = { [name: string]: User; }
    var users: Users;


    let className: string;

    var messages: Array<Message> = [];

    var header:HTMLElement; var inputbox:HTMLElement;

    function getTotalHeight(element: HTMLElement) {
        const height = element.offsetHeight;
        const style = getComputedStyle(element);
        const marginTop = parseInt(style.getPropertyValue('margin-top'));
        const marginBottom = parseInt(style.getPropertyValue('margin-bottom'));
        return height + marginTop + marginBottom;
    }

    function calculateHeight() {
        if (window.innerWidth <= 1023) {
            return window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox) - 126 - 32
        } else {
            return window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox) - 32
        }
    }

    window.addEventListener('resize', () => {
        try {
            feed.style.maxHeight = calculateHeight().toString()+"px";
            feed.style.minHeight = calculateHeight().toString()+"px";
        } catch {
            // Real men don't solve their problems
        }
    });

    function scrollFeedTop() {
        feed.scrollTo({ top: -feed.scrollHeight, behavior: 'smooth' });
     }


    async function updateLog() {
        const tmp = await getMessages($userDataStore.cid);
        tmp.forEach(async (m: Message) => {
            if (!Object.keys(users).includes(m.author)) {
                users = (await getConvoInfo($userDataStore.cid)).users;
            }
        });
        messages = tmp;
    }

    

    async function sendMsg(input: string) {
        await sendMessage($userDataStore.cid, input);
        // Maybe make a loading indicator
        setTimeout(updateLog, 1000);
    }

    onMount(async () => {
        if (!$userDataStore.token) {
            falert('Sign in to a class first!', () => {
                goto('/classes')
            });
        }
        const classInfo = await getConvoInfo($userDataStore.cid);

        // @ts-ignore            
        className = classInfo.name;
        // @ts-ignore
        users = classInfo.users;
        // Get all the messages
        // @ts-ignore
        messages = await getMessages($userDataStore.cid);
        
        // I don't think we should scroll the feed automatically
        // Now scroll to the bottom
        //setTimeout(scrollFeedTop, 150);

        setInterval(updateLog, 1000 * 60);  // 1 Minute

        scrollFeedTop();
        feed.style.maxHeight = calculateHeight().toString()+"px";
        feed.style.minHeight = calculateHeight().toString()+"px";
    })


</script>
<div class="flex flex-col max-h-screen overflow-hidden px-4 lg:pl-0">
    <div class="h-auto variant-filled-primary mt-4" bind:this={header}>
        <h3 class="h3 p-2">{className? 'Classroom ' + className: 'Loading...'}</h3>
    </div>    
    <div bind:this={inputbox}>
        <KTextArea onclick={sendMsg} sendOnEnter={false} />
    </div>
    <section bind:this={feed}
        class="flex flex-col-reverse p-4 overflow-y-auto space-y-4 mb-8"
        class:placeholder='{!messages.length}'
        class:animate-pulse='{!messages.length}'>
        {#if !$userDataStore.name || !users || !messages.length}
            <p class="p">Please Wait...</p>
        {:else}
            {#each messages as msg}
                {#if msg.author === "SYSTEM"}
                    <div class="grid gap-4 text-center w-full w-6/12 mx-auto">
                        <!-- We can add avatars later.... -->
                        <div class="border-0 space-y-2 w-full mt-4 variant-filled-surface p-2 w-9/12 mx-auto rounded-xl">
                            <p>{msg.text+" - "+msg.humanTime()}</p>
                        </div>
                    </div>
                {:else}
                    <div class="card p-4 rounded-tl-none rounded-br-none space-y-2 variant-soft grid gap-2 text-left w-6/12 mx-auto">
                        <header class="flex flex-row">
                            <div class="flex-initial align-left">
                                <KAvatar src={(msg.author === $userDataStore.name)? $userDataStore.photo: users[msg.author].photo} />
                            </div>
                            <p class="font-bold text-center flex-grow">{msg.author}</p>
                            <p class="flex-initial align-right">{msg.elapsedTime()}</p>
                        </header>
                        <p>{msg.text}</p>
                    </div>
                {/if}
            {/each}
        {/if}
    </section>
</div>