import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, Download, Table, DollarSign, Calendar, Percent } from 'lucide-react';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export const LoanCalculator: React.FC = () => {
  const { t, language } = useApp();
  const [loanAmount, setLoanAmount] = useState<number>(250000);
  const [annualRate, setAnnualRate] = useState<number>(5.5);
  const [loanYears, setLoanYears] = useState<number>(15);
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');

  // Compute Loan Amortization
  const loanStats = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = loanYears * 12;

    if (principal <= 0 || totalMonths <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }

    let baseMonthlyPayment = 0;
    if (monthlyRate === 0) {
      baseMonthlyPayment = principal / totalMonths;
    } else {
      baseMonthlyPayment =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const schedule: AmortizationRow[] = [];
    let currentBalance = principal;
    let accumulatedInterest = 0;
    let accumulatedPayment = 0;

    for (let m = 1; m <= totalMonths && currentBalance > 0; m++) {
      const interestForMonth = currentBalance * monthlyRate;
      let principalForMonth = baseMonthlyPayment - interestForMonth + extraPayment;

      if (principalForMonth > currentBalance) {
        principalForMonth = currentBalance;
      }

      const totalPaidThisMonth = principalForMonth + interestForMonth;
      currentBalance -= principalForMonth;
      accumulatedInterest += interestForMonth;
      accumulatedPayment += totalPaidThisMonth;

      schedule.push({
        month: m,
        payment: parseFloat(totalPaidThisMonth.toFixed(2)),
        principal: parseFloat(principalForMonth.toFixed(2)),
        interest: parseFloat(interestForMonth.toFixed(2)),
        balance: Math.max(0, parseFloat(currentBalance.toFixed(2))),
      });

      if (currentBalance <= 0) break;
    }

    return {
      monthlyPayment: parseFloat((baseMonthlyPayment + extraPayment).toFixed(2)),
      totalPayment: parseFloat(accumulatedPayment.toFixed(2)),
      totalInterest: parseFloat(accumulatedInterest.toFixed(2)),
      schedule,
    };
  }, [loanAmount, annualRate, loanYears, extraPayment]);

  const principalRatio =
    loanStats.totalPayment > 0
      ? Math.round((loanAmount / loanStats.totalPayment) * 100)
      : 50;
  const interestRatio = 100 - principalRatio;

  const handleDownloadCsv = () => {
    let csv = 'Month,Payment,Principal,Interest,Remaining Balance\n';
    loanStats.schedule.forEach(row => {
      csv += `${row.month},${row.payment},${row.principal},${row.interest},${row.balance}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amortization_schedule_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="loan-calculator-tool">
      {/* Top Input Configuration & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {language === 'ar' ? 'معطيات القرض / التمويل' : 'Loan Parameters'}
            </h4>
            <select
              value={currencySymbol}
              onChange={e => setCurrencySymbol(e.target.value)}
              className="text-xs font-bold p-1 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 outline-none"
            >
              <option value="$">$ USD</option>
              <option value="﷼">﷼ SAR</option>
              <option value="د.إ">د.إ AED</option>
              <option value="E£">E£ EGP</option>
              <option value="€">€ EUR</option>
            </select>
          </div>

          {/* Principal Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'ar' ? 'مبلغ القرض الأساسي' : 'Loan Principal'}</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {currencySymbol} {loanAmount.toLocaleString()}
              </span>
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={e => setLoanAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full p-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'ar' ? 'نسبة الفائدة / المرابحة السنوية (%)' : 'Annual Interest Rate (%)'}</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{annualRate}%</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={annualRate}
              onChange={e => setAnnualRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full p-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>

          {/* Term in Years */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'ar' ? 'مدة التمويل (سنوات)' : 'Loan Term (Years)'}</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{loanYears} {language === 'ar' ? 'سنة' : 'yrs'}</span>
            </label>
            <input
              type="range"
              min={1}
              max={35}
              value={loanYears}
              onChange={e => setLoanYears(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 yr</span>
              <span>15 yrs</span>
              <span>30 yrs</span>
            </div>
          </div>

          {/* Extra Monthly Payment */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'دفعة شهرية إضافية (اختياري)' : 'Extra Monthly Payment (Optional)'}
            </label>
            <input
              type="number"
              value={extraPayment}
              onChange={e => setExtraPayment(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0"
              className="w-full p-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
            />
          </div>
        </div>

        {/* Results & Visual Breakdown (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Main Monthly Payment Box */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {t('monthlyPayment')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 mt-2">
              {currencySymbol} {loanStats.monthlyPayment.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
            </h2>
            <span className="text-xs text-slate-400 mt-1 block">
              {loanStats.schedule.length} {language === 'ar' ? 'دفعة شهرية إجمالية' : 'total monthly payments'}
            </span>
          </div>

          {/* Totals Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">{t('totalPayment')}</span>
              <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 block">
                {currencySymbol} {loanStats.totalPayment.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-rose-500 block">{t('totalInterest')}</span>
              <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400 mt-1 block">
                {currencySymbol} {loanStats.totalInterest.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-600 dark:text-indigo-400">{language === 'ar' ? 'أصل القرض' : 'Principal'}: {principalRatio}%</span>
              <span className="text-rose-500">{language === 'ar' ? 'إجمالي الفائدة' : 'Interest'}: {interestRatio}%</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="bg-indigo-600 h-full" style={{ width: `${principalRatio}%` }} />
              <div className="bg-rose-500 h-full" style={{ width: `${interestRatio}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('amortizationSchedule')} ({loanStats.schedule.length} {language === 'ar' ? 'شهر' : 'months'})
            </h4>
          </div>
          <button
            type="button"
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {language === 'ar' ? 'تصدير كملف CSV' : 'Export CSV'}
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto font-mono text-xs">
          <table className="w-full text-start">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-2.5 text-start">#</th>
                <th className="p-2.5 text-end">{language === 'ar' ? 'الدفعة' : 'Payment'}</th>
                <th className="p-2.5 text-end">{language === 'ar' ? 'الأصل' : 'Principal'}</th>
                <th className="p-2.5 text-end">{language === 'ar' ? 'الفائدة' : 'Interest'}</th>
                <th className="p-2.5 text-end">{language === 'ar' ? 'الرصيد المتبقي' : 'Remaining'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loanStats.schedule.slice(0, 120).map(row => (
                <tr key={row.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                  <td className="p-2.5 font-bold text-slate-400">{row.month}</td>
                  <td className="p-2.5 text-end font-semibold">{currencySymbol} {row.payment.toLocaleString()}</td>
                  <td className="p-2.5 text-end text-emerald-600 dark:text-emerald-400">{currencySymbol} {row.principal.toLocaleString()}</td>
                  <td className="p-2.5 text-end text-rose-500">{currencySymbol} {row.interest.toLocaleString()}</td>
                  <td className="p-2.5 text-end font-bold">{currencySymbol} {row.balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
