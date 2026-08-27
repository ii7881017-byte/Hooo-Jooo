import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeftRight, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';

interface CurrencyInfo {
  code: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  rateToUsd: number; // 1 USD = X Currency
  flag: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', symbol: '$', rateToUsd: 1.0, flag: '🇺🇸' },
  { code: 'EUR', nameAr: 'يورو أوروبي', nameEn: 'Euro', symbol: '€', rateToUsd: 0.92, flag: '🇪🇺' },
  { code: 'SAR', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', symbol: '﷼', rateToUsd: 3.75, flag: '🇸🇦' },
  { code: 'AED', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', symbol: 'د.إ', rateToUsd: 3.67, flag: '🇦🇪' },
  { code: 'EGP', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound', symbol: 'E£', rateToUsd: 49.2, flag: '🇪🇬' },
  { code: 'KWD', nameAr: 'دينار كويتي', nameEn: 'Kuwaiti Dinar', symbol: 'KD', rateToUsd: 0.308, flag: '🇰🇼' },
  { code: 'QAR', nameAr: 'ريال قطري', nameEn: 'Qatari Riyal', symbol: 'QR', rateToUsd: 3.64, flag: '🇶🇦' },
  { code: 'GBP', nameAr: 'جنيه إسترليني', nameEn: 'British Pound', symbol: '£', rateToUsd: 0.79, flag: '🇬🇧' },
  { code: 'TRY', nameAr: 'ليرة تركية', nameEn: 'Turkish Lira', symbol: '₺', rateToUsd: 35.8, flag: '🇹🇷' },
  { code: 'JPY', nameAr: 'ين ياباني', nameEn: 'Japanese Yen', symbol: '¥', rateToUsd: 153.5, flag: '🇯🇵' },
  { code: 'CAD', nameAr: 'دولار كندي', nameEn: 'Canadian Dollar', symbol: 'C$', rateToUsd: 1.41, flag: '🇨🇦' },
  { code: 'AUD', nameAr: 'دولار أسترالي', nameEn: 'Australian Dollar', symbol: 'A$', rateToUsd: 1.54, flag: '🇦🇺' },
  { code: 'CHF', nameAr: 'فرنك سويسري', nameEn: 'Swiss Franc', symbol: 'CHF', rateToUsd: 0.88, flag: '🇨🇭' },
  { code: 'CNY', nameAr: 'يوان صيني', nameEn: 'Chinese Yuan', symbol: '¥', rateToUsd: 7.24, flag: '🇨🇳' },
  { code: 'INR', nameAr: 'روبية هندية', nameEn: 'Indian Rupee', symbol: '₹', rateToUsd: 84.5, flag: '🇮🇳' },
  { code: 'BTC', nameAr: 'بيتكوين', nameEn: 'Bitcoin', symbol: '₿', rateToUsd: 0.0000105, flag: '🪙' },
  { code: 'ETH', nameAr: 'إيثيريوم', nameEn: 'Ethereum', symbol: 'Ξ', rateToUsd: 0.00037, flag: '💎' },
  { code: 'SOL', nameAr: 'سولانا', nameEn: 'Solana', symbol: '◎', rateToUsd: 0.0052, flag: '⚡' },
];

export const CurrencyConverter: React.FC = () => {
  const { t, language } = useApp();
  const [amount, setAmount] = useState<number>(1000);
  const [fromCode, setFromCode] = useState<string>('USD');
  const [toCode, setToCode] = useState<string>('SAR');

  const fromCurr = CURRENCIES.find(c => c.code === fromCode) || CURRENCIES[0];
  const toCurr = CURRENCIES.find(c => c.code === toCode) || CURRENCIES[2];

  // Conversion logic: (Amount / fromRateToUsd) * toRateToUsd
  const convertedAmount = useMemo(() => {
    if (isNaN(amount) || amount <= 0) return 0;
    const inUsd = amount / fromCurr.rateToUsd;
    const finalAmount = inUsd * toCurr.rateToUsd;
    return parseFloat(finalAmount.toFixed(4));
  }, [amount, fromCurr, toCurr]);

  const exchangeRate = useMemo(() => {
    return parseFloat((toCurr.rateToUsd / fromCurr.rateToUsd).toFixed(4));
  }, [fromCurr, toCurr]);

  // Multi-currency preview list
  const multiCurrencyList = useMemo(() => {
    if (isNaN(amount) || amount <= 0) return [];
    const inUsd = amount / fromCurr.rateToUsd;
    return CURRENCIES.filter(c => c.code !== fromCode).map(c => {
      return {
        ...c,
        converted: parseFloat((inUsd * c.rateToUsd).toFixed(2)),
      };
    });
  }, [amount, fromCurr, fromCode]);

  const handleSwap = () => {
    const temp = fromCode;
    setFromCode(toCode);
    setToCode(temp);
  };

  return (
    <div className="space-y-6" id="currency-converter-tool">
      {/* Rate Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            {language === 'ar' ? 'سعر الصرف المرجعي' : 'Reference Exchange Rate'}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold font-mono mt-1">
            1 {fromCurr.code} = {exchangeRate} {toCurr.code}
          </h2>
        </div>
        <div className="text-end text-xs text-slate-400">
          <span>{language === 'ar' ? 'تحديث فوري لأسعار الصرف' : 'Instant Benchmark Rate'}</span>
        </div>
      </div>

      {/* Main Conversion Panel */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* From Box (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('from')} ({fromCurr.flag} {fromCurr.code})
          </label>
          <div className="space-y-2">
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-3 text-xl font-bold font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span className="absolute end-3 top-3.5 text-sm font-bold text-slate-400">{fromCurr.symbol}</span>
            </div>

            <select
              value={fromCode}
              onChange={e => setFromCode(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {language === 'ar' ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button (1 col) */}
        <div className="md:col-span-1 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-full transition-all shadow-xs cursor-pointer"
            title="Swap"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* To Box (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('to')} ({toCurr.flag} {toCurr.code})
          </label>
          <div className="space-y-2">
            <div className="relative">
              <div className="w-full p-3 text-xl font-bold font-mono bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-900 dark:text-indigo-200 select-all truncate">
                {convertedAmount.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
              <span className="absolute end-3 top-3.5 text-sm font-bold text-indigo-500">{toCurr.symbol}</span>
            </div>

            <select
              value={toCode}
              onChange={e => setToCode(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {language === 'ar' ? c.nameAr : c.nameEn}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Currency Converter Grid */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {language === 'ar' ? `قيمة (${amount} ${fromCurr.code}) في العملات العالمية الأخرى` : `Value of (${amount} ${fromCurr.code}) in other currencies`}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {multiCurrencyList.map(c => (
            <div
              key={c.code}
              onClick={() => setToCode(c.code)}
              className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer transition-all flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{c.flag}</span>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{c.code}</span>
                  <p className="text-[10px] text-slate-400 truncate max-w-[90px]">{language === 'ar' ? c.nameAr : c.nameEn}</p>
                </div>
              </div>
              <div className="text-end">
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {c.converted.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </span>
                <span className="text-[10px] text-slate-400 ms-1">{c.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
