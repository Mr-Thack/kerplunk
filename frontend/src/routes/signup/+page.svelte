<script lang="ts">
	import { Stepper, Step, modalStore, type ModalSettings, RadioGroup, RadioItem, type AutocompleteOption, Autocomplete } from '@skeletonlabs/skeleton';
	import zxcvbn from 'zxcvbn';
	import { goto } from '$app/navigation';
	import { get, post } from '$lib/endpoint';
	import { checkCredentials } from '$lib/auth';
	import { userDataStore } from '$lib/stores';
	import { salert } from '$lib/alerts';
	import { onMount, onDestroy } from 'svelte';
	import isValidEmail from "$lib/email";
	import { dev, browser } from '$app/environment';
	// We just need to initialize them to avoid errors
	// school is the actual data they wrote to input,
	// whereas schid is the ID# of the school they chose
	let password = '', fname = '', lname = '', photo='', email = '',
		  school = '', schid = -1, isStudent = false, signupcode = '',
		  accent = 'red', theme = 0;

	const MINREQ = 4; // Minimum required score for signup (on scale 1-5)


	// This is shown on success
	const successSignupModal: ModalSettings = {
		type: 'alert',
		title: 'Congrats! You\'ve been signed up!',
		body: 'Head over to your home page!',
		buttonTextCancel: 'Yay!',
		response: () => goto('/home')
	}

	// This is shown on failure
	const failureSignupModal: ModalSettings = {
		type: 'alert',
		title: 'Oh No! There\'s an Error! Contact Help if Needed!',
		body: '', // Fill this with error detail later
		buttonTextCancel: 'OK'
	}


	function checkUserDetails()
	{
		// source: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
		let isEmailGood = isValidEmail(email);
		let score = zxcvbn(password).score + 1;
		let isScoreGood = score >= MINREQ
		// ZXCVBN normally returns on scale 0-4, add 1 to get scale 1-5


		if (!isEmailGood) {
			salert("Check the Spelling of Your Email!");
		} else {
			let body = "On a scale from 1 to 5, your password got a " + score + "!"
			if (score < MINREQ) {
				salert("Try a Stronger Password...", body)
			} else {
				salert("Great!", body)
			}
		}
		
		return isEmailGood && isScoreGood;
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
			// Now, we'll sign the user up and redirect them to the home page
			const token = await checkCredentials(email, password);
			userDataStore.write('token', token);
			modalStore.trigger(successSignupModal);
		}
	}
	
	async function startSignup() {
		// @ts-ignore
		const rez = await post('signup', {
			'fname': fname,
			'lname': lname,
			'photo': photo,
			'pwd': password,
			'email': email,
			'schid': schid,
			'student': isStudent,
			'accent': accent,
			'theme': theme
		})
		if (rez.error) {
			// @ts-ignore
			failureSignupModal.body = rez.data.detail;
			modalStore.trigger(failureSignupModal);
			return false;
		} else {
			salert("Check your Email!");
		}
		return true;
	}


	let schoolOptions: AutocompleteOption[] = [];

	async function focusHandler() {
		if (document.visibilityState === "visible") {
			let tmp = await get('schools');

			schoolOptions = [];
			if (tmp.error) {
				//@ts-ignore
				salert('Error: '  + tmp.error.detail);
			} else {
				// @ts-ignore
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

	if (browser) {
		onMount(async function() {
			await focusHandler(); // Just run it once
			document.addEventListener("visibilitychange", focusHandler);
		})

		onDestroy(() => {
			document.removeEventListener("visibilitychange", focusHandler);
		});
	}

	function onSchoolSelection(event: any): void {
		schid = event.detail.value; // school id
	}

	function onStepHandler(e: {detail: {step: number, state: {current: number, total: number}}}): void {
		if (e.detail.step + 1 !== e.detail.state.current) {
			return;
		}

		switch(e.detail.step) {
			case 0:
				if (!checkUserDetails()) {
					e.detail.state.current = 0;
					// push the user back
				}
				break;
			case 2:
				if (!startSignup()) {
					e.detail.state.current = 2;
				}
				break;
		}
	}

</script>
<header class="mx-auto text-center pr-4">
	<h2 class="h2">Signup!</h2>
</header>
<div class="w-full h-full flex items-center h-screen absolute inset-x-0 inset-y-0 pl-28 pr-4">
<!-- It complains on the next line that on:step function handler has a type mismatch, but it doesn't impact us -->
	<Stepper on:complete={onCompleteHandler} on:step={onStepHandler} class="card p-4 w-full">
		<Step locked={!(email && password && fname && lname)} class="m-8">
			<svelte:fragment slot="header">Basic Info</svelte:fragment>
			<div class="grid grid-cols-2">
				<input class="input w-fill-available moz-available m-2" title="First Name" type='text' bind:value={fname} placeholder='Your First Name' />
				<input class="input w-fill-available moz-available m-2" title="Last Name" type='text' bind:value={lname} placeholder='Your Last Name' />
			</div>
			<input class="input m-2" title="Email" type='email' bind:value={email} placeholder='Your Email' />
			<input class="input m-2" title="Password" type='password' bind:value={password} placeholder='Your Password' />
	</Step>
		<Step class="m-8">
			<h3 class="h3 text-center">Are you a student or a teacher?</h3>

			<div class="flex flex-row place-content-between justify-center w-full">
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
		</Step>
		<Step locked={schid === -1} class="m-8">
			<svelte:fragment slot="header">School Info</svelte:fragment>

			{#if !isStudent}
				<!-- We want to open a new tab (_blank) so that they can return to the one -->
				<a class="btn variant-filled-error h3 text-center" href={dev? "/register":"/register.html"} target="_blank">
					Don't see your School Here?
				</a>
			{/if}
		
			<input class="input m-2" type="search" name="School Name" bind:value={school} placeholder="Search...." />
		
			<!--<div class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto" tabindex="-1">-->
			<Autocomplete class="card w-auto p-4 max-h-48 overflow-y-auto" tabindex="-1" bind:input={school} options={schoolOptions} on:selection={onSchoolSelection} />
		</Step>
		<Step locked={!signupcode} class="m-8">
			<svelte:fragment slot="header">Email Signup Code</svelte:fragment>
			<input class="input m-2" type="text" name="Code" bind:value={signupcode} placeholder="Code from your Email!" />
		</Step>
	</Stepper>
</div>