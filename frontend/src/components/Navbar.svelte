<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, LightSwitch } from '@skeletonlabs/skeleton';

  let navs = [['chatrooms','Chat!','chat'],['login','Login!','login']];
</script>


<AppRail class="">
  <svelte:fragment slot="lead">
    <AppRailAnchor href="/">
      <img src="/icon.jpg" alt="icon" class="w-auto h-auto" />
    </AppRailAnchor>
  </svelte:fragment>
  
  {#each navs as n}
    <AppRailAnchor href={n[0]} selected={$page.url.pathname === '/' + n[0]}>
      <svelte:fragment slot="lead"><span class="material-symbols-outlined">{n[2]}</span></svelte:fragment>
      <span>{n[1]}</span>
    </AppRailAnchor>
  {/each}

  <div class="lightswitch m-4">
    <LightSwitch />
  </div>
</AppRail>
