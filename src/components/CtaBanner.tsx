"use client";

import Link from "next/link";

interface CtaBannerProps {
  domain: string;
  spoofable: boolean;
  score: number;
  lang: string;
  dict: {
    title: string;
    subtitle: string;
    price: string;
    button: string;
  };
}

export default function CtaBanner({ domain, spoofable, score, lang, dict }: CtaBannerProps) {
  if (!spoofable && score >= 70) return null;

  return (
    <div className="relative rounded-xl p-[1px] bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-fade-up">
      <div className="rounded-xl bg-zinc-900 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-red-400">
            {dict.title}
          </h3>
          <p className="text-sm text-zinc-300">
            {dict.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 shrink-0">
          <span className="text-2xl font-bold text-white">
            {dict.price}
          </span>
          <Link
            href={`/${lang}/contact?domain=${encodeURIComponent(domain)}`}
            className="h-11 px-6 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center whitespace-nowrap"
          >
            {dict.button}
          </Link>
        </div>
      </div>
    </div>
  );
}
