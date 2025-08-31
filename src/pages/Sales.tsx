import Header from "@/components/Header";
import SalesForm from "@/components/SalesForm";
import Footer from "@/components/Footer";

const Sales = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <SalesForm />
      </main>
      <Footer />
    </div>
  );
};

export default Sales;