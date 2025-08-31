import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Package, Calendar } from "lucide-react";

const StatsOverview = () => {
  // Mock data - in real app this would come from Supabase
  const stats = [
    {
      title: "Выручка за месяц",
      value: "₽45,280",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "По сравнению с прошлым месяцем"
    },
    {
      title: "Товаров продано",
      value: "234",
      change: "+8.2%",
      trend: "up",
      icon: Package,
      description: "За текущий месяц"
    },
    {
      title: "Средний чек",
      value: "₽193",
      change: "+4.1%",
      trend: "up",
      icon: TrendingUp,
      description: "Средняя стоимость покупки"
    },
    {
      title: "Дней работы",
      value: "28",
      change: "Текущий месяц",
      trend: "neutral",
      icon: Calendar,
      description: "Активных торговых дней"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Статистика продаж
          </h2>
          <p className="text-lg text-muted-foreground">
            Отслеживайте эффективность вашего бутика
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="shadow-card hover-lift animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-full gradient-accent">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs">
                    {stat.trend === "up" && (
                      <span className="text-green-600 font-medium">
                        {stat.change}
                      </span>
                    )}
                    {stat.trend === "neutral" && (
                      <span className="text-muted-foreground">
                        {stat.change}
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {stat.description}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          <Card className="shadow-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle>Популярные категории</CardTitle>
              <CardDescription>Топ продаж по категориям товаров</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Чехлы", count: 89, percentage: 38 },
                  { name: "Защитные стёкла", count: 67, percentage: 29 },
                  { name: "Зарядки", count: 45, percentage: 19 },
                  { name: "Наушники", count: 33, percentage: 14 }
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full gradient-accent"></div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">{item.count} шт</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full gradient-accent transition-all duration-700"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <CardTitle>Недавняя активность</CardTitle>
              <CardDescription>Последние записи о продажах</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Сегодня", items: "12 товаров", amount: "₽2,340" },
                  { date: "Вчера", items: "8 товаров", amount: "₽1,560" },
                  { date: "2 дня назад", items: "15 товаров", amount: "₽2,890" },
                  { date: "3 дня назад", items: "6 товаров", amount: "₽1,170" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg gradient-card">
                    <div>
                      <p className="font-medium">{activity.date}</p>
                      <p className="text-sm text-muted-foreground">{activity.items}</p>
                    </div>
                    <p className="font-semibold text-primary">{activity.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StatsOverview;