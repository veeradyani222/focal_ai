import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
    error: '/', // Redirect back to home page on error
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Log for debugging
      console.log('JWT Callback:', { token, user, account });
      return token;
    },
    async session({ session, token }) {
      // Log for debugging
      console.log('Session Callback:', { session, token });
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Log for debugging
      console.log('Redirect Callback:', { url, baseUrl });
      
      // If the url is relative, prefix it with the base url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the url is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise, redirect to the dashboard
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
});

export { handler as GET, handler as POST };
