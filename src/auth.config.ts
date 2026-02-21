import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    // Providers will be added in auth.ts for the full app
    // We can keep specific providers here if they are Edge compatible (like OIDC), 
    // but Credentials usually needs DB which is not Edge compatible.
    // However, middleware just needs to verify the session token, it doesn't need to re-authorize via credentials.
    // So we can leave providers empty here for middleware's usage or define them partially.
    // For NextAuth v5 middleware to work, it often expects at least an empty array if just checking session.
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      
      const isAdminRoute = nextUrl.pathname.startsWith('/admin');
      const isSalesRoute = nextUrl.pathname.startsWith('/sales');
      const isPartnerRoute = nextUrl.pathname.startsWith('/partner');
      const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard');

      if (isAdminRoute) {
        return isLoggedIn && (role === 'admin' || role === 'super-admin');
      }
      if (isSalesRoute) {
        return isLoggedIn && role === 'sales-executive';
      }
      if (isPartnerRoute) {
        return isLoggedIn && (role === 'lab-admin' || role === 'partner-staff');
      }
      if (isDashboardRoute) {
        return isLoggedIn;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
