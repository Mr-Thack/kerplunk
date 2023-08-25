<script lang="ts">
  export let msg: {
    text: string;
    humanTime: () => string;
  }



</script>

<div class="grid gap-4 text-center mx-auto">
  <!-- We can add avatars later.... -->
  <div class="border-0 space-y-2 w-full mt-4 variant-filled-surface p-2 w-9/12 mx-auto mb-4 rounded-xl">
    <p>{msg.text+" - "+msg.humanTime()}</p>
  </div>
</div>
