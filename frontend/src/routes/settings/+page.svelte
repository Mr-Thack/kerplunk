<script lang="ts">
    import { Avatar, TabGroup, Tab, FileButton } from '@skeletonlabs/skeleton';
    import getSettings from '$lib/settings';
	import { get, post } from '$library/endpoint';
	import { onMount } from 'svelte';
	import { userDataStore } from '$library/stores';
	import { salert } from '$library/alerts';

    let tabSet: number = 0;
    let image: FileList;

    onMount(async () => {
        var rez = await getSettings(["fname", "lname", "email", "photo"]);
        if (!(rez === undefined || rez.error === true)) {
            document.getElementById("first-name").value = rez.data.fname
            document.getElementById("last-name").value = rez.data.lname
            document.getElementById("email").value = rez.data.email
            document.getElementById('load-photo-settings').classList.toggle("hidden")
            if (rez.data.photo === '') {
                document.getElementById('file-button').parentElement.parentElement.querySelector("button").innerHTML = "Add Image"
                document.getElementById('no-photo-settings').classList.toggle("hidden")
            } else {
                document.getElementById('photo-settings').src = rez.data.photo
                document.getElementById('file-button').parentElement.parentElement.querySelector("button").innerHTML = "Edit Image"
                document.getElementById('photo-settings').parentNode.classList.toggle("hidden")
            }
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    })

    async function loadInfo() {
        var rez = await getSettings(["fname", "lname", "email", "photo"]);
        if (!(rez === undefined || rez.error === true)) {
            document.getElementById("first-name").value = rez.data.fname
            document.getElementById("last-name").value = rez.data.lname
            document.getElementById("email").value = rez.data.email
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    }
    async function updateGeneral() {
        var upload = await post('userme', {
    "fname": document.getElementById("first-name").value,
    "lname": document.getElementById("last-name").value,
    "email": document.getElementById("email").value
  }, userDataStore.readonce('token'));
        if (upload.status === 200) {
            salert("Your changes were updated successfully.")
        } else {
            salert("There was an error updating your changes.")
        }
    }

    async function updatePassword() {
        if (document.getElementById("new-password").value === document.getElementById("repeat-password").value) {
            var upload = await post('update_pwd', {
                "pwd": document.getElementById("current-password").value,
                "new_pwd": document.getElementById("new-password").value,
            }, userDataStore.readonce('token'));
                    if (upload.status === 200) {
                        salert("Your password was changed successfully.")
                    } else if (upload.status === 401) {
                        salert("Your original password is incorrect.")
                    } else {
                        salert("There was an error changing your password.")
                    }
        } else {
            salert("The new password doesn't match.")
        }
    }


    function onChangeHandler(e: Event): void {
        var reader = new FileReader()
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = async function(event) {
            let fileContents = event.target.result;
            var imageUploaded = await uploadImage(fileContents);
            if (imageUploaded == true) {
                document.getElementById('photo-settings').src = fileContents
                document.getElementById('file-button').parentElement.parentElement.querySelector("button").innerHTML = "Edit Image"
                if (document.getElementById('photo-settings').parentNode.classList.contains("hidden")) {
                    document.getElementById('no-photo-settings').classList.toggle("hidden")
                    document.getElementById('photo-settings').parentNode.classList.toggle("hidden")
                }
            }
        };
    }

    async function uploadImage(fileContents) {
        var upload = await post('userme', {
                "photo": fileContents
            }, userDataStore.readonce('token'));
        if (upload.status === 200) {
            return true
        } else {
            return false
        }
    }
</script>
<header class="mx-auto mb-5 text-center">
	<h2 class="h2">Settings</h2>
</header>
<div class="grid grid-cols-3 grid-rows-1">
    <div class="col-start-1">
        <svg id="load-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto " enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        <svg id="no-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto hidden" enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        <Avatar id="photo-settings" src="https://source.unsplash.com/YOErFW8AfkI/128x128" width="w-40" rounded="rounded-full" class="mx-auto hidden"/>
            <FileButton id="file-button" class="flex justify-center m-4 mx-auto w-fit" button="variant-filled" bind:files={image} on:change={onChangeHandler}></FileButton>
    </div>
    <div class="col-start-2 col-span-2 mx-8">
        <TabGroup>
            <Tab bind:group={tabSet} name="General" value={0} on:click={loadInfo}>General</Tab>
            <Tab bind:group={tabSet} name="Appearance" value={1}>Appearance</Tab>
            <Tab bind:group={tabSet} name="Password" value={2}>Password</Tab>
            <Tab bind:group={tabSet} name="Delete" value={3}>Delete</Tab>
            <svelte:fragment slot="panel">
                {#if tabSet === 0}
                    <div class="grid grid-cols-2">
                        <input id="first-name" class="input m-2 w-fill-available moz-available col-start-1" title="First Name" type='text' placeholder='Your First Name'/>
                        <input id="last-name" class="input m-2 w-fill-available moz-available col-start-2" title="Last Name" type='text' placeholder='Your Last Name'/>
                    </div>
                    <input id="email" class="input m-2 w-fill-available moz-available" title="Email" type='email' placeholder='Your Email'/>
                    <div class="flex justify-center m-12">
                        <button type="button" class="btn variant-filled mx-8 my-4" on:click={loadInfo}>
                            <span>Reset</span>
                        </button>
                        <button type="button" class="btn variant-filled-primary mx-8 my-4" on:click={updateGeneral}>
                            <span>Update Information</span>
                        </button>
                    </div>
                {:else if tabSet === 1}
                    <p class="p">This will be the future theming page</p>
                {:else if tabSet === 2}
                <input id="current-password" class="input m-2 w-fill-available moz-available" title="Current Password" type='password' placeholder='Current Password' />
                <input id="new-password" class="input m-2 w-fill-available moz-available" title="New Password" type='password' placeholder='New Password' />
                <input id="repeat-password" class="input m-2 w-fill-available moz-available" title="Repeat Password" type='password' placeholder='Repeat New Password' />
                <button type="button" class="btn variant-filled-primary mx-8 my-4" on:click={updatePassword}>
                    <span>Change Password</span>
                  </button>
                {:else if tabSet === 3}
                    <p class="p">This will be the future delete account page</p>
                {/if}
            </svelte:fragment>
        </TabGroup>

    </div>
    

</div>