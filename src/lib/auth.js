import { getServerSession } from 'next-auth/next';
import { cookies } from 'next/headers';

// Import authOptions from NextAuth configuration
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export { authOptions };

export async function withAuth(handler) {
  return async function(request, context) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session || session.user?.role !== 'admin') {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Add session to context for use in handlers
      return await handler(request, { ...context, session });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}

export async function requireAuth(request) {
  try {
    console.log('🔐 Starting authentication check...'); // Debug log
    
    // Create a headers object from the request if it exists
    const headers = request?.headers ? Object.fromEntries(request.headers.entries()) : {};
    console.log('🔐 Request headers cookies:', headers.cookie ? 'Present' : 'Missing'); // Debug log
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    
    console.log('🔐 Session result:', session ? { 
      email: session.user?.email, 
      role: session.user?.role,
      hasUser: !!session.user,
      sessionKeys: Object.keys(session)
    } : 'No session'); // Debug log
    
    if (!session) {
      console.log('❌ No session found - user not logged in'); // Debug log
      throw new Error('Unauthorized');
    }
    
    if (!session.user) {
      console.log('❌ Session exists but no user data'); // Debug log
      throw new Error('Unauthorized');
    }
    
    if (session.user?.role !== 'admin') {
      console.log('❌ User role is not admin:', session.user?.role); // Debug log
      throw new Error('Unauthorized');
    }

    console.log('✅ Auth successful for user:', session.user?.email); // Debug log
    return session;
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    throw new Error('Authentication failed');
  }
}

// Alternative method using cookies directly if needed
export async function getAuthSession() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get(
      process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token' 
        : 'next-auth.session-token'
    );
    
    if (!sessionToken) {
      return null;
    }
    
    const session = await getServerSession(authOptions);
    return session;
  } catch (error) {
    console.error('Failed to get auth session:', error);
    return null;
  }
}
