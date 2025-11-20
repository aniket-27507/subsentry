import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const loginWithGoogle = useStore((state) => state.loginWithGoogle);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by App.tsx listening to auth state
      navigate('/dashboard'); 
    } catch (error: any) {
      setErrors({ email: error.message || 'Failed to login' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrors({}); // Clear previous errors
      console.log('Attempting Google Login...'); // Debug log
      await loginWithGoogle();
    } catch (error: any) {
      console.error('Google Login Error:', error); // Debug log
      setErrors({ 
        email: `Login Failed: ${error.message || JSON.stringify(error)}` 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary dark:bg-primary-dark rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              S
            </div>
            <span className="text-3xl font-bold text-primary dark:text-primary-dark">SubSentry</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Centralize all your subscriptions in minutes
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />
            
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-dark-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-dark-surface text-gray-500 dark:text-dark-text-secondary">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="secondary"
            fullWidth
            className="flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary dark:text-primary-dark font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-dark-text-secondary">
          <Link to="/" className="hover:text-primary dark:hover:text-primary-dark transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
