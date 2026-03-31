import { getDomainsChecked } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await getDomainsChecked();
  return Response.json({ domainsChecked: count });
}
