# Deployment setup script for Vercel (PowerShell)
# Run this after making the above changes

Write-Host "🚀 Setting up production deployment..." -ForegroundColor Green

# Generate Prisma client for Data Proxy
Write-Host "📦 Generating Prisma client for Data Proxy..." -ForegroundColor Yellow
npx prisma generate --data-proxy

# Push database schema (if needed)
Write-Host "🗄️ Pushing database schema..." -ForegroundColor Yellow
npx prisma db push

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Set the following environment variables in Vercel dashboard:" -ForegroundColor White
Write-Host "   - DATABASE_URL=prisma://aws-us-east-1.prisma-data.com/?api_key=sk_Ul0tQFW0LLp7U-1s1gFeI" -ForegroundColor Gray
Write-Host "   - DIRECT_URL=postgres://2463083ce4dd8a272eb524d388ed49a5b439b996a1861f4c9d7c0142a226256c:sk_Ul0tQFW0LLp7U-1s1gFeI@db.prisma.io:5432/?sslmode=require" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_URL=https://abdullahmemon.vercel.app" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET=L+8xfBVvlGHoMIMNhDZfZSjoOOf/MTao74b1u2U2ylv+JdJcnlt+41Kfv9CgUqAR1O7jin79JPFEWgPxOWIHuLiKPIx+YZhAlwE7KWUehsf1TtFirRiH0Vebmgs9u1jVEvgDJree4DLIaKQgZ0cQ1R7iZEHD6qyfKFHUlRRRbOg=" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to Vercel:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "3. If you still have issues, check Vercel logs:" -ForegroundColor White
Write-Host "   vercel logs https://abdullahmemon.vercel.app" -ForegroundColor Gray
