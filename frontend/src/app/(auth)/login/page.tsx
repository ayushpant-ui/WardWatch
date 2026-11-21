import AuthLayout from '@/components/features/auth/components/AuthLayout';
import LoginForm from '@/components/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      description="Login to your WardWatch account."
    >
      <LoginForm />
    </AuthLayout>
  );
}