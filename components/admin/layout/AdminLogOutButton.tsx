"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

function AdminLogOutButton() {
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-900 border border-slate-700 hover:border-slate-600 rounded-md transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}

export default AdminLogOutButton;
