"use server";

import { db } from "@/lib/db";
import { currentUser, auth } from "@clerk/nextjs/server";

/**
 * Checks if the currently logged-in Clerk user exists in our Prisma database.
 * If they do not exist, it creates a new record for them.
 * 
 * @returns The user object from the database, or null if no Clerk user is found.
 */
export const checkUser = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Check if a user with that clerkId already exists in our database
  const loggedInUser = await db.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  // If the user exists, return the user object
  if (loggedInUser) {
    return loggedInUser;
  }

  // If the user doesn't exist, we need their full object from Clerk to create them
  try {
    const user = await currentUser();
    if (!user) return null;

    // Create a new record in the User table
    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Clerk error in checkUser:", error);
    return null;
  }
};
