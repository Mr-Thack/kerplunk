import AppDrawer from "./AppDrawer.svelte";
import {describe, expect, it} from 'vitest';
import { render } from '@testing-library/svelte';
import { drawerStore } from "@skeletonlabs/skeleton";  
import type { DrawerSettings } from '@skeletonlabs/skeleton';
import { userDataStore } from '$lib/stores';

describe("Test AppDrawer", () => {
    it("should load from userDataStore properly", () => {
        // This will fail due to vitest not being seen as a browser
        userDataStore.write("name", "name");
        userDataStore.write("school", "school");
        const accountSettings : DrawerSettings = {
            id: 'drawerAccount',
              width: 'w-[280px] md:w-[480px]',
              padding: 'p-4',
              rounded: 'rounded-xl'
          };
          drawerStore.open(accountSettings);
        const { getByText } = render(AppDrawer);
        expect(getByText(/name/i)).to.exist;
        expect(getByText(/school/i)).to.exist;
    })
})