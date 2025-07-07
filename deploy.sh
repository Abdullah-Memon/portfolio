#!/bin/bash

# Deployment setup script for Vercel
# Run this after making the above changes

echo "🚀 Setting up production deployment..."

# Generate Prisma client for Data Proxy
echo "📦 Generating Prisma client for Data Proxy..."
npx prisma generate --data-proxy

# Push database schema (if needed)
echo "🗄️ Pushing database schema..."
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Set the following environment variables in Vercel dashboard:"
echo "   - DATABASE_URL=prisma://aws-us-east-1.prisma-data.com/?api_key=sk_Ul0tQFW0LLp7U-1s1gFeI"
echo "   - DIRECT_URL=postgres://2463083ce4dd8a272eb524d388ed49a5b439b996a1861f4c9d7c0142a226256c:sk_Ul0tQFW0LLp7U-1s1gFeI@db.prisma.io:5432/?sslmode=require"
echo "   - NEXTAUTH_URL=https://abdullahmemon.vercel.app"
echo "   - NEXTAUTH_SECRET=L+8xfBVvlGHoMIMNhDZfZSjoOOf/MTao74b1u2U2ylv+JdJcnlt+41Kfv9CgUqAR1O7jin79JPFEWgPxOWIHuLiKPIx+YZhAlwE7KWUehsf1TtFirRiH0Vebmgs9u1jVEvgDJree4DLIaKQgZ0cQ1R7iZEHD6qyfKFHUlRRRbOg="
echo ""
echo "2. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "3. If you still have issues, check Vercel logs:"
echo "   vercel logs https://abdullahmemon.vercel.app"
