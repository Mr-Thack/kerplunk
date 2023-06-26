<script lang='ts'>
  import KAvatar from '$components/KAvatar.svelte';
  
  
  export let isThisUser: boolean;
  export let src: string;
  
  // I tried to import Message and give that type, but it wouldn't work
  export let msg: {
    text: string
    author: string;
    humanTime(): string;
  };


</script>
<!-- Maybe there's a better way to do this, but I only know this way -->
<div class="grid lg:gap-2"
     class:grid-cols-[1fr_auto_auto]={isThisUser}
     class:grid-cols-[auto_auto_1fr]={!isThisUser}
     class:justify-items-end={isThisUser}
     class:text-right={isThisUser}
     class:text-left={!isThisUser}>

  {#if !isThisUser}  
    <KAvatar src={src} />
  {/if}
  
  <div class="card p-2 lg:p-4 space-y-2"
       class:rounded-tr-none={isThisUser}
       class:rounded-tl-none={!isThisUser}
       class:variant-filled-primary={isThisUser}
       class:variant-soft={!isThisUser}>
    <header class="flex justify-between items-center">
      <p class="font-bold text-xs lg:text-base mr-4">{msg.author}</p>
      <p class="text-xs lg:text-base">{msg.humanTime()}</p>
    </header>
    <p class="text-xs lg:text-base">{msg.text}</p>
  </div>

  {#if isThisUser}
    <KAvatar src={src} />
  {/if}
</div>
