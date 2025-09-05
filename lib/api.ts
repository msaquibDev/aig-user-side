// lib/api.ts
export async function getRegistration(eventId: string, registrationId: string) {
  const res = await fetch(`/api/user/registration/${eventId}/${registrationId}`);
  if (!res.ok) throw new Error("Failed to fetch registration");
  const data = await res.json();
  return data.registration;
}
