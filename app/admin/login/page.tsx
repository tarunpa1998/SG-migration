import { Metadata } from 'next';
import LoginForm from './login-form';

export const metadata: Metadata = {
  title: 'Admin Login | Study Guru',
  description: 'Login to the Study Guru admin panel to manage your content and data.',
};

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}