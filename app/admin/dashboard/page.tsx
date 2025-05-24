import { Metadata } from 'next';
import AdminDashboard from './admin-dashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Study Guru',
  description: 'Manage your Study Guru site content and data.',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}