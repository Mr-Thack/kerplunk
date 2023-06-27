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


<div class="card p-4 rounded-tl-none rounded-br-none space-y-2 variant-soft grid gap-2 text-left mx-auto w-6/12">
  <header class="flex flex-row">
    <div class="flex-initial align-left">
      <KAvatar src={src} />
    </div>
    <p class="font-bold text-center flex-grow">{msg.author}</p>
    <p class="flex-initial align-right">{msg.elapsedTime()}</p>
  </header>
  <p>{msg.text}</p>
  <footer class="flex flex-row place-content-evenly">
    <span class="chip variant-filled-error hover:variant-filled" on:click={() => like()} >
      <p> {msg.likes} </p> 
      <span class="material-symbols-outlined"> favorite </span>
    </span>
    {#if !isReply}
      <span class="chip variant-filled-secondary hover:variant-filled text-center" on:click={() => reply()}>Replies</span>
    {/if}
  </footer>
</div>
