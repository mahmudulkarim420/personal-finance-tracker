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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-purple-500/25 bg-purple-500/10">
            <Users className="h-5 w-5 text-purple-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">User Management</h1>
            <p className="text-[12px] text-neutral-600">
              Manage roles and accounts · {users.length} registered user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-[18px] border border-amber-500/15 bg-amber-500/[0.06] px-5 py-3.5">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-500/70" strokeWidth={1.5} />
        <p className="text-[12px] leading-relaxed text-amber-500/70">
          <strong className="font-semibold text-amber-500/90">Privacy boundary enforced.</strong>{" "}
          Only email, role, join date, and transaction count are shown.
          Descriptions, amounts, budgets, and goals are never surfaced here.
        </p>
      </div>

      {/* Interactive table (client component) */}
      <UserTable initialUsers={users} />
    </div>
  );
}
