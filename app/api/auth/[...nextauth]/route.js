import NextAuth from "next-auth";
import privateClientPromise from "@/app/lib/privateMongo";

export const authOptions = {
  // custom provider definition
  // scope options available?
  // - https://canvas.instructure.com/doc/api/all_resources.html
  providers: [
    {
      id: "Canvas",
      name: "Canvas",
      type: "oauth",
      authorization: `${process.env.CANVAS_URL}/login/oauth2/auth`,
      token: `${process.env.CANVAS_URL}/login/oauth2/token`,
      userinfo: `${process.env.CANVAS_URL}/api/v1/users/self`,
      clientId: process.env.CANVAS_CLIENT_ID,
      clientSecret: process.env.CANVAS_CLIENT_SECRET,
      profile(profile) {
        return profile;
      },
    },
  ],
  // customize behavior on nextauth callbacks
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        //// save oauth info
        // - https://canvas.instructure.com/doc/api/file.oauth.html#storing-access-tokens
        const mongo = await privateClientPromise;
        const oauth = await mongo.db("oauth");
        const accounts = await oauth.collection("accounts");

        const date = new Date();

        // upsert after every sign in to get most recent token
        // TODO: get token and delete it instead of overwriting
        // - https://canvas.instructure.com/doc/api/file.oauth_endpoints.html#delete-login-oauth2-token
        // - make an endpoint that can be used here and after signOut calls on client
        const query = {
          "user.id": account.user.id,
          "user.global_id": account.user.global_id,
        };

        const update = {
          $set: {
            ...account,
            profile,
            last_login: {
              utc: date.toUTCString(),
              epoch: date.valueOf(),
            },
            updated: {
              by: "/api/auth/[...nextauth]",
              utc: date.toUTCString(),
              epoch: date.valueOf(),
            },
          },
        };

        const options = { upsert: true };

        await accounts.updateOne(query, update, options);
      } catch (e) {
        console.error("signIn error", e);
      } finally {
        return true;
      }
    },
    // async redirect({ url, baseUrl }) {
    //   console.log("redirect", url, baseUrl);
    //   return baseUrl;
    // },
    async session({ session, user, token }) {
      try {
        //// add data to client session from server
        if (session?.user?.name && token?.sub && !session?.user?.id) {
          const mongo = await privateClientPromise;
          const oauth = await mongo.db("oauth");
          const accounts = await oauth.collection("accounts");

          // this query may not apply to all users
          const query = {
            "user.name": session.user.name,
            providerAccountId: token.sub,
          };

          const account = await accounts.findOne(query);

          if (account?.providerAccountId)
            session.user.id = account?.providerAccountId;
        }
      } catch (e) {
        console.error("session error", e);
      } finally {
        return session;
      }
    },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   console.log("jwt", token, user, account, profile, isNewUser);
    //   return token;
    // },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
