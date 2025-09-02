import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Smartphone, BarChart3, PieChart, Menu, Home } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full gradient-accent">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Ipochino</h1>
            <p className="text-xs text-muted-foreground">Family Boutique</p>
          </div>
        </Link>
        
        {/* Навигация для больших экранов */}
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

        {/* Мобильное меню (бургер) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 pt-8">
                <SheetClose asChild>
                  <Link to="/" className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors">
                    <Home className="h-5 w-5" />
                    <span>Продажи</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/stats" className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors">
                    <BarChart3 className="h-5 w-5" />
                    <span>Статистика</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link to="/analytics" className="flex items-center space-x-3 text-lg font-medium text-foreground hover:text-primary transition-colors">
                    <PieChart className="h-5 w-5" />
                    <span>Аналитика</span>
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;