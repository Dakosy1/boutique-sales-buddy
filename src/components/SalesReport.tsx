import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, ListChecks } from "lucide-react";

// Подключаемся к Supabase так же, как в форме
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (window as any).supabase.createClient(supabaseUrl, supabaseKey);

// Описываем, как выглядит объект продажи, который мы получаем из базы
interface Sale {
    id: number;
    created_at: string;
    amount: number;
    category: string;
    payment_method: string;
}

const SalesReport = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            setError('');

            const today = new Date();
            today.setHours(0, 0, 0, 0); // Начало сегодняшнего дня
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1); // Начало завтрашнего дня

            // Запрашиваем данные из таблицы 'sales' только за сегодняшний день
            const { data, error } = await supabase
                .from('sales')
                .select('*')
                .gte('created_at', today.toISOString())
                .lt('created_at', tomorrow.toISOString())
                .order('created_at', { ascending: false }); // Сортируем по убыванию, чтобы новые были сверху

            if (error) {
                setError('Не удалось загрузить отчет: ' + error.message);
            } else if (data) {
                setSales(data);
                // Считаем итоговую сумму
                const totalAmount = data.reduce((sum, sale) => sum + sale.amount, 0);
                setTotal(totalAmount);
            }
            setLoading(false);
        };

        fetchSales();
    }, []);

    if (loading) {
        return <div className="text-center p-8">Загрузка отчета...</div>;
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-4xl py-8 px-4">
                <Alert variant="destructive">
                    <AlertTitle>Ошибка</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 px-4">
            <Card className="shadow-card animate-scale-in">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Отчет по продажам за сегодня</span>
                        <span className="text-sm font-normal text-muted-foreground">
                            {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sales.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">Сегодня еще не было продаж.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Время</TableHead>
                                    <TableHead>Категория</TableHead>
                                    <TableHead>Способ оплаты</TableHead>
                                    <TableHead className="text-right">Сумма</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{new Date(sale.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell>{sale.category}</TableCell>
                                        <TableCell>{sale.payment_method}</TableCell>
                                        <TableCell className="text-right font-medium">{sale.amount.toLocaleString('ru-RU')} тг</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
                    <div className="flex items-center text-lg font-bold">
                       <ListChecks className="h-5 w-5 mr-2" />
                       Итого:
                    </div>
                    <div className="text-2xl font-bold text-primary flex items-center">
                        <DollarSign className="h-6 w-6 mr-2" />
                        {total.toLocaleString('ru-RU')} тг
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SalesReport;
