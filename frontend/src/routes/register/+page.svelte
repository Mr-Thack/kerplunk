<script lang="ts">
  import { Stepper, Step, InputChip } from "@skeletonlabs/skeleton";
  import isValidEmail from "$lib/email";
  import { post } from '$lib/endpoint';
  import { salert } from "$lib/simpleAlert";
  
  let schoolName = "", schoolEmail = "";
  let altNames = ["high", "middle", "mtn"]; 
 
	async function onStepHandler(e: {detail: {step: number, state: {current: number, total: number}}}) {
		switch(e.detail.step) {
			case 0:
        let rz = await post('register', {
          'name': schoolName,
          'altnames': altNames,
          'email': schoolEmail
        });
        if (rz.status === 200) {
          salert("Go to the previous tab; you're done here!");
        } else {
          // @ts-ignore
          salert("An error has occured: " + rz.error.detail);
        }
        break;
		}
	}

</script>
<header class="mx-auto mb-5 text-center">
  <h2 class="h2">Signup!</h2>
</header>
<Stepper class="card p-4" on:step={onStepHandler}>
  <Step locked={!(schoolName && isValidEmail(schoolEmail))}>
    <svelte:fragment slot="header">Info</svelte:fragment>
    
    <input class="input m-2" title="School Name" type="text" bind:value={schoolName} placeholder="School Name" />
    <InputChip bind:value={altNames} name="altNames" placeholder="Enter Abbreviations or Alternative Names" />
    <input class="input m-2" title="Email" type="email" bind:value={schoolEmail} placeholder="School Email" />
  </Step>
  <Step>
    <svelte:fragment slot="header">Check Your Email</svelte:fragment>
    <h1 class="h1">For now, we're just gonna skip this</h1>
    
    <!-- Validate -->
  </Step>
</Stepper>
  

