import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users, Shield } from "lucide-react";
import { getAdminUsers } from "@/actions/admin";
import UserTable from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-sm">
            <Users className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">User Management</h1>
            <p className="text-[12px] text-slate-500 font-medium">
              Manage roles and accounts · {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-[18px] border border-amber-100 bg-amber-50 px-5 py-3.5 shadow-sm">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" strokeWidth={1.5} />
        <p className="text-[12px] leading-relaxed text-amber-700 font-medium">
          <strong className="font-bold text-amber-800 uppercase tracking-wider text-[10px] mr-1.5">Privacy boundary enforced.</strong>{" "}
          Only email, role, join date, and transaction count are shown.
          Descriptions, amounts, budgets, and goals are never surfaced here.
        </p>
      </div>

      {/* Interactive table (client component) */}
      <UserTable initialUsers={users} />
    </div>
  );
}
