export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Budgets & Limits
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Plan your spending and set limits for different categories.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center">
          <p className="text-neutral-500">Budget tracking coming soon...</p>
        </div>
      </div>
    </div>
  );
}
