<script lang='ts'>
	import { userDataStore } from '$lib/stores';
    import { onDestroy, onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Alerter from '$lib/alerter';
    import { joinClass, makeConvo, getConvoInfo, type Class } from '$lib/convo';
    import getSettings from '$lib/settings';
    import { base } from '$app/paths';
    import { getModalStore } from '@skeletonlabs/skeleton';

    let classes: Array<Class> =  [];
    let classroomList:HTMLElement;
    const alerter = new Alerter(getModalStore());

    window.addEventListener('resize', () => {
        try {
          classroomList.style.maxHeight = (window.innerHeight - 134).toString()+"px";
        } catch (e) {
            console.log(e);
            // Real men don't solve their problems
        }
    });

    async function updateClasses() {
        // @ts-ignore
        const cids: Array<string> = (await getSettings(['convos'])).data.convos;
        classes = [];
        cids.forEach(async (cid: string) => {
            // @ts-ignore
            const cls: Class = await getConvoInfo(cid);
            if (!cls.chatroom) {
                cls.cid = cid;
                classes.push(cls);
                classes = classes;  // Force rerender DOM
            }
        });
    }


    var updateInterval: number; // setInterval type is number
    onMount(async function() {
        classroomList.style.maxHeight = (window.innerHeight - 134).toString()+"px";
        if (!$userDataStore.token) {
            goto(base + '/login');
        }
        updateClasses();
    });

    async function join(cid: string | undefined) {
        if (cid) {
            $userDataStore.cid = cid;
        } else {
            alerter.salert("Something has gone like really wrong. Go contact an admin about non-existant CID. Error detail: " + cid)
        }
        goto(base + '/class');
    }

    async function joinClassroom() {
        alerter.proompt("What is the class code?", async (code: string) => {
            if (code) {
                if (await joinClass(alerter, code)) {
                    alerter.alert("All done! Should show up soon!");
                } else {
                    alerter.salert("The code was probably wrong/")
                }
            } else {
                alerter.salert("You need to type in a code!");
            }
        });    
    }

    async function makeClassroom(name: string) {
        const r = await makeConvo(alerter, name, "", false);
        if (r) {
            alerter.salert("All's well! Should show up soon!");
            setTimeout(updateClasses, 2000);
        }
    }

    async function promptRoom() {
        alerter.proompt("Name of the Class?", (name: string) => {
            if (name) {
                makeClassroom(name);
            } else {
                alerter.salert("You need a class name!")
            }
        });
    }

 
    onDestroy(() => {
        clearInterval(updateInterval);
    });

</script>
<div bind:this={classroomList} class="m-4 overflow-auto">
  <button class='btn mb-10 text-center variant-filled' on:click={promptRoom}>Make Your Own</button>
  <button class='btn mb-10 text-center variant-filled' on:click={joinClassroom}>Join a Class</button>
  <h1 class="h1 text-center mb-5">Your Classes:</h1>

  <!-- Redo this to make it look more class like -->
  {#if classes.length}
    {#each classes as cls}
      <button class="btn bg-gradient-to-br variant-filled-secondary mt-3 w-25 text-sm lg:text-base h-8 lg:h-10" on:click={() => join(cls.cid)}>Enter {cls.name}</button>
      <br />
    {/each}
  {:else}
    <h2 class="h2 text-center">There aren't any yet! Make one!</h2>
  {/if}
</div>
