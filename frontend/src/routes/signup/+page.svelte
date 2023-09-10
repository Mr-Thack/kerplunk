<script lang="ts">
	import { Stepper, Step, modalStore, type ModalSettings, RadioGroup, RadioItem, type AutocompleteOption, Autocomplete, ProgressBar } from '@skeletonlabs/skeleton';
	import zxcvbn from 'zxcvbn';
	import { goto } from '$app/navigation';
	import { get, post } from '$lib/endpoint';
	import { checkCredentials } from '$lib/auth';
	import { salert } from '$lib/alerts';
	import { onMount, onDestroy } from 'svelte';
	import isValidEmail from "$lib/email";
	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	// We just need to initialize them to avoid errors
	// school is the actual data they wrote to input,
	// whereas schid is the ID# of the school they chose
	let fname = '', lname = '', email = '',
		  pwd = '', repPwd = '', school = '', schid = -1, isStudent = false, signupcode = '', page:HTMLElement, sstep:Stepper;
	let suggestions: Array <string> = [];  
	const MINREQ = 4; // Minimum required score for signup (on scale 1-5)


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

  var pwdScoreText = '', pwdScoreColor = '', pwdScore:number = 0,
  pwdMatch = '', passStep = false;

	
	function checkUserDetails()
	{
		// source: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
		let isEmailGood = isValidEmail(email);
		let doesPasswordMatch = pwd === repPwd;
		let score = zxcvbn(pwd).score + 1;
		let isScoreGood = score >= MINREQ
		// ZXCVBN normally returns on scale 0-4, add 1 to get scale 1-5


		if (!isEmailGood) {
			salert("Check the Spelling of Your Email!");
		} else {
			if (doesPasswordMatch) {
				let body = "On a scale from 1 to 5, your password got a " + score + "!"
				if (score < MINREQ) {
					salert("Try a Stronger Password...", body)
				} else {
					salert("Great!", body)
				}
			} else {
				salert("The password doesn't match.");
			}


		}
		
		return isEmailGood && isScoreGood && doesPasswordMatch;
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
			await checkCredentials(email, pwd);
			modalStore.trigger(successSignupModal);
		}
	}
	
	async function startSignup() {
		// @ts-ignore
		const rez = await post('signup', {
			'fname': fname,
			'lname': lname,
			'pwd': pwd,
			'email': email,
			'schid': schid,
			'student': isStudent
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
		console.log('1111111')
		if (document.visibilityState === "visible") {
			let tmp = await get('schools');

			schoolOptions = [];
			if (tmp.error) {
				console.log('halllp')
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
				console.log(schoolOptions);
			}
		}
	}

	function pwdCheck() {
		if (pwd) {
			let result = zxcvbn(pwd);
			let tmp: Array <string> = [];
			if (typeof(result.feedback.warning) === 'string' || result.feedback.warning instanceof String) {
					tmp = [result.feedback.warning];
			} else {
					tmp = tmp.concat(result.feedback.warning);
			}
			tmp = tmp.concat(result.feedback.suggestions);
			suggestions = tmp;
			pwdScore = result.score + 1;
			let options = [
				['bg-error-900', 'Poor'],
				['bg-warning-900', 'OK'],
				['bg-warning-900', 'OK'],
				['bg-success-900', 'Good'],
				['bg-success-900', 'Great']
			];
			pwdScoreColor = options[pwdScore-1][0];
			pwdScoreText = options[pwdScore-1][1];
			let pwdMatches = pwd === repPwd;
			pwdMatch = pwdMatches? "✔": "✖";
			passStep = pwdScore >= 4 && pwdMatches;
		} else {
			pwdScore = 0;
			pwdScoreText = "";
			pwdMatch = "";
		}
	}
	window.addEventListener('resize', () => {
      if(window.innerWidth < 1024) {
        try {
          page.style.maxHeight = (window.innerHeight - 144).toString()+"px";
		  sstep.style.maxHeight = (window.innerHeight - 142).toString()+"px";
        } catch {
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

	function onStepHandler(e: {detail: {step: number, state: {current: number, total: number}}}): void {
		if (e.detail.step + 1 !== e.detail.state.current) {
			return;
		}

		switch(e.detail.step) {
			case 1:
				if (!checkUserDetails()) {
					e.detail.state.current = 1;
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
<div bind:this={page} class="w-full lg:h-fill flex items-center">
<!-- It complains on the next line that on:step function handler has a type mismatch, but it doesn't impact us -->
	<Stepper bind:this={sstep} on:complete={onCompleteHandler} on:step={onStepHandler} class="card p-4 w-full max-h-[calc(100vh-142px)] lg:max-h-full m-4">
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
		<Step locked={!(email && passStep && fname && lname)} class="m-4 max-h-[calc(100vh-220px)] overflow-auto">
			<svelte:fragment slot="header">Basic Info</svelte:fragment>
			<div class="grid grid-cols-2 w-full">
				<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="First Name" type='text' bind:value={fname} placeholder='Your First Name' />
				<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Last Name" type='text' bind:value={lname} placeholder='Your Last Name' />
			</div>
			<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Email" type='email' bind:value={email} placeholder='Your Email' />
			<input class="input w-fill-available moz-available m-2 text-xs h-8 lg:m-4 lg:text-base lg:h-10" title="Password" type='password' bind:value={pwd} on:input={pwdCheck} placeholder='Your Password' />
			<div class="flex justify-center">
				<ProgressBar label="Password Score" class="m-2 w-[50vw]" meter={pwdScoreColor} bind:value={pwdScore} max={5} />
				<p class="p">{pwdScoreText}</p>
			</div>
			<div>
				{#each suggestions as suggestion}
				<p class = "p"> {suggestion} </p>
				{/each}
			</div>
			<div class="input-group input-group-divider grid-cols-[1fr_auto] m-2 lg:m-4 w-fill-available moz-available">
				<input id="repeat-password" bind:value={repPwd} on:input={pwdCheck} class="input text-xs h-8 lg:text-base lg:h-10" title="Repeat Password" type='password' placeholder='Repeat Password' />
				<a>
					<p class="my-auto text-xl">{pwdMatch}</p>
				</a>
			</div>
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
