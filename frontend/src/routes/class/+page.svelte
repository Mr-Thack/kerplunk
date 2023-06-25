<script lang="ts">
    import KTextArea from '$components/KTextArea.svelte';
    import KAvatar from '$components/KAvatar.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { Message, type User, sendMessage, getConvoInfo, getMessages, subscribeEventStream} from '$lib/convo';

    let feed: HTMLElement;


    type Users = { [name: string]: User; }
    var users: Users;


    let className: string;

    /*
    function scrollFeedTop() {
        if (feed) {
            // [NOTE]
            // Before pushing, make it scroll to bottom
            feed.scrollTo({ top: feed.scrollHeight, behavior: 'smooth' });
        } else {
            // There's some weird bug happening every 1 in 5 times where it prints an error to the console
            console.log(feed);
        }
     }*/
    
    var messages: Array<Message> = [];

    async function sendMsg(input: string) {
        await sendMessage($userDataStore.cid, input);
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
        users = {}
        // @ts-ignore
        classInfo.users.forEach((u: User) => {users[u.name] = u});
        users = users; // To force DOM rerender
        // Get all the messages
        // @ts-ignore
        messages = await getMessages($userDataStore.cid);
            
        // I don't think we should scroll the feed automatically
        // Now scroll to the bottom
        //setTimeout(scrollFeedTop, 150);

        // Setup the Event Stream
        subscribeEventStream($userDataStore.cid, (m: Message) => {
            messages = [...messages, m];
            //setTimeout(scrollFeedTop, 75)
        }, messages.length);
    })


</script>
<div class="flex flex-col min-h-screen max-h-screen overflow-hidden pr-4">
    <div class="h-auto variant-filled-primary mt-4">
        <h3 class="h3 p-2">{className? 'Classroom ' + className: 'Loading...'}</h3>
    </div>    
    <KTextArea onclick={sendMsg} sendOnEnter={false} />
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