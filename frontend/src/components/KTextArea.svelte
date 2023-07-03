<script lang='ts'>
  import { onMount } from 'svelte';
  export let onclick: (s: string) => void;
  export let sendOnEnter: boolean;
  export let ontype: () => void;

  
  let bindTo: HTMLTextAreaElement;
  var value = "";
  onMount(() => {
    // Add an event listener for the input event
    bindTo.addEventListener('input', function() {
        
      // Reset the textarea's height
      this.style.height = 'auto';

        // Set the textarea's height to match its scrollHeight
        this.style.height = this.scrollHeight + 'px';
        ontype();
    });

    if (sendOnEnter) {
      bindTo.addEventListener('keypress', function(event) {
        if (event.key == "Enter") {
          event.preventDefault();
          onclick(value);
          value = "";
          this.style.height = '40px';
          ontype();
          console.log("ok")
        }
      });
    }
  });
</script>

<div class="input-group input-group-divider flex flex-shrink-0 rounded-container-token mt-4 mb-4">
  <textarea
    bind:this={bindTo}
    bind:value={value}
    class="bg-transparent border-0 ring-0 flex-grow h-fit overflow-hidden resize-none"
    name="prompt"
    placeholder="Message Here..."
    rows="1" />
  <button class="variant-filled-primary material-symbols-outlined h-100" on:click={() => {onclick(value); value="";}}>send</button>
</div>
