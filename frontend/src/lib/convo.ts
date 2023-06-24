import getSettings from '$lib/settings';











export async function getUserInfo() {
  return await get("users");
}
