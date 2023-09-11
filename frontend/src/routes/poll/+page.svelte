<script lang="ts">
    import { RadioGroup, RadioItem, Stepper, Step, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { post } from '$lib/endpoint';
    import Alerter from '$lib/alerter';
    import { onMount } from 'svelte';

    const modalStore = getModalStore();
    const alerter = new Alerter(modalStore);

    type Question = {
        question: string;
        answers: Array<string>;
        value: number;
        icons: Array<string>;
    }

    let questions: Array<Question> = [
        {
            question: "Are you a teacher or a student?",
            answers: [
                "Teacher",
                "Student"
            ],
            value: -1,
            icons: [
                "face_retouching_natural",
                "child_care"
            ]
        },
        {
            question: "On what device do you use Remind?",
            answers: [
                "Cellphone",
                "Tablet",
                "Desktop/Laptop"
            ],
            value: -1,
            icons: [
                "smartphone",
                "tablet",
                "computer"
            ]
        }
    ];

    onMount(async () => {
    
    })

    const isDone = 'IsKerplunkPollCompleted?';

    const thanksModal: ModalSettings = {
        type: 'alert',
        title: 'Thank you for your Response!',
        body: "We're redirecting you back to the homepage...",
        buttonTextCancel: "Let's Go!",
        response: async () => {
            let result = await post('poll', 
            questions.map(q => q.value)
        );
        if (!result.error) {
            localStorage.setItem(isDone, 'TRUE')
        }
            goto(base + '/');
        }
    }


    async function submitHandler() {
        modalStore.trigger(thanksModal);
    }

    if (localStorage.getItem(isDone) == 'TRUE') {
        alerter.falert("You've already answered this poll!", () => {
            goto(base + '/');
        });
    }
</script>

<div class="w-full h-[calc(100vh-144px)] lg:h-fill flex items-center">
  <Stepper stepTerm="Question" on:complete={submitHandler} class="card p-4 w-full max-h-[calc(100vh-144px)] lg:max-h-full m-4">
    {#each questions as q, i}
      <Step locked={q.value == -1}>
        <svelte:fragment slot="header">{q.question}</svelte:fragment>
        <span class="inline-flex content-between flex-col pb-4 align-center w-auto justify-center">
          <RadioGroup>
            {#each q.answers as ans, j}
              <RadioItem bind:group={q.value} name={"PollQuestion"+i} value={j}>
                {#if q.icons.length != 0} 
                  <span class="material-symbols-outlined">{q.icons[j]}</span>
                {/if}
                <h5 class="h5">{ans}</h5>
              </RadioItem>
            {/each}
          </RadioGroup>
        </span>
      </Step>
    {/each}
  </Stepper>
</div>
