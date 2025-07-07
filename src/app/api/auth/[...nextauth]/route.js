import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// Helper function to get settings
async function getSettings() {
  try {
    const settings = await prisma.settings.findFirst();
    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    // Return default settings if database is unavailable
    return {
      sessionDuration: 3600 // 1 hour default
    };
  }
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Static admin credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL || 'abdullahmemon1502@gmail.com';
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        const adminName = process.env.ADMIN_NAME || 'Admin User';

        console.log('Auth Debug - Admin Email:', adminEmail);
        console.log('Auth Debug - Has Password Hash:', !!adminPasswordHash);
        console.log('Auth Debug - Input Email:', credentials.email);

        // Check static admin credentials first
        if (credentials.email === adminEmail) {
          let isValidPassword = false;
          
          if (adminPasswordHash) {
            // Use hashed password from environment
            isValidPassword = await bcrypt.compare(credentials.password, adminPasswordHash);
            console.log('Auth Debug - Password comparison result:', isValidPassword);
          } else {
            // Fallback to plain text comparison (for development only)
            isValidPassword = credentials.password === '#!nclude<Adm!n_123>';
            console.log('Auth Debug - Using fallback password, result:', isValidPassword);
          }
          
          if (isValidPassword) {
            console.log('Auth Debug - Admin login successful');
            return {
              id: 'admin-1',
              email: adminEmail,
              name: adminName,
              role: 'admin',
            };
          } else {
            console.log('Auth Debug - Admin password incorrect');
          }
        } else {
          console.log('Auth Debug - Email does not match admin email');
        }

        try {
          // Try database as secondary option (for additional users)
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (user) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (isPasswordValid) {
              return {
                id: user.id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
              };
            }
          }
        } catch (error) {
          console.error('Database auth error:', error);
          // Database errors won't prevent admin login
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600, // Default 1 hour, will be overridden by settings
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        // Add login timestamp
        token.loginTime = Math.floor(Date.now() / 1000);
      }
      
      // Check if session should expire based on settings
      if (token.loginTime) {
        const settings = await getSettings();
        const sessionDuration = settings?.sessionDuration || 3600;
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (currentTime - token.loginTime > sessionDuration) {
          // Session expired
          return null;
        }
        
        // Add session expiry info
        token.expiresAt = token.loginTime + sessionDuration;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.expiresAt = token.expiresAt;
        session.loginTime = token.loginTime;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
