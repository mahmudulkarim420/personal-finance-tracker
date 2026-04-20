import { LayoutDashboard, MoreVertical, Search, UserPlus } from "lucide-react";

export default function UserManagement() {
  const users = [
    { id: 1, name: "Alex Rivera", email: "alex@example.com", role: "admin", status: "Active" },
    { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "user", status: "Active" },
    { id: 3, name: "Marcus Wright", email: "marcus@example.com", role: "user", status: "Inactive" },
    { id: 4, name: "Elara Vance", email: "elara@example.com", role: "user", status: "Active" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-neutral-500">Manage system users and their permissions.</p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105 active:scale-95">
          <UserPlus className="h-4 w-4" />
          Add New User
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#0D0D0D] px-4 py-3">
        <Search className="h-5 w-5 text-neutral-500" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="flex-1 bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#0D0D0D]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="group transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-xs font-semibold text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                    <span className="text-neutral-300">{user.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-neutral-500 hover:text-white transition-colors">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
