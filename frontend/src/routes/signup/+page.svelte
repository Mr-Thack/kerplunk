<script lang="ts">
    import { Stepper, Step, getModalStore, type ModalSettings, RadioGroup, RadioItem, type AutocompleteOption, Autocomplete } from '@skeletonlabs/skeleton';
    import { goto } from '$app/navigation';
    import { get, post } from '$lib/endpoint';
    import { checkCredentials } from '$lib/auth';
    import { onMount, onDestroy } from 'svelte';
    import isValidEmail from "$lib/email";
    import { dev } from '$app/environment';
    import { base } from '$app/paths';
    import Alerter from '$lib/alerter';
    import PwdCheck from '$components/PwdCheck.svelte';

    // We just need to initialize them to avoid errors
    // school is the actual data they wrote to input,
    // whereas schid is the ID# of the school they chose
    let fname = '', lname = '', email = '', pwd = '', pwdScore: number,
        school = '', schid = -1, isStudent = false, signupcode = '',
        pwdGood = false, page:HTMLElement, sstep:Stepper;


    const modalStore = getModalStore();
    const alerter = new Alerter(modalStore);

    // This is shown on success
    const successSignupModal: ModalSettings = {
        type: 'alert',
        title: 'Congrats! You\'ve been signed up!',
        body: 'Head over to your home page!',
        buttonTextCancel: 'Yay!',
        response: () => goto(base + '/home')
    }

    // This is shown on failure
    const failureSignupModal: ModalSettings = {
        type: 'alert',
        title: 'Oh No! There\'s an Error! Contact Help if Needed!',
        body: '', // Fill this with error detail later
        buttonTextCancel: 'OK'
    }

    
    function checkUserDetails(): boolean {
        // source: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
        let isEmailGood = isValidEmail(email);
        // ZXCVBN normally returns on scale 0-4, add 1 to get scale 1-5

        if (!isEmailGood) {
            alerter.salert("Check the Spelling of Your Email!");
        } else {
            let body = "On a scale from 1 to 5, your password got a " + pwdScore + "!"
            alerter.salert("Great!", body)
        }
        
        return isEmailGood;
    }

    async function onCompleteHandler() {
        const rez = await get('signup', {
            'code': signupcode
        });
        if (rez.error) {
            // @ts-ignore
            failureSignupModal.body = rez.data.detail;
            modalStore.trigger(failureSignupModal);
        } else {
            // Now, we'll sign the user up, login, and then redirect them to home
            await checkCredentials(alerter, email, pwd);
            modalStore.trigger(successSignupModal);
        }
    }
    
    async function startSignup() : Promise<boolean> {
        const rez = await post('signup', {
            'fname': fname,
            'lname': lname,
            'pwd': pwd,
            'email': email,
            'schid': schid,
            'student': isStudent
        })
        if (rez.error) {
            failureSignupModal.body = rez.data.detail;
            modalStore.trigger(failureSignupModal);
        } else {
            alerter.salert("Check your Email!");
        }
        return rez.error;
    }


    let schoolOptions: AutocompleteOption[] = [];

    async function focusHandler() {
        if (document.visibilityState === "visible") {
            let tmp = await get('schools');

            schoolOptions = [];
            if (tmp.error) {
                alerter.salert('Error: '  + tmp.data.detail);
            } else {
                for (var school of tmp.data.schools) {
                    schoolOptions.push({
                        'label': school.name,
                        'value': school.id,
                        'keywords': school.altnames 
                    });
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        if(window.innerWidth < 1024) {
            try {
                page.style.maxHeight = (window.innerHeight - 144).toString()+"px";
                sstep.style.maxHeight = (window.innerHeight - 142).toString()+"px";
            } catch (e) {
                console.log(e);
                // Real men don't solve their problems
            }
        } else {
            page.style.maxHeight = (window.innerHeight).toString()+"px";
            sstep.style.maxHeight = (window.innerHeight).toString()+"px";
        }
    });

    onMount(async function() {
        try {
            if(window.innerWidth < 1024) {
                page.style.maxHeight = (window.innerHeight - 144).toString()+"px";
                sstep.style.maxHeight = (window.innerHeight - 142).toString()+"px";
            } else {
                page.style.maxHeight = (window.innerHeight).toString()+"px";
                sstep.style.maxHeight = (window.innerHeight).toString()+"px";
            }
        } catch (e) {
            console.log(e);
        }
        await focusHandler(); // run it once to populate
        document.addEventListener("visibilitychange", focusHandler);
    })

    onDestroy(() => {
        document.removeEventListener("visibilitychange", focusHandler);
    });

    function onSchoolSelection(event: any) {
        schid = event.detail.value; // school id
    }

    async function onNextHandler(e: {detail: {step: number, state: {current: number, total: number}}}) {
        // e.detail.step is the step where navigation occurred
        // e.detail.state.current is the step shown after this function is run

        // This is a list of checking functions starting from step #2
        const checkFns = [checkUserDetails, startSignup];

        const lastStep = e.detail.step;
        // Then pull the function from the last step
        // If the lastStep is not the first step and the corresponding check function returns false, then DO NOT proceed 
        if (!(lastStep === 0 || await Promise.resolve(checkFns[lastStep - 1]()))) {
            e.detail.state.current = lastStep;
        }
    }

</script>
<header class="mx-auto text-center pr-4">
    <h2 class="h2">Signup!</h2>
</header>
<div bind:this={page} class="w-full lg:h-fill flex items-center">
<!-- It complains on the next line that on:step function handler has a type mismatch, but it doesn't impact us -->
    <Stepper bind:this={sstep} on:complete={onCompleteHandler} on:next={onNextHandler} class="card p-4 w-full max-h-[calc(100vh-142px)] lg:max-h-full m-4">
        <Step class="m-4 max-h-[calc(100vh-220px)] lg:max-h-full overflow-auto">
            <svelte:fragment slot="header">Are you a student or a teacher?</svelte:fragment>
            <div class="flex flex-row place-content-between justify-center w-full lg:my-8">
                <RadioGroup>
                    <RadioItem bind:group={isStudent} name="student-teacher" value={false}> 
                        <span class="material-symbols-outlined">
                            face_retouching_natural
                        </span>
                        <h5 class="h5">Teacher</h5>
                    </RadioItem>
                    <RadioItem bind:group={isStudent} name="student-teacher" value={true}>
                        <span class="material-symbols-outlined">
                            child_care
                        </span>
                        <h5 class="h5">Student</h5>
                    </RadioItem>
                </RadioGroup>
            </div>
        </Step>
        <Step locked={!(email && pwdGood && fname && lname)} class="m-4 max-h-[calc(100vh-220px)] overflow-auto">
            <svelte:fragment slot="header">Basic Info</svelte:fragment>
            <div class="grid grid-cols-2 w-full">
                <input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="First Name" type='text' bind:value={fname} placeholder='Your First Name' />
                <input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Last Name" type='text' bind:value={lname} placeholder='Your Last Name' />
            </div>
            <input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Email" type='email' bind:value={email} placeholder='Your Email' />
            <PwdCheck bind:pwdScore={pwdScore} bind:pwd={pwd} bind:pwdGood={pwdGood} />
        </Step>
        <Step locked={schid === -1} class="m-4 max-h-[calc(100vh-220px)] overflow-y-auto">
            <svelte:fragment slot="header">School Info</svelte:fragment>

            {#if !isStudent}
                <!-- We want to open a new tab (_blank) so that they can return to the one -->
                <a class="btn variant-filled-error text-sm lg:text-base h-8 lg:h-10 text-center mx-auto" href={base + (dev? "/register":"/register.html")} target="_blank">
                    Don't see your school here?
                </a>
            {/if}
        
            <input class="input m-2 max-w-[70vw] text-xs h-8 lg:m-4 lg:text-base lg:h-10" type="search" name="School Name" bind:value={school} placeholder="Search...." />
        
            <!--<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">-->
            <Autocomplete class="card w-auto p-2 text-xs lg:text-base max-h-48 max-w-[70vw] mx-auto overflow-y-auto" tabindex="-1" bind:input={school} options={schoolOptions} on:selection={onSchoolSelection} />
        </Step>
        <Step locked={!signupcode} class="m-8">
            <svelte:fragment slot="header">Email Signup Code</svelte:fragment>
            <input class="input m-2 max-w-[70vw] text-xs h-8 lg:m-4 lg:text-base lg:h-10" type="text" name="Code" bind:value={signupcode} placeholder="Code from your Email!" />
        </Step>
    </Stepper>
</div>
