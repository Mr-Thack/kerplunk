<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, LightSwitch, Drawer, drawerStore, Avatar } from '@skeletonlabs/skeleton';
  import type { DrawerSettings } from '@skeletonlabs/skeleton';
  import { userDataStore } from '$lib/stores'
  import { logout } from '$lib/auth';
  import { onMount, onDestroy } from "svelte";
  import { goto } from '$app/navigation';
  import getSettings from '$lib/settings';
  import { get } from '$lib/endpoint'
	import { salert } from '$library/alerts';

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

  var theme = 1;
  onMount (() => {
    document.documentElement.classList.add('red');
  })

  function changeTheme() {
    switch (theme) {
      case 0:
        document.documentElement.classList.remove('purple');
        document.documentElement.classList.add('red');
        theme ++;
        break;
      case 1:
        document.documentElement.classList.remove('red');
        document.documentElement.classList.add('orange');
        theme ++;
        break;
      case 2:
        document.documentElement.classList.remove('orange');
        document.documentElement.classList.add('yellow');
        theme ++;
        break;
      case 3:
        document.documentElement.classList.remove('yellow');
        document.documentElement.classList.add('green');
        theme ++;
        break;
      case 4:
        document.documentElement.classList.remove('green');
        document.documentElement.classList.add('blue');
        theme ++;
        break;
      case 5:
        document.documentElement.classList.remove('blue');
        document.documentElement.classList.add('purple');
        theme = 0;
        break;
      default:
        document.documentElement.classList.add('red');
        theme = 1;
        break;
    }
  }

  var rez;

  async function openDrawer() {
    const drawerSettings: DrawerSettings = {
      id: 'drawer_account',
      meta: { foo: 'bar', fizz: 'buzz', age: 40 },
	    width: 'w-[280px] md:w-[480px]',
	    padding: 'p-4',
	    rounded: 'rounded-xl'
    };
    drawerStore.open(drawerSettings);

    rez = await getSettings(["name", "photo", "schid"]);
    if (!(rez === undefined || rez.error === true)) {
          document.getElementById("name").innerHTML = rez.data.name
          var schools = await get('schools');
          // This will break unless the school ids line up with the id saved with the user
          // Make sure to make the school id the location in the array
          document.getElementById("school").innerHTML =schools.data.schools[rez.data.schid].name
          if (rez.data.photo === '') {
                document.getElementById('no-photo-nav').classList.toggle("hidden")
            } else {
                document.getElementById('photo-nav').src = rez.data.photo
                document.getElementById('photo-nav').parentNode.classList.toggle("hidden")
            }
        } else {
            salert("The server cannot be reached. Check your internet connection.")
        }
  }

  function openSettings() {
    goto("/settings")
    drawerStore.close();
  }
</script>

<Drawer>
	{#if $drawerStore.id === 'drawer_account'}
    <div class="justify-center">
      <div class="rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 py-4 mb-8">
        <svg id="no-photo-nav" xmlns="http://www.w3.org/2000/svg" class="mx-auto hidden" enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px" fill="#FFFFFF"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        <Avatar id="photo-nav" src="https://source.unsplash.com/YOErFW8AfkI/128x128" width="w-40" rounded="rounded-full" class="mx-auto hidden"/>
      </div>
      <h2 class="h2 text-center mb-4 max-w-md mx-auto font-medium h-10" id="name"></h2>
      <h3 class="h3 text-center mb-4 max-w-md mx-auto h-8" id="school"></h3>
      <div class="flex justify-center m-12">
        <button type="button" class="btn variant-filled-primary mx-auto" on:click={openSettings}>
        <span class="material-symbols-outlined">settings</span>
        <span>Settings</span>
      </button>
      <button type="button" class="btn variant-filled-primary mx-auto" on:click={logout}>
        <span class="material-symbols-outlined">logout</span>
        <span>Sign Out</span>
      </button>
    </div>
    </div>
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>

<AppRail class="w-auto h-auto">
  <svelte:fragment slot="lead">
    <!-- If you're logged in, we want you to go to home instead of the front page -->
    <AppRailAnchor href={isLoggedIn? "/home":"/"}>
      <img src="/icon.jpg" alt="icon" class="w-20 h-20 p-2 hover:p-0 transition-all" />
    </AppRailAnchor>
  </svelte:fragment>
  {#if isLoggedIn}
    <AppRailAnchor on:click={openDrawer}>
      <svelte:fragment slot="lead">
        <span class="material-symbols-outlined">
          account_circle
        </span>
      </svelte:fragment>
      <span>Account</span>
    </AppRailAnchor>
  {/if}
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
    <LightSwitch class="mx-auto mb-4 mt-2"/>
    <button type="button" class="btn-icon variant-filled-primary mb-2 material-symbols-outlined" on:click={changeTheme}>palette</button>
  </AppRailAnchor>
</AppRail>
