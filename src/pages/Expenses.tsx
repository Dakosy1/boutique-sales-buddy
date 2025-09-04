import Header from "@/components/Header";
import ExpensesForm from "@/components/ExpensesForm";
import Footer from "@/components/Footer";

const Expenses = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="py-8 flex-grow flex items-center justify-center">
        <ExpensesForm />
      </main>
      <Footer />
    </div>
  );
};

export default Expenses;