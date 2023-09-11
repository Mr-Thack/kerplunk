<script lang="ts">
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import zxcvbn from 'zxcvbn';

    export var pwd: string, pwdScore: number = 0, pwdGood: boolean;

    var suggestions: Array<string> = [],
        pwdScoreColor = "",
        pwdScoreText = "",
        repPwd = "",
        pwdMatch = "";


    const MINREQ = 4;
    const options = [
        ['bg-error-900'  , 'Poor'],
        ['bg-warning-900', 'OK'],
        ['bg-warning-900', 'OK'],
        ['bg-success-900', 'Good'],
        ['bg-success-900', 'Great']
    ];


    function pwdCheck() {
        if (pwd) {
            let result = zxcvbn(pwd);
            
            let tmp: Array<string> = [];
            tmp = (typeof(result.feedback.warning) === 'string')?
                [result.feedback.warning]
                : tmp.concat(result.feedback.warning);

            tmp = tmp.concat(result.feedback.suggestions);
            suggestions = tmp;

            pwdScore = result.score + 1;
            
            pwdScoreColor = options[pwdScore-1][0];
            pwdScoreText = options[pwdScore-1][1];
            
            let pwdMatches = pwd === repPwd;
            pwdMatch = pwdMatches? "✔": "✖";
            pwdGood = pwdScore >= MINREQ && pwdMatches;
        } else {
            suggestions = [];
            pwdScore = 0;
            pwdScoreText = "";
            pwdMatch = "";
            pwdGood = false;
        }
    }


</script>
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
    {#if pwd}
        <div class="input-group-shim">
            <p class="my-auto text-xl">{pwdMatch}</p>
        </div>
    {/if}
</div>
