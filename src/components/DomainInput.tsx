"use client";

import { useState } from "react";
import { cleanDomain, isValidDomain } from "@/lib/validators";

interface DomainInputProps {
  onCheck: (domain: string) => void;
  loading: boolean;
  dict: {
    placeholder: string;
    invalidDomain: string;
    analyzing: string;
    check: string;
  };
}

export default function DomainInput({ onCheck, loading, dict }: DomainInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const domain = cleanDomain(value);
    if (!isValidDomain(domain)) {
      setError(dict.invalidDomain);
      return;
    }
    setError("");
    onCheck(domain);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          placeholder={dict.placeholder}
          className="flex-1 h-14 px-5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-500 neon-input text-lg transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="h-14 px-8 rounded-xl bg-white text-zinc-900 font-semibold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {dict.analyzing}
            </span>
          ) : (
            dict.check
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
