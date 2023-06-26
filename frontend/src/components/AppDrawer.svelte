<script lang="ts">
	import { goto } from "$app/navigation";
	import { salert } from "$library/alerts";
	import { logout } from "$library/auth";
	import getSettings from "$library/settings";
	import { drawerStore, type DrawerSettings, Drawer, Avatar } from "@skeletonlabs/skeleton";
  import { userDataStore } from '$lib/stores'
  import { get } from '$lib/endpoint'

  let schoolName = '', name= '';
    let photoData = "";

  async function loadData() {

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

  loadData()

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
          <Avatar src={photoData} width="w-20 lg:w-40" rounded="rounded-full" class="mx-auto"/>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto" enable-background="new 0 0 20 20" height="196px" viewBox="0 0 20 20" width="196px" fill="#FFFFFF"><g><rect fill="none" height="20" width="20"/></g><g><g><path d="M10 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 11c-2.05 0-3.87-.95-5.07-2.44 1.45-.98 3.19-1.56 5.07-1.56s3.62.58 5.07 1.56c-1.2 1.49-3.02 2.44-5.07 2.44z"/></g></g></svg>
        {/if}
      </div>
      <h2 class="h3 lg:h2 text-center mb-4 max-w-md mx-auto font-medium h-10">{name}</h2>
      <h3 class="h4 lg:h3 text-center mb-3 max-w-md mx-auto h-8">{schoolName}</h3>
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