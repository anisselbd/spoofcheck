"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cleanDomain } from "@/lib/validators";
import DomainInput from "@/components/DomainInput";

interface HomeClientProps {
  lang: string;
  dict: {
    domainInput: {
      placeholder: string;
      invalidDomain: string;
      analyzing: string;
      check: string;
      unexpectedError: string;
    };
  };
}

export default function HomeClient({ lang, dict }: HomeClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheck(domain: string) {
    setLoading(true);
    setError("");

    try {
      const clean = cleanDomain(domain);
      router.push(`/${lang}/check/${encodeURIComponent(clean)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.domainInput.unexpectedError);
      setLoading(false);
    }
  }

  return (
    <>
      <DomainInput onCheck={handleCheck} loading={loading} dict={dict.domainInput} />

      {error && (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </>
  );
}
