import Goals from "@/components/goals/Goals";
import { checkUser } from "@/actions/checkUser";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function GoalsPage() {
  await checkUser();
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const goals = await db.goal.findMany({
    where: { clerkId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <Goals initialGoals={goals} />
    </div>
  );
}
