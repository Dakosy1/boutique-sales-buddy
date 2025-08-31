import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, ListChecks, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// @ts-ignore
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

interface Sale {
    id: number;
    created_at: string;
    amount: number;
    category: string;
    payment_method: string;
}

const Stats = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [startDate, setStartDate] = useState<Date>(() => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return date;
    });

    const [endDate, setEndDate] = useState<Date>(() => {
        const date = new Date();
        date.setHours(23, 59, 59, 999);
        return date;
    });

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all'); // НОВЫЙ ФИЛЬТР

    const categories = [
        { value: 'all', label: 'Все товары' },
        { value: 'Чехол', label: 'Чехлы' },
        { value: 'Стекло', label: 'Защитные стёкла' },
        { value: 'Зарядка', label: 'Зарядки' },
        { value: 'Наушники', label: 'Наушники' },
        { value: 'Аксессуар', label: 'Аксессуар' },
        { value: 'Ремонт', label: 'Ремонт' },
        { value: 'Прочее', label: 'Прочее' },
    ];

    const paymentMethods = [
      { value: 'all', label: 'Все способы' },
      { value: 'Наличные', label: 'Наличные' },
      { value: 'QR', label: 'QR' },
      { value: 'Перевод', label: 'Перевод' },
      { value: 'Kaspi Red', label: 'Kaspi Red' },
    ];

    useEffect(() => {
        const fetchSales = async () => {
            if (!startDate || !endDate) return;

            setLoading(true);
            setError('');

            let query = supabase
                .from('sales')
                .select('*')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString())
                .order('created_at', { ascending: false });

            if (selectedCategory !== 'all') {
                query = query.eq('category', selectedCategory);
            }
            
            // ДОБАВЛЕНИЕ: Фильтрация по способу оплаты
            if (selectedPaymentMethod !== 'all') {
                query = query.eq('payment_method', selectedPaymentMethod);
            }

            const { data, error } = await query;

            if (error) {
                setError('Не удалось загрузить отчет: ' + error.message);
            } else if (data) {
                setSales(data);
                const totalAmount = data.reduce((sum, sale) => sum + sale.amount, 0);
                setTotal(totalAmount);
            }
            setLoading(false);
        };

        fetchSales();
    }, [startDate, endDate, selectedCategory, selectedPaymentMethod]); // Добавили новый фильтр в зависимости

    const getReportTitle = () => {
        if (!startDate || !endDate) return "Отчет по продажам";
        const start = format(startDate, "dd.MM.yyyy");
        const end = format(endDate, "dd.MM.yyyy");
        const categoryText = selectedCategory === 'all' ? 'Все товары' : `"${selectedCategory}"`;
        const titleDatePart = start === end ? `за ${start}` : `с ${start} по ${end}`;
        
        return `Отчет: ${categoryText} ${titleDatePart}`;
    };

    const handleSetToday = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        setStartDate(start);
        setEndDate(end);
    };

    return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="py-8 flex-grow">
        <div className="container mx-auto max-w-5xl px-4">
            <div className="flex flex-wrap justify-center mb-6 gap-2 md:gap-4 items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-[180px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "dd LLL, y", { locale: ru }) : <span>Начальная дата</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={(date) => {
                                if (date) {
                                    date.setHours(0, 0, 0, 0);
                                    setStartDate(date);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant={"outline"} className="w-[180px] justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "dd LLL, y", { locale: ru }) : <span>Конечная дата</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                                if (date) {
                                    date.setHours(23, 59, 59, 999);
                                    setEndDate(date);
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>

                {/* НОВЫЙ ДРОПДАУН */}
                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Способ оплаты" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleSetToday}>Сегодня</Button>
            </div>
            
            <Card className="shadow-card animate-scale-in">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>{getReportTitle()}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center p-8 text-muted-foreground">Загрузка...</p>
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Ошибка</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    ) : sales.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">Нет данных за выбранный период.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Дата и Время</TableHead>
                                    <TableHead>Категория</TableHead>
                                    <TableHead>Способ оплаты</TableHead>
                                    <TableHead className="text-right">Сумма</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.map((sale) => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{new Date(sale.created_at).toLocaleString('ru-RU')}</TableCell>
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
                        {total.toLocaleString('ru-RU')} тг
                    </div>
                </CardFooter>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Stats;

