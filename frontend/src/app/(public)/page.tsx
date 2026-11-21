import PublicNavbar from '@/components/features/home/components/PublicNavbar';
import HeroSection from '@/components/features/home/components/HeroSection';
import FeaturesSection from '@/components/features/home/components/FeaturesSection';
import HowItWorks from '@/components/features/home/components/HowItWorks';
import TransparencySection from '@/components/features/home/components/TransparencySection';
import PublicFooter from '@/components/features/home/components/PublicFooter';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">

      <PublicNavbar />

      <HeroSection />

      <FeaturesSection />

      <HowItWorks />

      <TransparencySection />

      <PublicFooter />

    </main>
  );
}