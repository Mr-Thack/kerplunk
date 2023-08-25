<script lang="ts">
	import Navbar from '$components/Navbar.svelte';
	import '../themes/theme_red.postcss';
	import '../themes/theme_orange.postcss';
	import '../themes/theme_yellow.postcss';
	import '../themes/theme_green.postcss';
	import '../themes/theme_blue.postcss';
	import '../themes/theme_purple.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { AppShell, setModeCurrent, setModeUserPrefers } from '@skeletonlabs/skeleton';
	import { Modal, Toast } from '@skeletonlabs/skeleton';
	import getSettings from '$library/settings';
	import { onMount } from 'svelte';
	import Tabbar from '$components/Tabbar.svelte';
	import AppDrawer from '$components/AppDrawer.svelte';

	import { userDataStore } from '$lib/stores';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { subscribeNotificationStream } from '$library/convo';

	onMount(async () => {
		var rez = await getSettings(["theme", 'accent']);
		if (!(rez === undefined || rez.error === true)) {
			document.documentElement.classList.add(rez.data.accent);
			let preferredMode = rez.data.theme === 1;
			setModeUserPrefers(preferredMode);
			setModeCurrent(preferredMode);
		} else {
			document.documentElement.classList.add('red');
			document.documentElement.classList.add('dark');
		}
		if (!$userDataStore.token && $page.url.pathname !== "login") {
    	goto(base + '/login')
  	} else {
			subscribeNotificationStream();
		}
	})


</script>

<Toast />
<Modal />
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

	<!-- Put this down when we have a footer!
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
	-->
</AppShell>
