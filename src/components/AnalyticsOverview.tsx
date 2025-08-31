import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, DollarSign, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts";

// @ts-ignore
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// @ts-ignore
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// @ts-ignore
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ... (интерфейсы StatsData, CategoryData, DailyData остаются без изменений)
interface StatsData {
    currentMonthRevenue: number;
    prevMonthRevenue: number;
    revenueChange: number;
    currentMonthSalesCount: number;
}

interface CategoryData {
    name: string;
    total: number;
}

interface ChartData {
    name: string;
    total: number;
}


const AnalyticsOverview = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [timeSeriesData, setTimeSeriesData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    // чтобы по умолчанию была НЕДЕЛЯ
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);

            // --- 1. Fetching data for top cards (monthly stats) ---
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            
            const { data: currentMonthSales, error: currentError } = await supabase
                .from('sales')
                .select('amount, category, created_at')
                .gte('created_at', startOfCurrentMonth.toISOString());

            const { data: prevMonthSales, error: prevError } = await supabase
                .from('sales')
                .select('amount')
                .gte('created_at', startOfPrevMonth.toISOString())
                .lte('created_at', endOfPrevMonth.toISOString());

            if (currentError || prevError) {
                console.error("Error fetching stats:", currentError || prevError);
                setLoading(false);
                return;
            }

            const currentMonthRevenue = currentMonthSales.reduce((sum: number, sale: { amount: number }) => sum + sale.amount, 0);
            const prevMonthRevenue = prevMonthSales.reduce((sum: number, sale: { amount: number }) => sum + sale.amount, 0);
            
            let revenueChange = 0;
            if (prevMonthRevenue > 0) {
                revenueChange = ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
            } else if (currentMonthRevenue > 0) {
                revenueChange = 100;
            }
            
            setStats({
                currentMonthRevenue,
                prevMonthRevenue,
                revenueChange: parseFloat(revenueChange.toFixed(1)),
                currentMonthSalesCount: currentMonthSales.length
            });

            // --- 2. Fetching and processing data for charts based on period ---
            let startDate, endDate = new Date();
            
            switch (period) {
                case 'week':
                    const day = now.getDay();
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                    startDate = new Date(now.setDate(diff));
                    startDate.setHours(0,0,0,0);
                    endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + 6);
                    endDate.setHours(23,59,59,999);
                    break;
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default: // month
                    startDate = startOfCurrentMonth;
                    break;
            }

            const { data: periodData, error: periodError } = await supabase
                .from('sales')
                .select('amount, category, created_at')
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());

            if (periodError) {
                console.error(`Error fetching data for period ${period}:`, periodError);
                setLoading(false);
                return;
            }
            
            // Group data for category chart
            const salesByCategory = periodData.reduce((acc: Record<string, number>, sale: { category: string, amount: number }) => {
                const { category, amount } = sale;
                if (!acc[category]) acc[category] = 0;
                acc[category] += amount;
                return acc;
            }, {} as Record<string, number>);
            const formattedCategoryData = Object.entries(salesByCategory)
                .map(([name, total]) => ({ name, total }))
                .sort((a, b) => b.total - a.total);
            setCategoryData(formattedCategoryData);

            // Group data for time series chart
            let salesByTimeUnit: Record<string, number> = {};
            let timeUnitFormatter: (date: Date) => string;
            
            if (period === 'week') {
                timeUnitFormatter = (date: Date) => date.toLocaleDateString('ru-RU', { weekday: 'short' });
            } else if (period === 'month') {
                const getWeekOfMonth = (date: Date) => Math.ceil(date.getDate() / 7);
                timeUnitFormatter = (date: Date) => `Неделя ${getWeekOfMonth(date)}`;
            } else { // year
                timeUnitFormatter = (date: Date) => date.toLocaleDateString('ru-RU', { month: 'short' });
            }

            salesByTimeUnit = periodData.reduce((acc: Record<string, number>, sale: { created_at: string, amount: number }) => {
                const timeUnit = timeUnitFormatter(new Date(sale.created_at));
                if (!acc[timeUnit]) acc[timeUnit] = 0;
                acc[timeUnit] += sale.amount;
                return acc;
            }, {} as Record<string, number>);
            
            const formattedTimeSeriesData = Object.entries(salesByTimeUnit).map(([name, total]) => ({ name, total }));
            
            // Correctly sort time series data
            if (period === 'week') {
                const dayOrder = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
                formattedTimeSeriesData.sort((a, b) => dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name));
            } else if (period === 'month') {
                 formattedTimeSeriesData.sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
            } else if (period === 'year') {
                const monthOrder = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
                formattedTimeSeriesData.sort((a, b) => monthOrder.indexOf(a.name.replace('.', '')) - monthOrder.indexOf(b.name.replace('.', '')));
            }

            setTimeSeriesData(formattedTimeSeriesData);
            setLoading(false);
        };

        fetchAllData();
    }, [period]);

    const formatYAxis = (tick: number) => `${(tick / 1000).toLocaleString('ru-RU')}k`;

    const getChartTitle = () => {
        switch (period) {
            case 'week': return 'Динамика выручки за неделю';
            case 'year': return 'Динамика выручки по месяцам';
            default: return 'Динамика выручки по неделям';
        }
    }

    return (
        <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Аналитика продаж</h2>
                    <p className="text-lg text-muted-foreground">Ключевые показатели вашего бутика</p>
                </div>

                 <div className="flex justify-end mb-4">
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Выберите период" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">За неделю</SelectItem>
                            <SelectItem value="month">За месяц</SelectItem>
                            <SelectItem value="year">За год</SelectItem>
                        </SelectContent>
                    </Select>
                </div>


                {loading ? (
                    <p className="text-center">Загрузка аналитики...</p>
                ) : stats ? (
                    <div className="space-y-8">
                        {/* Карточки с общей статистикой */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="shadow-card hover-lift">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Выручка за этот месяц</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.currentMonthRevenue.toLocaleString('ru-RU')} тг</div>
                                    <p className={`text-xs ${stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange}% по сравнению с прошлым месяцем
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-card hover-lift">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Продаж в этом месяце</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.currentMonthSalesCount}</div>
                                    <p className="text-xs text-muted-foreground">Всего транзакций</p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-card hover-lift">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Выручка за прошлый месяц</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.prevMonthRevenue.toLocaleString('ru-RU')} тг</div>
                                    <p className="text-xs text-muted-foreground">Итого за предыдущий период</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Динамический график */}
                        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <CardHeader>
                                <CardTitle>{getChartTitle()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={timeSeriesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
                                            <Tooltip
                                                cursor={{ fill: 'hsl(var(--accent))', radius: 4 }}
                                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <Bar dataKey="total" name="Выручка" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* График по категориям */}
                        <Card className="shadow-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <CardHeader>
                                <CardTitle>Продажи по категориям ({period === 'week' ? 'за неделю' : period === 'month' ? 'за месяц' : 'за год'})</CardTitle>
                                <CardDescription>Общая выручка по каждой категории товаров.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
                                            <Tooltip
                                                cursor={{ fill: 'hsl(var(--accent))', radius: 4 }}
                                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                            />
                                            <Legend iconType="circle" />
                                            <Bar dataKey="total" name="Выручка" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <p className="text-center text-red-500">Не удалось загрузить аналитику.</p>
                )}
            </div>
        </section>
    );
};

export default AnalyticsOverview;

