import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  callbacks: {
    session({ session }) {
      session.user.admin = session.user.email === process.env.GITHUB_ADMIN_EMAIL ? true : false;
      return session;
    }
  }
};

export default NextAuth(authOptions);
