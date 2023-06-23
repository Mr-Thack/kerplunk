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
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton'
	import getSettings from '$library/settings';
	import { onMount } from 'svelte';

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
	})


</script>


<Modal />

<AppShell slotSidebarLeft="p-4 z-10">
	<svelte:fragment slot="sidebarLeft">
		<Navbar/>
	</svelte:fragment>

	<div class="h-full w-full content-center text-center">
		<slot />
	</div>
	<!-- Put this down when we have a footer!
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
	-->
</AppShell>
