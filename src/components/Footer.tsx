import { Smartphone, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full gradient-accent">
                <Smartphone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">PhoneStyle</h3>
                <p className="text-xs text-muted-foreground">Family Boutique</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Современная система учёта продаж для семейного бутика аксессуаров. 
              Простота и удобство для каждого члена семьи.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Возможности</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Учёт ежедневных продаж</li>
              <li>Аналитика и отчёты</li>
              <li>Управление категориями</li>
              <li>Мобильная версия</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Инструкция по использованию</li>
              <li>Часто задаваемые вопросы</li>
              <li>Техническая поддержка</li>
              <li>Обратная связь</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center space-x-1">
            <span>Создано с</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>для семейного бизнеса</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;