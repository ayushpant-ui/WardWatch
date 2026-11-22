import AuthLayout from '@/components/features/auth/components/AuthLayout';
import RegisterForm from '@/components/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an Account"
      description="Join WardWatch and help improve your community."
    >
      <RegisterForm />
    </AuthLayout>
  );
}