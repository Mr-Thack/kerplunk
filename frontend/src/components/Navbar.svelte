<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, LightSwitch } from '@skeletonlabs/skeleton';
  import { isLoggedIn } from '$library/stores';




  class Page {
    url: string;
    name: string;
    icon: string;

    // This seems verbose...
    constructor(u: string, n: string, i: string) {
      this.url = u;
      this.name = n;
      this.icon = i;
    }
  }


  const ALLNAVS = [
    new Page('chatrooms', 'Chat!', 'chat'),

    // [WARNING] Keep login and signup at the end
    // We use navs.pop() to get rid of login and signup when you're already logged in
    new Page('login', 'Login!', 'login'),
    // the logic of swapping between login and signup is handled in the markup
    new Page('signup', 'Sign Up!', 'person_add')
  ];

  var navs = ALLNAVS;
  if (isLoggedIn()) {
    navs.pop();
    navs.pop();
    // Twice because signup and login at the end
  } else if ($page.url.pathname === "login") {
    navs.pop();
  }
  navs = navs; // Trigger re-render
</script>


<AppRail class="w-auto h-auto">
  <svelte:fragment slot="lead">
    <AppRailAnchor href="/">
      <img src="/icon.jpg" alt="icon" class="w-20 h-20 p-2 hover:p-0 transition-all" />
    </AppRailAnchor>
  </svelte:fragment>
  
  {#each navs as nav}
    <AppRailAnchor href={nav.url} selected={$page.url.pathname === '/' + nav.url}>
      <svelte:fragment slot="lead">
        <span class="material-symbols-outlined">
          {nav.icon}
        </span>
      </svelte:fragment>
      <span>{nav.name}</span>
    </AppRailAnchor>
  {/each}

  <AppRailAnchor>
    <LightSwitch class="mx-auto"/>
  </AppRailAnchor>
</AppRail>
