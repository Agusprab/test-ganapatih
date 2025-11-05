'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const registerResult = await api.register(username, password);
      if (registerResult.error) {
        setError(registerResult.error);
        setToastMessage('Registration failed');
        setToastType('error');
        setTimeout(() => setToastMessage(''), 3000);
        return;
      }

      // Auto login after successful registration
      const loginResult = await api.login(username, password);
      if (loginResult.token) {
        localStorage.setItem('token', loginResult.token);
        setToastMessage('Registration successful! Redirecting...');
        setToastType('success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setError('Registration successful but auto-login failed. Please login manually.');
        setToastMessage('Registration successful but login failed');
        setToastType('error');
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      setError('Network error');
      setToastMessage('Network error occurred');
      setToastType('error');
      setTimeout(() => setToastMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toastMessage}
        </div>
      )}

      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Register</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="text-gray-700"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-gray-700"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" disabled={loading} variant="secondary" className="w-full">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-700">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;