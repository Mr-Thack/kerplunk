<script lang="ts">
    import { Avatar, TabGroup, Tab, FileButton, RadioItem, RadioGroup, setModeUserPrefers, setModeCurrent } from '@skeletonlabs/skeleton';
    import getSettings from '$lib/settings';
    import { get, post } from '$library/endpoint';
    import { onMount } from 'svelte';
    import { userDataStore } from '$library/stores';
    import { salert } from '$library/alerts';


    let firstName = "", lastName = "", email = "";
    let curPwd = "", newPwd = "", repPwd = "";

    let tabSet: number = 0;
    let image: FileList;
    let photoHidden = true;
    let photoData = "https://source.unsplash.com/YOErFW8AfkI/128x128";
    
    var currentTheme: number = -1;
    var currentAccent: string = '';
    const accents = ["red", "orange", "yellow", "green", "blue", "purple"];
    const themes = ["dark", "light"];
    const tabs = ["General", "Appearance", "Password", "Delete"];

    function removeClass(styleClass: string) {
        // Remove a Style Class from the Document
        document.documentElement.classList.remove(styleClass);
    }

    function addClass(styleClass: string) {
        // Add a Style Class to the Document
        document.documentElement.classList.add(styleClass);
    }

    function isClass(styleClass: string) {
        // Check if a style class is currently in use
        return document.documentElement.classList.contains(styleClass);
    }

    onMount(async () => {
        var rez = await getSettings(["theme", 'accent']);
        if (rez !== undefined && !rez.error) {
            // @ts-ignore
            currentTheme = rez.data.theme;
            // @ts-ignore
            currentAccent = rez.data.accent;
        } else {
            salert("The server cannot be reached, or there was an error. Check your internet connection.")
            currentAccent = 'red';
            currentTheme = isClass("dark")? 0:1;
        }
    })
    $: {
        try {
            document.documentElement
            changeAccent(currentAccent)
            changeTheme(currentTheme)
        } catch(err) {
            // I don't know how to pass in typescript so here you go
        }
    }

    async function changeTheme(currentTheme:number) {
        if (currentTheme !== -1) {
            await post('userme', {
                'theme': currentTheme
            }, $userDataStore.token)
        }
        let preferredMode = currentTheme === 1;
        setModeUserPrefers(preferredMode);
        setModeCurrent(preferredMode);
    }

    
    async function changeAccent(currentAccent:string) {
        for (const accent of accents) {
            removeClass(accent);
        }
        if (accents.includes(currentAccent)) {
            addClass(currentAccent);
        }
        if (currentAccent) {
            await post('userme', {
                "accent": currentAccent
            }, $userDataStore.token);
        }
    }


    onMount(async () => {
        var rez = await getSettings(["fname", "lname", "email", "photo"]);
        if (rez && !rez.error) {
            // @ts-ignore
            firstName = rez.data.fname;
            // @ts-ignore
            lastName = rez.data.lname;
            // @ts-ignore
            email = rez.data.email;
            // @ts-ignore
            let photo = rez.data.photo
            photoHidden = !photo;


            if (photo) {
                photoData = photo
            }
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    })


    async function loadInfo() {
        var rez = await getSettings(["fname", "lname", "email", "photo"]);
        if (rez && !rez.error) {
            firstName = rez.data.fname;
            lastName = rez.data.lname;
            email = rez.data.email;
            // [NOTE]
            // photoHidden = false; 
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    }

    async function updateGeneral() {
        var upload = await post('userme', {
            "fname": firstName,
            "lname": lastName,
            "email": email
          }, $userDataStore.token);
        if (upload.status === 200) {
            salert("Your changes were updated successfully.")
        } else {
            salert("There was an error updating your changes.")
        }
    }

    async function updatePassword() {
        if (newPwd === repPwd) {
            var upload = await post('update_pwd', {
                "pwd": curPwd,
                "new_pwd": newPwd,
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
            // @ts-ignore
            let fileContents: string = event.target.result;
            var imageUploaded = await uploadImage(fileContents);
            if (imageUploaded == true) {
                photoData = fileContents;
                photoHidden = false;
            }
        };
    }

    async function uploadImage(fileContents: string) {
        var upload = await post('userme', {
                "photo": fileContents
            }, userDataStore.readonce('token'));
        return upload.status === 200;
    }

    function capitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
</script>
<header class="mx-auto mb-5 text-center">
	<h2 class="h2">Settings</h2>
</header>

<div class="grid grid-rows-1">
    <TabGroup>
        {#each tabs as tab, i}
            <Tab bind:group={tabSet} name={tab} value={i} on:click={(!i)? loadInfo : null}>{tab}</Tab>
        {/each}
        <svelte:fragment slot="panel">
            {#if tabSet === 0}
            {#if !photoHidden}
                <Avatar id="photo-settings" src={photoData} width="w-40" rounded="rounded-full" class="mx-auto"/>
            {:else}
                <svg id="no-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px"><g><rect fill="none" height="20" width="20"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
            {/if}
            <FileButton id="file-button" name="profilePicture" class="flex justify-center m-4 mx-auto w-fit" button="variant-filled" bind:files={image} on:change={onChangeHandler}>
                {#if photoHidden}
                    Add Image
                {:else}
                    Edit Image
                {/if}
            </FileButton>
                <div class="grid grid-cols-2">
                    <input id="first-name" class="input m-2 w-fill-available moz-available col-start-1" title="First Name" type='text' placeholder='Your First Name' value={firstName} />
                    <input id="last-name" class="input m-2 w-fill-available moz-available col-start-2" title="Last Name" type='text' placeholder='Your Last Name' value={lastName}/>
                </div>
                <input id="email" class="input m-2 w-fill-available moz-available" title="Email" type='email' placeholder='Your Email' value={email}/>
                <div class="flex justify-center m-12">
                    <button type="button" class="btn variant-filled mx-8 my-4" on:click={loadInfo}>
                        <span>Reset</span>
                    </button>
                    <button type="button" class="btn variant-filled-primary mx-8 my-4" on:click={updateGeneral}>
                        <span>Update Information</span>
                    </button>
                </div>
            {:else if tabSet === 1}
                {#await currentTheme}
                    <p class="p">Loading....</p>
                {:then}
                    
                    <h3 class="h3">Theme</h3>
                    <RadioGroup>
                        {#each themes as theme, i}
                            <RadioItem bind:group={currentTheme} name="theme" value={i}>	
                                <span class="material-symbols-outlined">
                                    {theme + "_mode"}
                                </span>
                                <h5 class="h5">{capitalize(theme)}</h5>
                            </RadioItem>
                        {/each}
                    </RadioGroup>

                    <h3 class="h3">Accent Color</h3>
                    <RadioGroup active="variant-filled-primary">
                        {#each accents as color}
                            <RadioItem bind:group={currentAccent} name="accent" value={color}>	
                                <span class="material-icons {color === 'red' ? 'text-red' : ''} {color === 'orange' ? 'text-orange' : ''} {color === 'yellow' ? 'text-yellow' : ''} {color === 'green' ? 'text-green' : ''} {color === 'blue' ? 'text-blue' : ''} {color === 'purple' ? 'text-purple' : ''}">lens</span>
                            </RadioItem>
                        {/each}
                    </RadioGroup>
                {/await}
            {:else if tabSet === 2}
                <input id="current-password" value={curPwd} class="input m-2 w-fill-available moz-available" title="Current Password" type='password' placeholder='Current Password' />
                <input id="new-password" value={newPwd} class="input m-2 w-fill-available moz-available" title="New Password" type='password' placeholder='New Password' />
                <input id="repeat-password" value={repPwd} class="input m-2 w-fill-available moz-available" title="Repeat Password" type='password' placeholder='Repeat New Password' />
                <button type="button" class="btn variant-filled-primary mx-8 my-4" on:click={updatePassword}>
                    <span>Change Password</span>
                </button>
            {:else if tabSet === 3}
                <p class="p">This will be the future delete account page</p>
            {/if}
        </svelte:fragment>
    </TabGroup>
</div>