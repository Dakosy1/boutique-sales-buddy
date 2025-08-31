import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SalesForm from "@/components/SalesForm";
import StatsOverview from "@/components/StatsOverview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <SalesForm />
        <StatsOverview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
