import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import SalesReport from "@/components/SalesReport";
import ExpensesReport from "@/components/ExpensesReport";

const Stats = () => {
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
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');

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
            <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sales">Продажи</TabsTrigger>
                    <TabsTrigger value="expenses">Расходы</TabsTrigger>
                </TabsList>

                <div className="flex flex-wrap justify-center my-6 gap-2 md:gap-4 items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-[180px] justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {startDate ? format(startDate, "dd LLL, y", { locale: ru }) : <span>Начальная дата</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={startDate} onSelect={(date) => { if(date) { date.setHours(0,0,0,0); setStartDate(date); }}} initialFocus />
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
                            <Calendar mode="single" selected={endDate} onSelect={(date) => { if (date) { date.setHours(23, 59, 59, 999); setEndDate(date); }}} initialFocus />
                        </PopoverContent>
                    </Popover>

                    <Button onClick={handleSetToday}>Сегодня</Button>
                </div>
                
                <TabsContent value="sales">
                    <div className="flex flex-wrap justify-center mb-6 gap-2 md:gap-4 items-center">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Категория" /></SelectTrigger>
                            <SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                        </Select>

                        <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Способ оплаты" /></SelectTrigger>
                            <SelectContent>{paymentMethods.map((method) => (<SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>))}</SelectContent>
                        </Select>
                    </div>
                    <SalesReport 
                        startDate={startDate} 
                        endDate={endDate} 
                        selectedCategory={selectedCategory} 
                        selectedPaymentMethod={selectedPaymentMethod} 
                    />
                </TabsContent>
                <TabsContent value="expenses">
                    <ExpensesReport startDate={startDate} endDate={endDate} />
                </TabsContent>
            </Tabs>

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Stats;