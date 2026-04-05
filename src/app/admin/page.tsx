import { getDomainsChecked, getAllDomainData, getChecksTimeline } from "@/lib/redis";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;

  if (token !== process.env.ADMIN_TOKEN) {
    return <AdminLogin />;
  }

  const since48h = Date.now() - 48 * 3600000;

  const [totalChecks, domains, timeline] = await Promise.all([
    getDomainsChecked(),
    getAllDomainData(),
    getChecksTimeline(since48h),
  ]);

  return (
    <AdminDashboard
      totalChecks={totalChecks}
      domains={domains}
      timeline={timeline}
      token={token as string}
    />
  );
}
