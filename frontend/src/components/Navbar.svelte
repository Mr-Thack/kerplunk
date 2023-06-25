<script lang='ts'>
  import { page } from '$app/stores';
	import { AppRail, AppRailAnchor, Drawer, drawerStore, Avatar } from '@skeletonlabs/skeleton';
  import type { DrawerSettings } from '@skeletonlabs/skeleton';
  import { userDataStore } from '$lib/stores'
  import { logout } from '$lib/auth';
  import { goto } from '$app/navigation';
  import getSettings from '$lib/settings';
  import { get } from '$lib/endpoint'
	import { salert } from '$library/alerts';


  
  let schoolName = '', name= '';
  let photoData = "";
  
  var isLoggedIn = false;
  // I wanted to have this isLoggedIn function in $lib/auth, but it's not playing nice with Svelte Stores

  var accent = 'red';

  async function change() {
    const rez = await getSettings(['accent']);
    if (!rez.error) {
      // @ts-ignore
      accent = rez.data.accent;
    }
  }

  class Page {
    url: string;
    alturl: string;
    name: string;
    icon: string;

    // This seems verbose...
    constructor(u: string, n: string, i: string, au?: string) {
      this.url = u;
      this.name = n;
      this.icon = i;
      this.alturl = au? au: u;
    }

  }


  const ALLNAVS = [
    new Page('/chatrooms', 'Chat', 'chat', '/chat'),
    new Page('/classrooms', 'Classes', 'school', '/class'),
    new Page('/login', 'Login', 'login'),
    new Page('/signup', 'Sign Up', 'person_add')
  ];

  function removePages(arr: Page[], pages: string[]) {
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
    if ($userDataStore.token) {
      // These print the same result, so I'm going to use the 2nd
      // console.log($userDataStore.token !== undefined && $userDataStore.token !== "");
      // console.log(Boolean($userDataStore.token));
      isLoggedIn = true;
      navs = ALLNAVS.slice(); // clone instead of copy
      removePages(navs,[
        '/signup',
        '/login'
      ]);
      change();
      // Twice because signup and login at the end
    } else {
      isLoggedIn = false;
      navs = ALLNAVS.slice(); // clone instead of copy
      removePages(navs, [
        '/chatrooms',
        '/classrooms',
        $page.url.pathname === "/login"? '/signup':''
      ])
    }
    navs = navs;
  }

  async function openDrawer() {
    const drawerSettings: DrawerSettings = {
      id: 'drawer_account',
	    width: 'w-[280px] md:w-[480px]',
	    padding: 'p-4',
	    rounded: 'rounded-xl'
    };
    drawerStore.open(drawerSettings);

    const rez = await getSettings(["name", "photo", "schid"]);
    if (rez !== undefined && !rez.error) {
      // @ts-ignore
      name = rez.data.name;
      // @ts-ignore
      const schools = (await get('schools')).data.schools;
      // This will break unless the school ids line up with the id saved with the user
      // Make sure to make the school id the location in the array
      // @ts-ignore
      schoolName = (await get('schools/'+rez.data.schid, {}, $userDataStore.token)).data.name;
      // @ts-ignore
      photoData = rez.data.photo;
    } else {
      salert("The server cannot be reached. Check your internet connection.")
    }
  }

  function openSettings() {
    goto("/settings")
    drawerStore.close();
  }
  
  class DrawerBtn {
    text: string;
    icon: string;
    func: () => void;

    constructor(t: string, i: string, f: () => void) {
      this.text = t;
      this.icon = i;
      this.func = f;
    }
  }

  const drawerBtns = [
    new DrawerBtn("Settings", "settings", openSettings),
    new DrawerBtn("Sign Out", "logout", logout)
  ];
</script>

<Drawer>
	{#if $drawerStore.id === 'drawer_account'}
    <div class="justify-center">
      <div class="rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 py-4 mb-8">
        {#if photoData}
          <Avatar src={photoData} width="w-40" rounded="rounded-full" class="mx-auto"/>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px" fill="#FFFFFF"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        {/if}
      </div>
      <h2 class="h2 text-center mb-8 max-w-md mx-auto font-medium h-10">{name}</h2>
      <h3 class="h3 text-center mb-4 max-w-md mx-auto h-8">{schoolName}</h3>
      <div class="flex justify-center m-12">
        {#each drawerBtns as btn}
          <button type="button" class="btn variant-filled-primary mx-auto" on:click={btn.func}>
            <span class="material-symbols-outlined">{btn.icon}</span>
            <span>{btn.text}</span>
          </button>
        {/each}
      </div>
    </div>
	{:else}
		<!-- (fallback contents) -->
	{/if}
</Drawer>

<AppRail class="w-auto h-auto hidden lg:block">
  <svelte:fragment slot="lead">
    <!-- If you're logged in, we want you to go to home instead of the front page -->
    <AppRailAnchor href={isLoggedIn? "/home":"/"} selected={$page.url.pathname === '/' || $page.url.pathname === '/home/'}>
      <img src={"/icon_"+accent+".png"} alt="icon" class="w-20 h-20 p-2 hover:p-0 transition-all" />
    </AppRailAnchor>
  </svelte:fragment>
  {#each navs as nav}
    <AppRailAnchor id={nav.icon} href={nav.url} selected={$page.url.pathname === nav.url + "/" || $page.url.pathname === nav.alturl + "/"}>
      <svelte:fragment slot="lead">
        <span class="material-symbols-outlined">
          {nav.icon}
        </span>
      </svelte:fragment>
      <span>{nav.name}</span>
    </AppRailAnchor>
  {/each}
  {#if isLoggedIn}
    <AppRailAnchor on:click={openDrawer} selected={$page.url.pathname === "/settings/"}>
      <svelte:fragment slot="lead">
        <span class="material-symbols-outlined">
          account_circle
        </span>
      </svelte:fragment>
      <span>Account</span>
    </AppRailAnchor>
  {/if}
</AppRail>