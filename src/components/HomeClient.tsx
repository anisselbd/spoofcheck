"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cleanDomain } from "@/lib/validators";
import DomainInput from "@/components/DomainInput";

export default function HomeClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck(domain: string) {
    setLoading(true);
    setError("");

    try {
      const clean = cleanDomain(domain);
      router.push(`/check/${encodeURIComponent(clean)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inattendue");
      setLoading(false);
    }
  }

  return (
    <>
      <DomainInput onCheck={handleCheck} loading={loading} />

      {error && (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </>
  );
}
