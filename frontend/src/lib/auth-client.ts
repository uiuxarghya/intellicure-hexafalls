import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
  plugins: [nextCookies()], // make sure this is the last plugin in the array
});

export const { signIn, signUp, useSession } = authClient;
