<script lang='ts'>
  import KAvatar from "./KAvatar.svelte";
  export let msg: {
    author: string;
    text: string;
    elapsedTime: () => string;
    replies: Array<Number>;
    likes: number;
  }
  export let src: string;
  export let isReply = false;
  export let reply =  () => {};
  export let like = () => {};
</script>


<div class="card space-y-2 variant-soft grid gap-2 text-left mx-auto w-6/12">
  <header class="flex flex-row px-auto py-1 variant-filled-primary rounded-t justify-center">
    <div class="flex-initial align-left">
      <KAvatar src={src} />
    </div>
    <div class="flex-col px-2 my-auto">
      <p class="font-bold text-center flex-grow">{msg.author}</p>
      <p class="flex-initial align-right">{msg.elapsedTime()}</p>
    </div>
  </header>
  <p class="mx-4 py-4 text-center">{msg.text}</p>
  <footer class="flex flex-row place-content-evenly pb-4">
    <span class="chip variant-filled-error hover:variant-filled" on:click={() => like()} >
      <p> {msg.likes} </p> 
      <span class="material-symbols-outlined"> favorite </span>
    </span>
    {#if !isReply}
      <span class="chip variant-filled-secondary hover:variant-filled text-center" on:click={() => reply()}>Replies</span>
    {/if}
  </footer>
</div>
