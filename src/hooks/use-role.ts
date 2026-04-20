import { useAuth } from "@clerk/nextjs";
import { UserRole } from "@/types/roles";

export function useRole() {
  const { isLoaded, sessionClaims } = useAuth();

  if (!isLoaded) {
    return {
      role: null,
      isLoaded: false,
      isAdmin: false,
    };
  }

  const role = sessionClaims?.metadata?.role as UserRole | undefined;

  return {
    role: role || "user",
    isLoaded: true,
    isAdmin: role === "admin",
  };
}
