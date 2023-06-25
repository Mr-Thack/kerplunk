<script lang="ts">
	import { page } from "$app/stores";
	import { TabGroup, TabAnchor, Tab, drawerStore, Drawer, Avatar } from "@skeletonlabs/skeleton";
    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import { userDataStore } from '$lib/stores'
    import { logout } from '$lib/auth';
    import { goto } from '$app/navigation';
    import getSettings from '$lib/settings';
    import { get } from '$lib/endpoint'
	import { salert } from '$library/alerts';
    import AppDrawer from '$components/AppDrawer.svelte';

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
    var drawerSettings: DrawerSettings;
    if (window.innerWidth <= 639) {
        drawerSettings = {
            id: 'drawer_account',
            width: 'w-screen',
            height: 'h-[380px]',
            padding: 'p-4',
            rounded: 'rounded-xl',
            position: 'bottom'
        };
    } else {
        drawerSettings = {
            id: 'drawer_account',
            width: 'w-[340px]',
            height: 'h-[78vh]',
            padding: 'p-4',
            rounded: 'rounded-xl',
            position: 'left'
        };
    }
    drawerStore.open(drawerSettings);
  }
</script>
<TabGroup 
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full block lg:hidden">
        <!-- If you're logged in, we want you to go to home instead of the front page -->
        <TabAnchor class="max-w-[94px] transition-all" padding='px-2 py-0'href={isLoggedIn? "/home":"/"} selected={$page.url.pathname === '/' || $page.url.pathname === '/home/'}>
          <img src={"/icon_"+accent+".png"} alt="icon" class="my-2" />
        </TabAnchor>
      {#each navs as nav}
        <TabAnchor class="max-w-[94px]" id={nav.icon} href={nav.url} selected={$page.url.pathname === nav.url + "/" || $page.url.pathname === nav.alturl + "/"}>
            <span class="material-symbols-outlined">
              {nav.icon}
            </span>
            <div class="min-w-[54px]">
                <span>{nav.name}</span>
            </div>
        </TabAnchor>
      {/each}
      {#if isLoggedIn}
        <TabAnchor class="max-w-[94px]" on:click={openDrawer} selected={$page.url.pathname === "/settings/"}>
            <span class="material-symbols-outlined">
              account_circle
            </span>
            <div class="min-w-[62px]">
                <span>Account</span>
            </div>
        </TabAnchor>
      {/if}
</TabGroup>