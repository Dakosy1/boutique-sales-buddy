import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, ListChecks, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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

interface SalesReportProps {
  startDate?: Date;
  endDate?: Date;
  selectedCategory: string;
  selectedPaymentMethod: string;
}

const SalesReport = ({ startDate, endDate, selectedCategory, selectedPaymentMethod }: SalesReportProps) => {
    const { toast } = useToast();
    const [sales, setSales] = useState<Sale[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingSale, setEditingSale] = useState<Sale | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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

        if (selectedCategory !== 'all') query = query.eq('category', selectedCategory);
        if (selectedPaymentMethod !== 'all') query = query.eq('payment_method', selectedPaymentMethod);

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

    useEffect(() => {
        fetchSales();
    }, [startDate, endDate, selectedCategory, selectedPaymentMethod]);

    const handleEditClick = (sale: Sale) => {
        setEditingSale({ ...sale });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = async (saleId: number) => {
        if (window.confirm('Вы уверены?')) {
            const { error } = await supabase.from('sales').delete().match({ id: saleId });
            if (error) {
                toast({ title: "Ошибка", description: error.message, variant: "destructive" });
            } else {
                toast({ title: "Успех", description: "Продажа удалена." });
                fetchSales();
            }
        }
    };

    const handleUpdateSale = async () => {
        if (!editingSale) return;
        const { error } = await supabase
            .from('sales')
            .update({ 
                amount: editingSale.amount, 
                category: editingSale.category, 
                payment_method: editingSale.payment_method 
            })
            .match({ id: editingSale.id });
        
        if (error) {
            toast({ title: "Ошибка", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Успех", description: "Продажа обновлена." });
            setIsDialogOpen(false);
            setEditingSale(null);
            fetchSales();
        }
    };

    return (
    <>
        <Card className="shadow-card animate-scale-in">
            <CardContent className="pt-6">
                {loading ? (
                    <p className="text-center p-8 text-muted-foreground">Загрузка продаж...</p>
                ) : error ? (
                    <Alert variant="destructive"><AlertTitle>Ошибка</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
                ) : sales.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Нет данных о продажах за выбранный период.</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Дата и Время</TableHead>
                                <TableHead>Категория</TableHead>
                                <TableHead>Способ оплаты</TableHead>
                                <TableHead className="text-right">Сумма</TableHead>
                                <TableHead className="w-[100px] text-center">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales.map((sale) => (
                                <TableRow key={sale.id}>
                                    <TableCell>{new Date(sale.created_at).toLocaleString('ru-RU')}</TableCell>
                                    <TableCell>{sale.category}</TableCell>
                                    <TableCell>{sale.payment_method}</TableCell>
                                    <TableCell className="text-right font-medium">{sale.amount.toLocaleString('ru-RU')} тг</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(sale)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(sale.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
                <div className="flex items-center text-lg font-bold"><ListChecks className="h-5 w-5 mr-2" />Итого продаж:</div>
                <div className="text-2xl font-bold text-primary flex items-center"><DollarSign className="h-6 w-6 mr-2" />{total.toLocaleString('ru-RU')} тг</div>
            </CardFooter>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Редактировать продажу</DialogTitle></DialogHeader>
                {editingSale && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-amount">Сумма</Label>
                            <Input id="edit-amount" type="number" value={editingSale.amount} onChange={(e) => setEditingSale({ ...editingSale, amount: parseFloat(e.target.value) || 0 })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Категория</Label>
                            <Select value={editingSale.category} onValueChange={(value) => setEditingSale({ ...editingSale, category: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{categories.filter(c => c.value !== 'all').map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-payment">Способ оплаты</Label>
                            <Select value={editingSale.payment_method} onValueChange={(value) => setEditingSale({ ...editingSale, payment_method: value })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>{paymentMethods.filter(p => p.value !== 'all').map((method) => (<SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Отмена</Button></DialogClose>
                    <Button onClick={handleUpdateSale}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    );
};

export default SalesReport;