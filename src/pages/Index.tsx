import { Loader2 } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PremiumHome from "@/components/PremiumHome";

const Index = () => {
  const { user, hasSubscription, isAdmin, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Subscribed users see the premium personalized page
  if (user && hasSubscription) {
    return <PremiumHome user={user} isAdmin={isAdmin} />;
  }

  // Non-logged or non-subscribed users see the landing page
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SocialProof />
      <Features />
      <Benefits />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
