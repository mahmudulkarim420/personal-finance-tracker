export type UserRole = "user" | "admin";

export interface CustomJwtPayload {
  publicMetadata: {
    role?: UserRole;
  };
}
