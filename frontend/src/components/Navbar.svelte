<script lang='ts'>
    import { page } from '$app/stores';
    import { AppRail, AppRailAnchor, getDrawerStore, getModalStore } from '@skeletonlabs/skeleton';
    import type { DrawerSettings } from '@skeletonlabs/skeleton';
    import { userDataStore } from '$lib/stores'
    import getSettings from '$lib/settings';
    import Alerter from '$lib/alerter';
    import { getSchool } from '$lib/schools';
    import { base } from '$app/paths';

    const drawerStore = getDrawerStore();
    var isLoggedIn = false;
    // I wanted to have this isLoggedIn function in $lib/auth, but it's not playing nice with Svelte Stores

    const alerter = new Alerter(getModalStore());

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
            // Why hide signup?
            removePages(navs, [
                '/chatrooms',
                '/classrooms'
            ]);
        }
        navs = navs;
    }

    async function openDrawer() {
        const accountSettings : DrawerSettings = {
            id: 'drawerAccount',
            width: 'w-[280px] md:w-[480px]',
            padding: 'p-4',
            rounded: 'rounded-xl'
        };
        drawerStore.open(accountSettings);

        const rez = await getSettings(["name", "photo", "schid"]);
        if (rez !== undefined && !rez.error) {
            // @ts-ignore
            $userDataStore.name = rez.data.name;
            // @ts-ignore
            $userDataStore.school = (await getSchool(rez.data.schid)).name;
            // @ts-ignore
            $userDataStore.photo = rez.data.photo;
        } else {
            drawerStore.open(accountSettings);
            alerter.salert("The server cannot be reached. Check your internet connection.")
        }
    }
</script>

<AppRail class="w-auto h-auto hidden lg:block">
  <svelte:fragment slot="lead">
    <!-- If you're logged in, we want you to go to home instead of the front page -->
    <AppRailAnchor href={base + (isLoggedIn? "/home":"/")} selected={$page.url.pathname === base + '/' || $page.url.pathname === base + '/home/'}>
      <img src={base + "/icon_"+$userDataStore.accent+".png"} alt="icon" class="w-20 h-20 p-2 hover:p-0 transition-all" />
    </AppRailAnchor>
  </svelte:fragment>
  {#each navs as nav}
    <AppRailAnchor id={nav.icon} href={base + nav.url} selected={$page.url.pathname === base + nav.url + "/" || $page.url.pathname === base + nav.alturl + "/"}>
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
