<script lang="ts">
	import Navbar from '$components/Navbar.svelte';
	import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	
		
	import { AppShell } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton'
</script>


<Modal />

<AppShell slotSidebarLeft="p-4">
	<svelte:fragment slot="sidebarLeft">
		<Navbar/>
	</svelte:fragment>

	<div class="h-full w-full">
		<slot />
	</div>
	<!-- Put this down when we have a footer!
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
	-->
</AppShell>
