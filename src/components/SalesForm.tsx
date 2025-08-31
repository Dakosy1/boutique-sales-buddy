import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Save, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SalesForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cases: '',
    screenProtectors: '',
    chargers: '',
    headphones: '',
    other: '',
  });

  const categories = [
    { key: 'cases', label: 'Чехлы', icon: '📱' },
    { key: 'screenProtectors', label: 'Защитные стёкла', icon: '🛡️' },
    { key: 'chargers', label: 'Зарядки', icon: '🔌' },
    { key: 'headphones', label: 'Наушники', icon: '🎧' },
    { key: 'other', label: 'Прочее', icon: '📦' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally save to Supabase
    toast({
      title: "Продажи сохранены!",
      description: "Данные о продажах успешно добавлены в систему.",
    });

    // Reset form
    setFormData({
      ...formData,
      cases: '',
      screenProtectors: '',
      chargers: '',
      headphones: '',
      other: '',
    });
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Добавить продажи за день
          </h2>
          <p className="text-lg text-muted-foreground">
            Укажите количество проданных товаров по каждой категории
          </p>
        </div>

        <Card className="shadow-card animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Calendar className="h-5 w-5" />
              <span>Ежедневный учёт продаж</span>
            </CardTitle>
            <CardDescription>
              Введите данные о продажах для текущей даты
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="date">Дата</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="mt-2"
                  />
                </div>

                {categories.map((category) => (
                  <div key={category.key} className="space-y-2">
                    <Label htmlFor={category.key} className="flex items-center space-x-2">
                      <span className="text-lg">{category.icon}</span>
                      <span>{category.label}</span>
                    </Label>
                    <Input
                      id={category.key}
                      type="number"
                      min="0"
                      placeholder="Количество"
                      value={formData[category.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(category.key, e.target.value)}
                      className="transition-all focus:shadow-glow"
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button 
                  type="submit" 
                  variant="boutique" 
                  size="lg" 
                  className="flex-1"
                >
                  <Save className="h-4 w-4" />
                  Сохранить продажи
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => setFormData({
                    ...formData,
                    cases: '',
                    screenProtectors: '',
                    chargers: '',
                    headphones: '',
                    other: '',
                  })}
                >
                  Очистить форму
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 gradient-card rounded-lg shadow-soft">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Совет:</strong> Вводите данные ежедневно для более точной аналитики и отчётности
          </p>
        </div>
      </div>
    </section>
  );
};

export default SalesForm;