<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, LightSwitch } from '@skeletonlabs/skeleton';

  let navs = [['chatrooms','Chat!'],['login','Login!']];
</script>


<AppRail>
  <svelte:fragment slot="lead">
    <AppRailAnchor href="/">
      <img src="/icon.jpg" alt="icon" style="width: auto; height: auto; max-height: 50%" />
    </AppRailAnchor>
  </svelte:fragment>
  
  {#each navs as n}
    <AppRailAnchor href={n[0]} selected={$page.url.pathname === '/' + n[0]}>
      <svelte:fragment slot="lead">(ICON)</svelte:fragment>
      <span>{n[1]}</span>
    </AppRailAnchor>
  {/each}

  <div class="lightswitch">
    <LightSwitch />
  </div>
</AppRail>
