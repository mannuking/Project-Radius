import * as XLSX from 'xlsx';

interface InvoiceData {
  invoiceId: string;
  date: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: string;
  overdueDays: number;
}

export class ExcelService {
  static async parseExcelFile(file: File): Promise<InvoiceData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Assume first sheet
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Transform data to match our interface
          const invoices: InvoiceData[] = jsonData.map((row: any) => ({
            invoiceId: row['Invoice ID'] || '',
            date: row['Date'] || '',
            customerId: row['Customer ID'] || '',
            customerName: row['Customer Name'] || '',
            amount: parseFloat(row['Amount'] || '0'),
            dueDate: row['Due Date'] || '',
            status: row['Status'] || '',
            overdueDays: parseInt(row['Overdue Days'] || '0'),
          }));
          
          resolve(invoices);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  static calculateMetrics(invoices: InvoiceData[]) {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const overdueInvoices = invoices.filter(inv => inv.overdueDays > 0);
    const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    const metrics = {
      totalAmount,
      overdueAmount,
      overduePercentage: (overdueAmount / totalAmount) * 100,
      totalInvoices: invoices.length,
      overdueInvoices: overdueInvoices.length,
      averageOverdueDays: overdueInvoices.length > 0
        ? overdueInvoices.reduce((sum, inv) => sum + inv.overdueDays, 0) / overdueInvoices.length
        : 0,
    };
    
    return metrics;
  }

  static getMonthlyData(invoices: InvoiceData[]) {
    const monthlyData = new Map<string, { total: number, collected: number }>();
    
    invoices.forEach(invoice => {
      const month = new Date(invoice.date).toLocaleString('default', { month: 'short' });
      const current = monthlyData.get(month) || { total: 0, collected: 0 };
      
      current.total += invoice.amount;
      if (invoice.status.toLowerCase() === 'paid') {
        current.collected += invoice.amount;
      }
      
      monthlyData.set(month, current);
    });
    
    return monthlyData;
  }

  static getTopCustomers(invoices: InvoiceData[], limit: number = 5) {
    const customerTotals = new Map<string, { name: string, total: number }>();
    
    invoices.forEach(invoice => {
      const current = customerTotals.get(invoice.customerId) || { 
        name: invoice.customerName, 
        total: 0 
      };
      current.total += invoice.amount;
      customerTotals.set(invoice.customerId, current);
    });
    
    return Array.from(customerTotals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, limit);
  }

  static getAgingBuckets(invoices: InvoiceData[]) {
    const aging = {
      '0-30': 0,
      '31-60': 0,
      '61-90': 0,
      '90+': 0
    };
    
    invoices.forEach(invoice => {
      if (invoice.overdueDays <= 30) aging['0-30'] += invoice.amount;
      else if (invoice.overdueDays <= 60) aging['31-60'] += invoice.amount;
      else if (invoice.overdueDays <= 90) aging['61-90'] += invoice.amount;
      else aging['90+'] += invoice.amount;
    });
    
    return aging;
  }
} 
