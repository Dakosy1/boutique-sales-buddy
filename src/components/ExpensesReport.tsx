import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// @ts-ignore
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

interface Expense {
    id: number;
    created_at: string;
    amount: number;
    category: string;
    description: string;
}

interface ExpensesReportProps {
  startDate?: Date;
  endDate?: Date;
}

const ExpensesReport = ({ startDate, endDate }: ExpensesReportProps) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { toast } = useToast();

    const fetchExpenses = async () => {
        if (!startDate || !endDate) return;

        setLoading(true);
        setError('');

        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .gte('created_at', startDate.toISOString())
            .lte('created_at', endDate.toISOString())
            .order('created_at', { ascending: false });

        if (error) {
            setError('Не удалось загрузить отчет по расходам: ' + error.message);
        } else if (data) {
            setExpenses(data);
            const totalAmount = data.reduce((sum, expense) => sum + expense.amount, 0);
            setTotal(totalAmount);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, [startDate, endDate]);

    return (
        <Card className="shadow-card animate-scale-in">
            <CardContent className="pt-6">
                {loading ? (
                    <p className="text-center p-8 text-muted-foreground">Загрузка расходов...</p>
                ) : error ? (
                    <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
                ) : expenses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет данных о расходах за выбранный период.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Дата и Время</TableHead>
                                <TableHead>Категория</TableHead>
                                <TableHead>Описание</TableHead>
                                <TableHead className="text-right">Сумма</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{new Date(expense.created_at).toLocaleString('ru-RU')}</TableCell>
                                    <TableCell>{expense.category}</TableCell>
                                    <TableCell>{expense.description}</TableCell>
                                    <TableCell className="text-right font-medium">{expense.amount.toLocaleString('ru-RU')} тг</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
                <div className="flex items-center text-lg font-bold">
                   <ListChecks className="h-5 w-5 mr-2" />
                   Итого расходов:
                </div>
                <div className="text-2xl font-bold text-destructive flex items-center">
                    {total.toLocaleString('ru-RU')} тг
                </div>
            </CardFooter>
        </Card>
    );
};

export default ExpensesReport;