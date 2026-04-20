"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Checks if the currently logged-in Clerk user exists in our Prisma database.
 * If they do not exist, it creates a new record for them.
 * 
 * @returns The user object from the database, or null if no Clerk user is found.
 */
export const checkUser = async () => {
  // Get the logged-in user from Clerk
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // Check if a user with that clerkId already exists in our database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  // If the user exists, return the user object
  if (loggedInUser) {
    return loggedInUser;
  }

  // If the user doesn't exist, create a new record in the User table
  const newUser = await db.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newUser;
};
