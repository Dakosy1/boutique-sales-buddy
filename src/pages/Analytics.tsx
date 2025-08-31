import Header from "@/components/Header";
import AnalyticsOverview from "@/components/AnalyticsOverview";
import Footer from "@/components/Footer";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="py-8 flex-grow">
        <AnalyticsOverview />
      </main>
      <Footer />
    </div>
  );
};

export default Analytics;
