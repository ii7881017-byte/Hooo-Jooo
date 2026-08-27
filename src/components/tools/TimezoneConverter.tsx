import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Globe, Calendar, RefreshCw, Copy, Check } from 'lucide-react';

interface CityTimezone {
  id: string;
  nameAr: string;
  nameEn: string;
  tz: string;
  flag: string;
}

const CITIES: CityTimezone[] = [
  { id: 'riyadh', nameAr: 'الرياض / مكة', nameEn: 'Riyadh', tz: 'Asia/Riyadh', flag: '🇸🇦' },
  { id: 'cairo', nameAr: 'القاهرة', nameEn: 'Cairo', tz: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'dubai', nameAr: 'دبي / أبوظبي', nameEn: 'Dubai', tz: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'london', nameAr: 'لندن (GMT/UTC)', nameEn: 'London (UTC)', tz: 'Europe/London', flag: '🇬🇧' },
  { id: 'newyork', nameAr: 'نيويورك (EST)', nameEn: 'New York', tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'paris', nameAr: 'باريس / برلين', nameEn: 'Paris / Berlin', tz: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'tokyo', nameAr: 'طوكيو', nameEn: 'Tokyo', tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'sydney', nameAr: 'سيدني', nameEn: 'Sydney', tz: 'Australia/Sydney', flag: '🇦🇺' },
];

export const TimezoneConverter: React.FC = () => {
  const { t, language } = useApp();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedTimestamp, setSelectedTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [customDate, setCustomDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [sliderHour, setSliderHour] = useState<number>(new Date().getHours());
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [copiedEpoch, setCopiedEpoch] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCityTime = (tz: string, date: Date) => {
    try {
      const timeStr = date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour,
      });

      const dateStr = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      return { timeStr, dateStr };
    } catch {
      return { timeStr: '--:--', dateStr: '--' };
    }
  };

  const handleCustomDateChange = (val: string) => {
    setCustomDate(val);
    const parsed = new Date(val);
    if (!isNaN(parsed.getTime())) {
      setSelectedTimestamp(Math.floor(parsed.getTime() / 1000));
    }
  };

  const handleEpochChange = (epoch: number) => {
    setSelectedTimestamp(epoch);
    const d = new Date(epoch * 1000);
    if (!isNaN(d.getTime())) {
      setCustomDate(d.toISOString().slice(0, 16));
    }
  };

  const handleCopyEpoch = () => {
    navigator.clipboard.writeText(String(selectedTimestamp));
    setCopiedEpoch(true);
    setTimeout(() => setCopiedEpoch(false), 2000);
  };

  // Planned date based on slider hour
  const plannedDate = new Date();
  plannedDate.setHours(sliderHour, 0, 0, 0);

  return (
    <div className="space-y-6" id="timezone-converter-tool">
      {/* Top Header with Format toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {language === 'ar' ? 'الساعات العالمية والمناطق الزمنية' : 'World Clock Hub'}
          </h3>
        </div>

        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setIs24Hour(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              !is24Hour ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            12 Hours (AM/PM)
          </button>
          <button
            type="button"
            onClick={() => setIs24Hour(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              is24Hour ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            24 Hours
          </button>
        </div>
      </div>

      {/* World Clock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CITIES.map(city => {
          const { timeStr, dateStr } = formatCityTime(city.tz, currentTime);
          return (
            <div
              key={city.id}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-indigo-400 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{city.flag}</span>
                <span className="text-[11px] font-medium text-slate-400 font-mono">{city.tz.split('/')[1]}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {language === 'ar' ? city.nameAr : city.nameEn}
              </h4>
              <div className="text-2xl font-extrabold font-mono text-indigo-600 dark:text-indigo-400 tracking-tight">
                {timeStr}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{dateStr}</div>
            </div>
          );
        })}
      </div>

      {/* Meeting Time Planner / Slider */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{language === 'ar' ? 'مخطط الاجتماعات الدولي (مزامنة الوقت)' : 'International Meeting Planner'}</span>
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'ar' ? 'حرك الشريط لمشاهدة توافق الساعات في مختلف العواصم في نفس اللحظة' : 'Slide to inspect time correspondences across international cities'}
            </p>
          </div>
          <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400 px-3 py-1 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
            {sliderHour.toString().padStart(2, '0')}:00
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={23}
          value={sliderHour}
          onChange={e => setSliderHour(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />

        {/* Cities at selected slider hour */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {CITIES.map(c => {
            const { timeStr } = formatCityTime(c.tz, plannedDate);
            return (
              <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 block truncate">{c.flag} {language === 'ar' ? c.nameAr : c.nameEn}</span>
                <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 mt-1 block">{timeStr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unix Epoch Timestamp Converter */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>{language === 'ar' ? 'محول الطابع الزمني (Unix Timestamp)' : 'Unix Timestamp Converter'}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Epoch to Date */}
          <div className="space-y-1.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Unix Epoch (Seconds)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={selectedTimestamp}
                onChange={e => handleEpochChange(Number(e.target.value))}
                className="flex-1 p-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
              />
              <button
                type="button"
                onClick={handleCopyEpoch}
                className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                {copiedEpoch ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleEpochChange(Math.floor(Date.now() / 1000))}
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline pt-1 inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              {language === 'ar' ? 'استخدم الوقت الحالي الآن' : 'Set to Current Time'}
            </button>
          </div>

          {/* Date to Epoch */}
          <div className="space-y-1.5 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {language === 'ar' ? 'التاريخ والوقت المحلي' : 'Local Date & Time'}
            </label>
            <input
              type="datetime-local"
              value={customDate}
              onChange={e => handleCustomDateChange(e.target.value)}
              className="w-full p-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
            />
            <div className="text-[11px] font-mono text-slate-500 pt-1 truncate">
              UTC ISO: {new Date(selectedTimestamp * 1000).toISOString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
