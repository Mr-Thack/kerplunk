<script lang="ts">
    import KPost from '$components/KPost.svelte';
    import KTextArea from '$components/KTextArea.svelte';
    import SystemMessage from '$components/SystemMessage.svelte';
    import { userDataStore } from '$library/stores';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { falert } from '$library/alerts';
    import { base } from '$app/paths';
    import { Message, type User, sendMessage, getConvoInfo, getMessages, likeMsg} from '$lib/convo';
    import { drawerStore, type DrawerSettings } from '@skeletonlabs/skeleton';

    let feed: HTMLElement;

    type Users = { [name: string]: User; }
    var users: Users = {};


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
        return window.innerHeight - getTotalHeight(header) - getTotalHeight(inputbox) - 32
    }

    function scale() {
        feed.style.maxHeight = calculateHeight().toString()+"px";
        feed.style.height = calculateHeight().toString()+"px";
    }

    window.addEventListener('resize', () => {
        try {
            scale();
        } catch {
            // Real men don't solve their problems
            // lol. Johnathan too funny.
        }
    });

    function scrollFeedTop() {
        feed.scrollTo({ top: -feed.scrollHeight, behavior: 'smooth' });
    }


    let mid: number|undefined = undefined;
    
    const drawerReplies : DrawerSettings = {
        id: 'drawerReplies',
	      width: 'mx-auto align-center content-center w-9/12',
        height: 'h-2/3',
	      padding: 'p-4',
        position: 'bottom',
        meta: { 
            msgs: [],
            users: users,
            mid: mid,
            reply: reply,
            like: like
        },
	      rounded: 'rounded-xl'
    };

    async function updateLog() {
        const tmp = await getMessages($userDataStore.cid);
        tmp.forEach(async (m: Message) => {
            if (!Object.keys(users).includes(m.author)) {
                users = (await getConvoInfo($userDataStore.cid)).users;
            }
        });
        messages = tmp;
    }

    async function like(m: number) {
        await likeMsg($userDataStore.cid, m);
        setTimeout(updateLog, 1000);
    }

    
    function openReplies(m: number) {
        mid = m;
        drawerReplies.meta.msgs = [];
        for (const msg of messages[m].replies) {
            drawerReplies.meta.msgs.push(messages[msg]);
        }
        drawerReplies.meta.users = users;
        drawerReplies.meta.mid = m;
        drawerStore.open(drawerReplies);
    }

    async function sendMsg(input: string) {
        await sendMessage($userDataStore.cid, input);
        // Maybe make a loading indicator
        setTimeout(updateLog, 1000);
    }

    async function reply(msg: string, mid: number) {
        await sendMessage($userDataStore.cid, msg, mid);
        setTimeout(async () => {
            await updateLog();
            drawerStore.close();
            openReplies(drawerReplies.meta.mid);
        }, 1000);
    }
    
    onMount(async () => {
        if (!$userDataStore.token) {
            falert('Sign in to a class first!', () => {
                goto(base + '/classes')
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
        scale();
    })


</script>
<div class="flex flex-col max-h-screen overflow-hidden px-4 lg:pl-0">
    <div class="h-auto flex flex-row variant-filled-primary mt-4 p-1" bind:this={header}>
        <a class="btn-icon material-symbols-outlined w-8 h-8" href="{base}/classrooms">arrow_back_ios</a>
        <h3 class="h3 px-2 my-auto">{className? 'Classroom ' + className: 'Loading...'}</h3>
        <button class="material-symbols-outlined ml-auto mr-3 w-8 h-8 my-auto">settings</button>
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
            {#each messages as msg, i}
                {#if msg.author === "SYSTEM"}
                    <SystemMessage msg={msg} />
                    <hr class="border-4 rounded-full drop-shadow-xl" />
                {:else if !msg.replyTo}
                    <!-- reply is an int -->
                    {#each msg.replies as reply, j}
                        {#if j < 3}
                            <!-- This is how we make it mini -->
                            <div class="w-9/12 mx-auto align-center">
                                <KPost src={users[messages[reply].author].photo}
                                       msg={messages[reply]} 
                                       isReply={true}
                                       like={() => {like(reply)}}
                                />
                            </div>
                        {/if}
                    {/each}
                    <!-- You'd think this goes before the replies, but no! -->
                    <!-- We use flex-reverse or something to style the container so that they show up in reverse order (so earliest first)-->
                    <KPost src={users[msg.author].photo}
                           msg={msg} reply={() => {openReplies(i)}} like={() => {like(i)}} />
                    <hr class="border-4 rounded-full drop-shadow-xl" />
                {/if}
            {/each}
        {/if}
    </section>
</div>