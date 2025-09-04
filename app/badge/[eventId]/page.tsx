import { Badge } from "@/components/registrations/myRegistration/Badge";

async function getData(eventId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/registration/${eventId}`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch registration data");
  return res.json();
}

export default async function BadgePage({
  params,
}: {
  params: { eventId: string };
}) {
  const { registration, event } = await getData(params.eventId);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Your Conference Badge</h1>
      <Badge registration={registration} event={event} />
    </div>
  );
}
