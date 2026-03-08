"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  UserPlus,
  Trash2,
  Shield,
  ShieldCheck,
  Mail,
  User,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface AdminUser {
  _id: string;
  email: string;
  name: string;
  addedAt: string;
}

export default function AdminUsersPage() {
  const { user } = useUser();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [superAdmin, setSuperAdmin] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";

  const fetchAdmins = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch("/api/admin-users", {
        headers: { "x-admin-email": userEmail },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal memuat data");
      }
      const data = await res.json();
      setAdmins(data.admins);
      setSuperAdmin(data.superAdmin);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": userEmail,
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`${email} berhasil ditambahkan sebagai admin`);
      setEmail("");
      setName("");
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: string, adminEmail: string) => {
    if (!confirm(`Yakin ingin menghapus ${adminEmail} dari daftar admin?`)) {
      return;
    }

    setError("");
    setSuccess("");
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin-users?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-email": userEmail },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`${adminEmail} berhasil dihapus dari daftar admin`);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[900px] mx-auto flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-8 pt-2">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Admin Users
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Kelola email yang memiliki akses ke dashboard admin
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
            <ShieldCheck className="h-4.5 w-4.5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Super Admin</p>
            <p className="text-xs text-zinc-500">
              Tidak dapat diubah atau dihapus
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
          <Shield className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-mono text-amber-200">{superAdmin}</span>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-amber-500/60 bg-amber-500/10 px-2 py-0.5 rounded">
            Permanent
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5">
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
          Tambah Admin Baru
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3 h-3" />
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <User className="w-3 h-3" />
                Nama
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Admin"
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
            {submitting ? "Menambahkan..." : "Tambah Admin"}
          </button>
        </form>
      </div>

      <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.04]">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
            Daftar Admin ({admins.length})
          </h2>
        </div>

        {admins.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Shield className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">
              Belum ada admin yang ditambahkan
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Gunakan form di atas untuk menambahkan admin baru
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 shrink-0">
                    <User className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {admin.name}
                    </p>
                    <p className="text-xs text-zinc-500 font-mono truncate">
                      {admin.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-[10px] text-zinc-600 hidden sm:block">
                    {new Date(admin.addedAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(admin._id, admin.email)}
                    disabled={deleting === admin._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50"
                  >
                    {deleting === admin._id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
