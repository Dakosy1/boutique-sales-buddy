import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// @ts-ignore
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

const ExpensesForm = () => {
    const { toast } = useToast();
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const expenseCategories = [
        { value: 'Закупка товара', label: 'Закупка товара' },
        { value: 'Аренда', label: 'Аренда' },
        { value: 'Реклама', label: 'Реклама' },
        { value: 'Зарплата', label: 'Зарплата' },
        { value: 'Прочее', label: 'Прочее' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || !category) {
            toast({ title: "Ошибка", description: "Заполните сумму и категорию", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        const expenseAmount = parseFloat(amount);

        const { error } = await supabase
            .from('expenses')
            .insert([{ 
                amount: expenseAmount, 
                category: category, 
                description: description 
            }]);
        
        setIsLoading(false);

        if (error) {
            toast({ title: "Ошибка сохранения", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Расход сохранен!", description: `${amount} тг - ${category}` });
            setAmount('');
            setCategory('');
            setDescription('');
        }
    };

    return (
        <div className="container mx-auto max-w-xl px-4">
            <Card className="shadow-card animate-scale-in">
                <CardHeader>
                    <CardTitle>Учёт расходов</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Сумма (тенге)</Label>
                            <Input
                                id="amount"
                                type="number"
                                placeholder="Введите сумму расхода"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Категория расхода</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
                                <SelectContent>
                                    {expenseCategories.map((cat) => (
                                        <SelectItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Описание (необязательно)</Label>
                            <Textarea
                                id="description"
                                placeholder="Например, закупка чехлов для iPhone 15"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <Button type="submit" variant="boutique" size="lg" className="w-full" disabled={isLoading}>
                            <Save className="h-4 w-4 mr-2" />
                            {isLoading ? 'Сохранение...' : 'Сохранить расход'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ExpensesForm;