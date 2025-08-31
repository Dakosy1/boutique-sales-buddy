import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// --- НАСТРОЙКА SUPABASE ---
// Код подключения, который берет ваши ключи из файла .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Клиент создается из глобального объекта supabase, который мы подключили в index.html
const supabase = (window as any).supabase.createClient(supabaseUrl, supabaseKey);
// -------------------------


const SalesForm = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // Добавили способ оплаты

  const categories = [
    { value: 'Чехол', label: 'Чехлы' },
    { value: 'Стекло', label: 'Защитные стёкла' },
    { value: 'Зарядка', label: 'Зарядки' },
    { value: 'Наушники', label: 'Наушники' },
    { value: 'Аксессуар', label: 'Аксессуар' },
    { value: 'Ремонт', label: 'Ремонт' },
    { value: 'Прочее', label: 'Прочее' },
  ];

  const paymentMethods = [
      { value: 'Наличные', label: 'Наличные' },
      { value: 'QR', label: 'QR' },
      { value: 'Перевод', label: 'Перевод' },
      { value: 'Kaspi Red', label: 'Kaspi Red' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category || !paymentMethod) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }
    
    const saleAmount = parseFloat(amount);
    if (isNaN(saleAmount)) {
      toast({
        title: "Ошибка",
        description: "Сумма должна быть числом",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('sales')
      .insert([
        { amount: saleAmount, category: category, payment_method: paymentMethod }
      ]);

    if (error) {
        toast({
            title: "Ошибка сохранения",
            description: error.message,
            variant: "destructive"
        });
    } else {
        toast({
          title: "Продажа сохранена!",
          description: `${amount} тг - ${category} (${paymentMethod})`,
        });

        // Reset form
        setAmount('');
        setCategory('');
        setPaymentMethod('');
    }
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

            {/* Новое поле "Способ оплаты" */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Способ оплаты</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите способ оплаты" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
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
