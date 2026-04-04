import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      <header className="py-6 px-6 border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto">
          <Link href="/fr" className="text-xl font-bold tracking-tight">
            <span className="text-white">Spoof</span>
            <span className="text-emerald-400">Check</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-6xl font-bold text-emerald-400">404</h1>
          <p className="text-xl text-zinc-300">
            Page not found — Page introuvable
          </p>
          <p className="text-zinc-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/en"
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              Test a domain
            </Link>
            <Link
              href="/fr"
              className="inline-flex items-center h-11 px-8 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-colors"
            >
              Tester un domaine
            </Link>
            <Link
              href="/en/guides"
              className="inline-flex items-center h-11 px-8 rounded-xl border border-zinc-700 text-zinc-300 font-medium text-sm hover:border-zinc-500 hover:text-zinc-100 transition-colors"
            >
              Guides
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
