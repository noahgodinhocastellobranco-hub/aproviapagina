import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Features from "@/components/Features";
import Benefits from "@/components/Benefits";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Index = () => {
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
