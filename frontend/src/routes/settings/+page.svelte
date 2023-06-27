<script lang="ts">
    import { Avatar, TabGroup, Tab, FileButton, RadioItem, RadioGroup, setModeUserPrefers, setModeCurrent, ProgressBar } from '@skeletonlabs/skeleton';
    import getSettings from '$lib/settings';
    import {  post } from '$library/endpoint';
    import { onMount } from 'svelte';
    import { userDataStore } from '$library/stores';
    import { salert } from '$library/alerts';
    import { browser } from '$app/environment';
    import { removeClass, addClass, isClass } from '$lib/theming';
	import zxcvbn from 'zxcvbn';
    
    let firstName = "", lastName = "";
    let curPwd:HTMLElement, newPwd:HTMLElement, repPwd:HTMLElement;

    let tabSet: number = 0;
    let image: FileList;
    let photoData = "https://source.unsplash.com/YOErFW8AfkI/128x128";
    
    var currentTheme: number = -1;
    var currentAccent: string = '';
    const accents = ["red", "orange", "yellow", "green", "blue", "purple"];
    const themes = ["dark", "light"];
    const tabs = ["General", "Appearance", "Password", "Delete"];
    let settings:HTMLElement;

    window.addEventListener('resize', () => {
        try {
            settings.style.maxHeight = (window.innerHeight - 221).toString()+"px";
        } catch {
            // Real men don't solve their problems
        }
    });
    
    onMount(async () => {
        settings.style.maxHeight = (window.innerHeight - 221).toString()+"px";
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
        if (browser) {
            changeAccent(currentAccent);
            changeTheme(currentTheme);
        }
    }

    var passwordScoreText:HTMLElement, passwordScoreColor:string, passwordScore:number = 0,
    passwordMatch:HTMLElement, passwordBtnState:boolean = true;

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
        userDataStore.write('accent', currentAccent);
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
            userDataStore.write('name', firstName + ' ' + lastName);
            // @ts-ignore
            userDataStore.write('email', rez.data.email);
            // @ts-ignore
            photoData = rez.data.photo;
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    })

    $: {
        if (tabSet === 2 && newPwd) {
            newPwd.addEventListener('input', () => {
                if (newPwd.value) {
                    let score = zxcvbn(newPwd.value).score + 1;
                    let passwordMatches = newPwd.value === repPwd.value
                    passwordScore = score;
                    if (score === 1) {
                        passwordScoreColor = "bg-error-900";
                        passwordScoreText.innerHTML = "Poor";
                    } else if (score === 2) {
                        passwordScoreColor = "bg-error-900";
                        passwordScoreText.innerHTML = "Bad"; 
                    } else if (score === 3) {
                        passwordScoreColor = "bg-warning-900";
                        passwordScoreText.innerHTML = "Ok"; 
                    } else if (score === 4) {
                        passwordScoreColor = "bg-success-900";
                        passwordScoreText.innerHTML = "Good"; 
                    } else {
                        passwordScoreColor = "bg-success-900";
                        passwordScoreText.innerHTML = "Great";
                    }
                    if (passwordMatches) {
                        passwordMatch.innerHTML = "✔"
                    } else {
                        passwordMatch.innerHTML = "✖"
                    }
                    if (score >= 4 && passwordMatches && curPwd.value) {
                        passwordBtnState = false;
                    } else {
                        passwordBtnState = true;
                    }
                } else {
                    passwordScore = 0;
                    passwordScoreText.innerHTML = "";
                    passwordMatch.innerHTML = ""
                }
            });
            repPwd.addEventListener('input', () => {
                if (newPwd.value) {
                    let score = zxcvbn(newPwd.value).score + 1;
                    let passwordMatches = newPwd.value === repPwd.value
                    if (passwordMatches) {
                        passwordMatch.innerHTML = "✔"
                    } else {
                        passwordMatch.innerHTML = "✖"
                    }
                    if (score >= 4 && passwordMatches && curPwd) {
                        passwordBtnState = false;
                    } else {
                        passwordBtnState = true;
                    }
                }
            });
            curPwd.addEventListener('input', () => {
                if (curPwd.value) {
                    let score = zxcvbn(newPwd.value).score + 1;
                    let passwordMatches = newPwd.value === repPwd.value
                    if (score >= 4 && passwordMatches && curPwd) {
                        passwordBtnState = false;
                    } else {
                        passwordBtnState = true;
                    }
                } else {
                    passwordBtnState = true;
                }
            });
        }
    
    }
    async function loadGeneralInfo() {
        var rez = await getSettings(["fname", "lname", "email", "photo"]);
        if (rez && !rez.error) {
            // @ts-ignore
            firstName = rez.data.fname;
            // @ts-ignore
            lastName = rez.data.lname;
            userDataStore.write('name', firstName + ' ' + lastName);
            // @ts-ignore
            userDataStore.write('email', rez.data.email);
            // [NOTE]
            // photoHidden = false; 
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
    }

    async function updateGeneral() {
        userDataStore.write('name', firstName + ' ' + lastName);
        var upload = await post('userme', {
            "fname": firstName,
            "lname": lastName,
            "email": $userDataStore.email
          }, $userDataStore.token);
        if (upload.status === 200) {
            salert("Your changes were updated successfully.")
        } else {
            salert("There was an error updating your changes.")
        }
    }

    async function updatePassword() {
        if (newPwd.value === repPwd.value) {
            var upload = await post('update_pwd', {
                "pwd": curPwd.value,
                "new_pwd": newPwd.value,
            }, $userDataStore.token);
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
        // @ts-ignore
        reader.readAsDataURL(e.target.files[0]);

        reader.onload = async function(event) {
            // @ts-ignore
            let fileContents: string = event.target.result;
            var imageUploaded = await uploadImage(fileContents);
            if (imageUploaded) {
                photoData = fileContents;
                userDataStore.write("photo", photoData);
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

<div class="grid grid-rows-1 mx-4">
    <TabGroup class="w-full lg:w-full overflow-x-auto text-xs md:text-sm lg:text-base ">
        {#each tabs as tab, i}
            <!-- !i will run when i=0 -->
            <!-- So, the on:click function will be loadInfo on i=0 -->
            <Tab bind:group={tabSet} name={tab} value={i} on:click={(!i)? loadGeneralInfo : null}>{tab}</Tab>
        {/each}
        <svelte:fragment slot="panel">
            <div bind:this={settings} class="max-w-[calc(100vw-2rem)] lg:max-h-[calc(100vh-135px)] overflow-auto">
                {#if tabSet === 0}
                    {#if photoData}
                        <Avatar id="photo-settings" src={photoData} width="w-20 lg:w-40" rounded="rounded-full" class="mx-auto"/>
                    {:else}
                        <svg id="no-photo-settings" xmlns="http://www.w3.org/2000/svg" class="mx-auto w-20 lg:w-40" enable-background="new 0 0 20 20" viewBox="0 0 20 20"><g><rect fill="none"/></g><g><g><path fill="currentColor" d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
                    {/if}
                    <FileButton id="file-button" name="profilePicture" class="flex justify-center m-4 mx-auto w-fit text-sm lg:text-base h-8 lg:h-10" button="variant-filled" bind:files={image} on:change={onChangeHandler}>
                        {#if !photoData}
                            Add Image
                        {:else}
                            Edit Image
                        {/if}
                    </FileButton>
                    <div class="grid grid-cols-2">
                        <input id="first-name" class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10 col-start-1" title="First Name" type='text' placeholder='Your First Name' bind:value={firstName} />
                        <input id="last-name" class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10 col-start-2" title="Last Name" type='text' placeholder='Your Last Name' bind:value={lastName}/>
                    </div>
                        {#if $userDataStore}
                            <input id="email" class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Email" type='email' placeholder='Your Email' bind:value={$userDataStore.email}/>
                        {:else}
                            <input id="email" class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Email" type='email' placeholder='Your Email'/>
                        {/if}
                        <div class="flex justify-center m-2">
                        <button type="button" class="btn variant-filled mx-8 my-4 text-sm lg:text-base h-8 lg:h-10" on:click={loadGeneralInfo}>
                            <span>Reset</span>
                        </button>
                        <button type="button" class="btn variant-filled-primary mx-8 my-4 text-sm lg:text-base h-8 lg:h-10" on:click={updateGeneral}>
                            <span>Update Information</span>
                        </button>
                    </div>
                {:else if tabSet === 1}
                <!-- I know, this isn't clean but what am I supposed to do? -->
                    {#if !(currentTheme === 0 || currentTheme === 1)}
                        <p class="p">Loading....</p>
                    {:else}
                        
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
                                <RadioItem bind:group={currentAccent} name="accent" value={color} padding="px-2 md:px-4 py-1">	
                                    <span class="material-icons {color === 'red' ? 'text-red' : ''} {color === 'orange' ? 'text-orange' : ''} {color === 'yellow' ? 'text-yellow' : ''} {color === 'green' ? 'text-green' : ''} {color === 'blue' ? 'text-blue' : ''} {color === 'purple' ? 'text-purple' : ''}">lens</span>
                                </RadioItem>
                            {/each}
                        </RadioGroup>
                    {/if}
                {:else if tabSet === 2}
                    <input id="current-password" bind:this={curPwd} class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Current Password" type='password' placeholder='Current Password' />
                    <input id="new-password" bind:this={newPwd} class="input m-2 w-fill-available moz-available text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="New Password" type='password' placeholder='New Password' />
                    <div class="flex justify-center">
                        <ProgressBar label="Password Score" class="m-1 lg:m-2 w-[70vw]" meter={passwordScoreColor} value={passwordScore} max={5} />
                        <p class="p"bind:this={passwordScoreText}></p>
                    </div>
                    <div class="input-group input-group-divider grid-cols-[1fr_auto] m-2 lg:m-4 w-fill-available moz-available">
                        <input id="repeat-password" bind:this={repPwd} class="input text-xs h-8 lg:text-base lg:h-10" title="Repeat Password" type='password' placeholder='Repeat New Password' />
                        <a>
                            <p class="my-auto text-xl" bind:this={passwordMatch}></p>
                        </a>
                        
                    </div>
                    <button type="button" disabled={passwordBtnState} class="btn variant-filled-primary mx-8 my-4 text-sm lg:text-base h-8 lg:h-10" on:click={updatePassword}>
                        <span>Change Password</span>
                    </button>
                {:else if tabSet === 3}
                    <p class="p">Someday, my child.</p>
                {/if}
            </div>
        </svelte:fragment>
    </TabGroup>
</div>