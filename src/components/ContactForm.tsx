"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefillDomain = searchParams.get("domain") ?? "";

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [domaine, setDomaine] = useState(prefillDomain);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!nom.trim()) errs.nom = "Le nom est requis";
    if (!email.trim()) errs.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Email invalide";
    if (!domaine.trim()) errs.domaine = "Le domaine est requis";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, domaine, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || "Une erreur est survenue.");
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Impossible de contacter le serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-8 text-center space-y-3">
        <div className="text-3xl">&#10003;</div>
        <h3 className="text-lg font-semibold text-emerald-400">
          Demande envoyée !
        </h3>
        <p className="text-sm text-zinc-300">
          Nous vous recontactons sous 24h.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="nom" className="block text-sm font-medium text-zinc-300">
          Nom <span className="text-red-400">*</span>
        </label>
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="Votre nom"
        />
        {errors.nom && (
          <p className="text-xs text-red-400">{errors.nom}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="vous@exemple.fr"
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="domaine" className="block text-sm font-medium text-zinc-300">
          Domaine <span className="text-red-400">*</span>
        </label>
        <input
          id="domaine"
          type="text"
          value={domaine}
          onChange={(e) => setDomaine(e.target.value)}
          className="w-full h-11 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
          placeholder="exemple.fr"
        />
        {errors.domaine && (
          <p className="text-xs text-red-400">{errors.domaine}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300">
          Message <span className="text-zinc-500">(optionnel)</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
          placeholder="Décrivez votre besoin..."
        />
      </div>

      {serverError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-white text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
