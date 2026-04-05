"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [token, setToken] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        action="/admin"
        method="GET"
        className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 space-y-6"
      >
        <h1 className="text-xl font-bold text-center">SpoofCheck Admin</h1>
        <input
          type="password"
          name="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Token"
          className="w-full h-12 px-4 rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          autoFocus
        />
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition-colors"
        >
          Connexion
        </button>
      </form>
    </div>
  );
}
