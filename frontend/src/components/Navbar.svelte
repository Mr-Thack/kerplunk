<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, LightSwitch } from '@skeletonlabs/skeleton';
  import { userDataStore } from '$lib/stores'
  import { logout } from '$lib/auth';
  import { onDestroy } from 'svelte';
  
  var token = "";
  const unsub = userDataStore.subscribe(v => {
    token = v? v.token: ""
  })

  onDestroy(unsub); // When this component is destroyed, unsubscribe from the store


  var isLoggedIn = false;
  // I wanted to have this isLoggedIn function in $lib/auth, but it's not playing nice with Svelte Stores


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
    new Page('/chatrooms', 'Chat!', 'chat'),

    new Page('/login', 'Login!', 'login'),
    // the logic of swapping between login and signup is handled in the markup
    new Page('/signup', 'Sign Up!', 'person_add')
  ];

  function removePage(arr: Page[], pages: string[]) {
    // the name page is reserved for the current page
    for (let p of pages) {
      for (var i=0; i<arr.length; i++) {
        if (arr[i].url == p) {
          arr.splice(i, 1);  // = arr.remove(i) in Python
        }
      }
    }
  }

  var navs = ALLNAVS;
  // Checking token's status is like checking if they're logged in
  $: {
    if (token !== undefined && token !== "") {
      isLoggedIn = true;
      navs = ALLNAVS.slice(); // clone instead of copy
      removePage(navs,['/signup', '/login'])
      // Twice because signup and login at the end
    } else {
      isLoggedIn = false;
      navs = ALLNAVS.slice(); // clone instead of copy
      removePage(navs, [
        '/chatrooms',
        $page.url.pathname === "/login"? '/signup':''
      ])
    }
    navs = navs;
  }
</script>


<AppRail class="w-auto h-auto">
  <svelte:fragment slot="lead">
    <!-- If you're logged in, we want you to go to home instead of the front page -->
    <AppRailAnchor href={isLoggedIn? "/home":"/"}>
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

  {#if isLoggedIn}
    <AppRailAnchor>
      <button type="button" class="btn-icon variant-filled material-symbols-outlined" on:click={logout}>
        logout
      </button>
    </AppRailAnchor>
  {/if}
  <AppRailAnchor>
    <LightSwitch class="mx-auto mb-4 mt-2"/>
    <button type="button" class="btn-icon variant-filled mb-2 material-symbols-outlined">palette</button>
  </AppRailAnchor>
</AppRail>
