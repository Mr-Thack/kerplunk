<script lang="ts">
  import { Stepper, Step, InputChip } from "@skeletonlabs/skeleton";
  import isValidEmail from "$lib/email";
  import { get, post } from '$lib/endpoint';
  import { salert, falert } from "$lib/simpleAlert";

  let schoolName = "", schoolEmail = "", signupcode="";
  let altNames = ["high", "middle", "mtn"]; 

  async function onComplete() {
    const rez = await get('register', {
      'code': signupcode
    });

    if (rez.status === 200) {
      falert("Congrats! You're done registering this school!", () => {
        window.close();
      });
    } else {
      // @ts-ignore
      salert("An error has occured: " + rez.error.detail)
    }
  }
 
	async function onStepHandler(e: {detail: {step: number, state: {current: number, total: number}}}) {
		if (e.detail.step !== 0 && e.detail.step + 1 !== e.detail.state.current) {
      return;
    }
    
    const rz = await post('register', {
      'name': schoolName,
      'altnames': altNames,
      'email': schoolEmail
    });

    if (rz.status === 200) {
      salert("Please check your email!");
    } else {
      // @ts-ignore
      salert("An error has occured: " + rz.error.detail);
    }
	}

</script>
<header class="mx-auto mb-5 text-center">
  <h2 class="h2">Signup!</h2>
</header>
<Stepper class="card p-4" on:complete={onComplete} on:step={onStepHandler}>
  <Step locked={!(schoolName && isValidEmail(schoolEmail))}>
    <svelte:fragment slot="header">Info</svelte:fragment>
    
    <input class="input m-2" title="School Name" type="text" bind:value={schoolName} placeholder="School Name" />
    <InputChip bind:value={altNames} name="altNames" placeholder="Enter Abbreviations or Alternative Names" />
    <input class="input m-2" title="Email" type="email" bind:value={schoolEmail} placeholder="School Email" />
  </Step>
  <Step locked={!signupcode}>
    <svelte:fragment slot="header">Check Your Email</svelte:fragment>

    <!-- I would componentize this, but I don't see this being used more than 3 times in our app -->
    <!-- That's probably not a good excuse though, is it? -->
    <input class="input m-2" type="text" name="Code" bind:value={signupcode} placeholder="Check your Email!" />    
  </Step>
</Stepper>
  

