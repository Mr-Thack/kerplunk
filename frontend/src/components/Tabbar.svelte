<script lang="ts">
  import { page } from "$app/stores";
  import { TabGroup, TabAnchor, getDrawerStore } from "@skeletonlabs/skeleton";
  import type { DrawerSettings } from '@skeletonlabs/skeleton';
  import { userDataStore } from '$lib/stores'
  import getSettings from '$lib/settings';
  import { base } from '$app/paths';

  const drawerStore = getDrawerStore();

  var isLoggedIn = false;
  // I wanted to have this isLoggedIn function in $lib/auth, but it's not playing nice with Svelte Stores

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
      // Twice because signup and login at the end
    } else {
      isLoggedIn = false;
      navs = ALLNAVS.slice(); // clone instead of copy
      removePages(navs, [
        '/chatrooms',
        '/classrooms',
        ($page.url.pathname === base + "/login")? '/signup':''
      ])
    }
    navs = navs;
  }

  async function openDrawer() {
    var drawerSettings: DrawerSettings;
    if (window.innerWidth <= 639) {
        drawerSettings = {
            id: 'drawerAccount',
            width: 'w-screen',
            height: 'h-[380px]',
            padding: 'p-4',
            rounded: 'rounded-xl',
            position: 'bottom'
        };
    } else {
        drawerSettings = {
            id: 'drawerAccount',
            width: 'w-[340px]',
            height: 'h-full',
            padding: 'p-4',
            rounded: 'rounded-xl',
            position: 'left'
        };
    }
    drawerStore.open(drawerSettings);
  }
</script>
<div class="m-4" class:hidden={$page.url.pathname=== base + "/chat/"||$page.url.pathname=== base + "/class/"}>
  <TabGroup 
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full block lg:hidden">
      <!-- If you're logged in, we want you to go to home instead of the front page -->
      <TabAnchor class="max-w-[94px] transition-all" padding='px-2 py-0' href={base + (isLoggedIn? "/home":"/")} selected={$page.url.pathname === base + '/' || $page.url.pathname === base + '/home/'}>
        <img src={base + "/icon_"+$userDataStore.accent+".png"} alt="icon" class="my-1 mx-auto w-14 h-14" />
      </TabAnchor>
      {#each navs as nav}
        <TabAnchor class="max-w-[94px]" id={nav.icon} href={base + nav.url} selected={$page.url.pathname === base + nav.url + "/" || $page.url.pathname === base + nav.alturl + "/"}>
            <span class="material-symbols-outlined">
              {nav.icon}
            </span>
            <div class="min-w-[54px]">
                <span>{nav.name}</span>
            </div>
        </TabAnchor>
      {/each}
      {#if isLoggedIn}
        <TabAnchor class="max-w-[94px]" on:click={openDrawer} selected={$page.url.pathname === base + "/settings/"}>
            <span class="material-symbols-outlined">
              account_circle
            </span>
            <div class="min-w-[62px]">
                <span>Account</span>
            </div>
        </TabAnchor>
      {/if}
</TabGroup>
</div>
