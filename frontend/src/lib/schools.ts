import { get } from '$lib/endpoint';
import { userDataStore } from '$lib/stores';


export type School = {
  name: string;
  altnames: Array<string>;
  email: string;
}

export async function getSchool(schid: number) : Promise<School> {
  return (await get('schools/' + schid, {}, userDataStore.get('token'))).data;
}
