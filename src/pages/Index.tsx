import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Strategies from "@/components/Strategies";
import CTA from "@/components/CTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Features />
      <Strategies />
      <CTA />
    </div>
  );
};

export default Index;
