<script lang="ts">

	import { AppShell, initializeStores, Modal, Toast } from '@skeletonlabs/skeleton';
    
    import { onMount } from 'svelte';
    
    import Tabbar from '$components/Tabbar.svelte';
	import AppDrawer from '$components/AppDrawer.svelte';
	import Navbar from '$components/Navbar.svelte';
    
    import { userDataStore } from '$lib/stores';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { subscribeNotificationStream } from '$lib/convo';
    import { getThemeAndAccent } from '$lib/theming';

	import '../themes/theme_red.postcss';
	import '../themes/theme_orange.postcss';
	import '../themes/theme_yellow.postcss';
	import '../themes/theme_green.postcss';
	import '../themes/theme_blue.postcss';
	import '../themes/theme_purple.postcss';
	import '../app.postcss';

    
    initializeStores();


    onMount(async () => {
        await getThemeAndAccent(); 

		if (!$userDataStore.token && $page.url.pathname !== "login") {
    	    goto(base + '/login')
  	    } else {
			subscribeNotificationStream();
		}
    });


</script>

<Modal />
<Toast />
<AppDrawer />

<AppShell slotSidebarLeft="lg:p-4 z-10">
	<svelte:fragment slot="sidebarLeft">
		<Navbar/>
	</svelte:fragment>

	<div class="h-full w-screen lg:w-full content-center text-center">
		<slot />
	</div>

	<svelte:fragment slot="pageFooter">
		<div class="lg:p-0 z-10">
			<Tabbar/>
		</div>
	</svelte:fragment>
</AppShell>
