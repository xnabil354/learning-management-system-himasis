"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, LogOut } from "lucide-react";

export default function UnauthorizedPage({ email }: { email?: string }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Akses Ditolak
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Anda tidak memiliki izin untuk mengakses halaman admin. Hanya email
            yang terdaftar oleh Super Admin yang dapat mengakses dashboard ini.
          </p>
          {email && (
            <p className="text-xs text-zinc-600 font-mono bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2 inline-block">
              {email}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all"
          >
            <LogOut className="w-4 h-4" />
            Ganti Akun
          </Link>
        </div>
      </div>
    </div>
  );
}
