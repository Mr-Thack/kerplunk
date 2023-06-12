import { userDataStore } from '$lib/stores';
import { get } from '$lib/endpoint'


export default async function getSettings(settings: [string]) {
  return await get('userme', {
    'fields': settings
  }, $userDataStore.token);
}
