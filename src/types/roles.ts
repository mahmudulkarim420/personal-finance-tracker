export type UserRole = "user" | "admin";

export interface CustomJwtPayload {
  metadata: {
    role?: UserRole;
  };
}
