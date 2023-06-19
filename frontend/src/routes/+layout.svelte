<script lang="ts">
	import Navbar from '$components/Navbar.svelte';
	import '../app.postcss';
	import '../themes/theme_orange.postcss';
	import '../themes/theme_yellow.postcss';
	import '../themes/theme_green.postcss';
	import '../themes/theme_blue.postcss';
	import '../themes/theme_purple.postcss';
	import '../themes/theme_red.postcss';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import { onMount } from 'svelte';

	export function changeTheme() {
		console.log("ok")
		// switch (theme) {
		// 	case 0:
		// 		console.log("red");
		// 		theme ++;
		// 		break;
		// 	case 1:
		// 		console.log("orange");
		// 		theme ++;
		// 		break;
		// 	case 2:
		// 		console.log("yellow");
		// 		theme ++;
		// 		break;
		// 	case 3:
		// 		console.log("green");
		// 		theme ++;
		// 		break;
		// 	case 4:
		// 		console.log("blue");
		// 		theme ++;
		// 		break;
		// 	case 5:
		// 		console.log("purple");
		// 		theme = 0;
		// 		break;
		// 	default:
		// 		console.log("red");
		// 		theme = 1;
		// 		break;
		// }
	}

	import { AppShell } from '@skeletonlabs/skeleton';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton'

</script>


<Modal />

<AppShell slotSidebarLeft="p-4">
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
