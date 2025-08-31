import Header from "@/components/Header";
import StatsOverview from "@/components/StatsOverview";
import Footer from "@/components/Footer";

const Stats = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <StatsOverview />
      </main>
      <Footer />
    </div>
  );
};

export default Stats;