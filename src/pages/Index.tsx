import Header from "@/components/Header";
import SalesForm from "@/components/SalesForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      {/* Эти классы заставят основной блок занять все место 
        и отцентрировать карточку по вертикали и горизонтали 
      */}
      <main className="flex-grow flex items-center justify-center py-8">
        <SalesForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

