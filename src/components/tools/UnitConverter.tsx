import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeftRight,
  Ruler,
  Scale,
  Thermometer,
  HardDrive,
  Gauge,
  Maximize2,
  Zap,
} from 'lucide-react';

type UnitCategory = 'length' | 'mass' | 'temp' | 'storage' | 'speed' | 'area' | 'energy';

interface UnitDef {
  id: string;
  nameAr: string;
  nameEn: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const UNITS: Record<UnitCategory, { nameAr: string; nameEn: string; icon: any; units: UnitDef[] }> = {
  length: {
    nameAr: 'الطول والمسافات',
    nameEn: 'Length & Distance',
    icon: Ruler,
    units: [
      { id: 'm', nameAr: 'متر', nameEn: 'Meter', symbol: 'm', toBase: v => v, fromBase: v => v },
      { id: 'km', nameAr: 'كيلومتر', nameEn: 'Kilometer', symbol: 'km', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cm', nameAr: 'سنتيمتر', nameEn: 'Centimeter', symbol: 'cm', toBase: v => v / 100, fromBase: v => v * 100 },
      { id: 'mm', nameAr: 'ميليمتر', nameEn: 'Millimeter', symbol: 'mm', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mi', nameAr: 'ميل', nameEn: 'Mile', symbol: 'mi', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
      { id: 'yd', nameAr: 'ياردة', nameEn: 'Yard', symbol: 'yd', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { id: 'ft', nameAr: 'قدم', nameEn: 'Foot', symbol: 'ft', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { id: 'in', nameAr: 'بوصة', nameEn: 'Inch', symbol: 'in', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ],
  },
  mass: {
    nameAr: 'الكتلة والوزن',
    nameEn: 'Mass & Weight',
    icon: Scale,
    units: [
      { id: 'kg', nameAr: 'كيلوجرام', nameEn: 'Kilogram', symbol: 'kg', toBase: v => v, fromBase: v => v },
      { id: 'g', nameAr: 'جرام', nameEn: 'Gram', symbol: 'g', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { id: 'mg', nameAr: 'ميليجرام', nameEn: 'Milligram', symbol: 'mg', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
      { id: 't', nameAr: 'طن متري', nameEn: 'Metric Ton', symbol: 't', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'lb', nameAr: 'رطل (باوند)', nameEn: 'Pound', symbol: 'lb', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
      { id: 'oz', nameAr: 'أونصة', nameEn: 'Ounce', symbol: 'oz', toBase: v => v * 0.028349523125, fromBase: v => v / 0.028349523125 },
    ],
  },
  temp: {
    nameAr: 'درجات الحرارة',
    nameEn: 'Temperature',
    icon: Thermometer,
    units: [
      { id: 'c', nameAr: 'درجة مئوية', nameEn: 'Celsius', symbol: '°C', toBase: v => v, fromBase: v => v },
      { id: 'f', nameAr: 'فهرنهايت', nameEn: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * 9) / 5 + 32 },
      { id: 'k', nameAr: 'كلفن', nameEn: 'Kelvin', symbol: 'K', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  storage: {
    nameAr: 'التخزين الرقمي',
    nameEn: 'Digital Storage',
    icon: HardDrive,
    units: [
      { id: 'mb', nameAr: 'ميجابايت', nameEn: 'Megabyte', symbol: 'MB', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
      { id: 'b', nameAr: 'بايت', nameEn: 'Byte', symbol: 'B', toBase: v => v, fromBase: v => v },
      { id: 'kb', nameAr: 'كيلوبايت', nameEn: 'Kilobyte', symbol: 'KB', toBase: v => v * 1024, fromBase: v => v / 1024 },
      { id: 'gb', nameAr: 'جيجابايت', nameEn: 'Gigabyte', symbol: 'GB', toBase: v => v * Math.pow(1024, 3), fromBase: v => v / Math.pow(1024, 3) },
      { id: 'tb', nameAr: 'تيرابايت', nameEn: 'Terabyte', symbol: 'TB', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
    ],
  },
  speed: {
    nameAr: 'السرعة',
    nameEn: 'Speed',
    icon: Gauge,
    units: [
      { id: 'kmh', nameAr: 'كم / ساعة', nameEn: 'km/h', symbol: 'km/h', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { id: 'ms', nameAr: 'متر / ثانية', nameEn: 'm/s', symbol: 'm/s', toBase: v => v, fromBase: v => v },
      { id: 'mph', nameAr: 'ميل / ساعة', nameEn: 'mph', symbol: 'mph', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { id: 'knot', nameAr: 'عقدة بحرية', nameEn: 'Knot', symbol: 'kn', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ],
  },
  area: {
    nameAr: 'المساحة',
    nameEn: 'Area',
    icon: Maximize2,
    units: [
      { id: 'sqm', nameAr: 'متر مربع', nameEn: 'Square Meter', symbol: 'm²', toBase: v => v, fromBase: v => v },
      { id: 'sqkm', nameAr: 'كيلومتر مربع', nameEn: 'Square Km', symbol: 'km²', toBase: v => v * 1000000, fromBase: v => v / 1000000 },
      { id: 'ha', nameAr: 'هكتار', nameEn: 'Hectare', symbol: 'ha', toBase: v => v * 10000, fromBase: v => v / 10000 },
      { id: 'acre', nameAr: 'فدان (أكر)', nameEn: 'Acre', symbol: 'ac', toBase: v => v * 4046.8564224, fromBase: v => v / 4046.8564224 },
      { id: 'sqft', nameAr: 'قدم مربع', nameEn: 'Square Foot', symbol: 'ft²', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    ],
  },
  energy: {
    nameAr: 'الطاقة والعمل',
    nameEn: 'Energy',
    icon: Zap,
    units: [
      { id: 'j', nameAr: 'جول', nameEn: 'Joule', symbol: 'J', toBase: v => v, fromBase: v => v },
      { id: 'kj', nameAr: 'كيلوجول', nameEn: 'Kilojoule', symbol: 'kJ', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { id: 'cal', nameAr: 'سعرة حرارية', nameEn: 'Calorie', symbol: 'cal', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
      { id: 'kcal', nameAr: 'كيلو سعرة', nameEn: 'Kilocalorie', symbol: 'kcal', toBase: v => v * 4184, fromBase: v => v / 4184 },
      { id: 'kwh', nameAr: 'كيلوواط ساعي', nameEn: 'kWh', symbol: 'kWh', toBase: v => v * 3600000, fromBase: v => v / 3600000 },
    ],
  },
};

export const UnitConverter: React.FC = () => {
  const { t, language } = useApp();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<number>(100);
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');

  const currentCategory = UNITS[category];

  // Auto ensure valid selected units when category changes
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const catUnits = UNITS[newCat].units;
    setFromUnitId(catUnits[0].id);
    setToUnitId(catUnits[1]?.id || catUnits[0].id);
  };

  const fromUnit = currentCategory.units.find(u => u.id === fromUnitId) || currentCategory.units[0];
  const toUnit = currentCategory.units.find(u => u.id === toUnitId) || currentCategory.units[1] || currentCategory.units[0];

  // Calculate conversion
  const convertedResult = useMemo(() => {
    if (isNaN(inputValue)) return 0;
    const baseVal = fromUnit.toBase(inputValue);
    const targetVal = toUnit.fromBase(baseVal);
    return parseFloat(targetVal.toFixed(6));
  }, [inputValue, fromUnit, toUnit]);

  // Convert to ALL units in current category for quick reference
  const allConversions = useMemo(() => {
    if (isNaN(inputValue)) return [];
    const baseVal = fromUnit.toBase(inputValue);
    return currentCategory.units.map(u => {
      const res = u.fromBase(baseVal);
      return {
        unit: u,
        value: parseFloat(res.toFixed(6)),
      };
    });
  }, [inputValue, fromUnit, currentCategory]);

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  return (
    <div className="space-y-6" id="unit-converter-tool">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
        {Object.entries(UNITS).map(([key, cat]) => {
          const Icon = cat.icon;
          const isActive = category === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryChange(key as UnitCategory)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* From Box (5 cols) */}
        <div className="md:col-span-5 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('from')}
          </label>
          <div className="space-y-2">
            <input
              type="number"
              value={inputValue}
              onChange={e => setInputValue(parseFloat(e.target.value) || 0)}
              className="w-full p-3 text-xl font-bold font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <select
              value={fromUnitId}
              onChange={e => setFromUnitId(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            >
              {currentCategory.units.map(u => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? `${u.nameAr} (${u.symbol})` : `${u.nameEn} (${u.symbol})`}
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
            {t('to')}
          </label>
          <div className="space-y-2">
            <div className="w-full p-3 text-xl font-bold font-mono bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-indigo-900 dark:text-indigo-200 select-all truncate">
              {convertedResult}
            </div>
            <select
              value={toUnitId}
              onChange={e => setToUnitId(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            >
              {currentCategory.units.map(u => (
                <option key={u.id} value={u.id}>
                  {language === 'ar' ? `${u.nameAr} (${u.symbol})` : `${u.nameEn} (${u.symbol})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Unit Quick Reference Grid */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {language === 'ar' ? 'جدول التحويل الشامل لجميع الوحدات' : 'All Unit Equivalents'}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allConversions.map(item => (
            <div
              key={item.unit.id}
              className={`p-3 rounded-xl border transition-all ${
                item.unit.id === toUnitId
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="text-[11px] opacity-75 font-semibold">
                {language === 'ar' ? item.unit.nameAr : item.unit.nameEn}
              </div>
              <div className="text-sm font-bold font-mono mt-0.5 break-all">
                {item.value} <span className="text-xs font-normal opacity-80">{item.unit.symbol}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
