import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SalesForm = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    { value: 'cases', label: 'Чехлы' },
    { value: 'screenProtectors', label: 'Защитные стёкла' },
    { value: 'chargers', label: 'Зарядки' },
    { value: 'headphones', label: 'Наушники' },
    { value: 'other', label: 'Прочее' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would normally save to Supabase
    toast({
      title: "Продажа сохранена!",
      description: `${amount} тг - ${categories.find(c => c.value === category)?.label}`,
    });

    // Reset form
    setAmount('');
    setCategory('');
  };

  return (
    <div className="container mx-auto max-w-xl py-8 px-4">
      <Card className="shadow-card animate-scale-in">
        <CardHeader>
          <CardTitle>Ежедневный учёт продаж</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Сумма (тенге)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="цена"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="transition-all focus:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Тип товара</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип товара" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              variant="boutique" 
              size="lg" 
              className="w-full"
            >
              <Save className="h-4 w-4 mr-2" />
              Сохранить продажу
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesForm;