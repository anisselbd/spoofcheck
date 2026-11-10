import { getDomainsChecked, getAllDomainData, getChecksTimeline, getGeoData, getCtaStats } from "@/lib/redis";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

const TIMELINE_WINDOW_MS = 48 * 3600000;

// L'instant de référence est fixé une seule fois par requête : il borne la
// lecture Redis et sert au découpage horaire de la frise côté client.
async function loadDashboard() {
  const now = Date.now();
  const [totalChecks, domains, timeline, geo, cta] = await Promise.all([
    getDomainsChecked(),
    getAllDomainData(),
    getChecksTimeline(now - TIMELINE_WINDOW_MS),
    getGeoData(),
    getCtaStats(now),
  ]);
  return { now, totalChecks, domains, timeline, geo, cta };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const adminToken = process.env.ADMIN_TOKEN;

  // Sans ADMIN_TOKEN configuré, `undefined !== undefined` laisserait passer
  // une requête sans jeton : on refuse explicitement.
  if (!adminToken || token !== adminToken) {
    return <AdminLogin />;
  }

  const data = await loadDashboard();

  return <AdminDashboard {...data} />;
}
