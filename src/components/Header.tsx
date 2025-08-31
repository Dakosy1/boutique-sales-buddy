import { Button } from "@/components/ui/button";
import { Smartphone, BarChart3, PieChart } from "lucide-react"; // Добавил иконку PieChart
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-accent">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">PhoneStyle</h1>
            <p className="text-xs text-muted-foreground">Family Boutique</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Продажи
          </Link>
          <Link to="/stats" className="text-foreground hover:text-primary transition-colors">
            Статистика
          </Link>
          <Link to="/analytics" className="text-foreground hover:text-primary transition-colors">
            Аналитика
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                <Link to="/stats"><BarChart3 className="h-4 w-4 mr-2" />Статистика</Link>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
                <Link to="/analytics"><PieChart className="h-4 w-4 mr-2" />Аналитика</Link>
            </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

