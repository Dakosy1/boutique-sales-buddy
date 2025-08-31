import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Package, Users, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-hero min-h-[600px] flex items-center">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Управляйте продажами
            <span className="block text-primary">с лёгкостью</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Простая и современная система учёта для вашего семейного бутика аксессуаров для телефонов
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              <Package className="h-5 w-5" />
              Начать работу
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <TrendingUp className="h-5 w-5" />
              Посмотреть отчёты
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full gradient-accent">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Учёт товаров</h3>
            </div>
            <p className="text-muted-foreground">
              Легко отслеживайте продажи чехлов, защитных стёкол и других аксессуаров
            </p>
          </Card>

          <Card className="p-6 shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full gradient-accent">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Аналитика</h3>
            </div>
            <p className="text-muted-foreground">
              Получайте подробные отчёты о выручке и популярных категориях товаров
            </p>
          </Card>

          <Card className="p-6 shadow-card hover-lift animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-full gradient-accent">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Семейный доступ</h3>
            </div>
            <p className="text-muted-foreground">
              Удобный интерфейс для всех членов семьи без технических сложностей
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;