'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Input, Button, Typography } from '@material-tailwind/react';
import Container from '@/components/ui/Container';
import { toast } from 'react-hot-toast';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        toast.error('Invalid credentials');
      } else {
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          toast.success('Successfully logged in!');
          router.push('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          toast.error('Access denied. Admin privileges required.');
        }
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container className="max-w-md w-full">
        <Card className="bg-white">
          <CardBody className="p-8">
            <div className="text-center mb-8">
              <Typography variant="h3" color="blue-gray" className="mb-2 text-gray-900">
                Admin Login
              </Typography>
              <Typography color="gray" className="text-sm text-gray-600">
                Please sign in to access the admin panel
              </Typography>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <Input
                  type="email"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-dynamic"
                
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
}
