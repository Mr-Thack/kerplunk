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


<div class="space-y-0 grid text-left mx-auto rounded-none">
  <header class="flex flex-row px-auto py-1 justify-center">
    <div class="flex flex-col p-2 space-x-4">
      <div class="flex flex-row">
        <KAvatar src={src} />
        <p class="font-bold flex-grow mx-4 my-auto">{msg.author}</p>
        <p class="flex-initial align-right my-auto">{msg.elapsedTime()}</p>
      </div>
      <p class="mx-4 my-2 text-center">{msg.text}</p>
    </div>
  </header>

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
