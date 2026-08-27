import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, RefreshCw, KeyRound, ShieldAlert, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const MEMORABLE_WORDS = [
  'apple', 'breeze', 'cloud', 'delta', 'eagle', 'forest', 'galaxy', 'horizon',
  'island', 'jungle', 'knight', 'lemon', 'matrix', 'nebula', 'ocean', 'planet',
  'quantum', 'river', 'solar', 'timber', 'unity', 'vector', 'winter', 'zenith',
  'anchor', 'beacon', 'canyon', 'dragon', 'ember', 'falcon', 'glacier', 'haven',
  'ignite', 'jasper', 'kinetic', 'lunar', 'magnet', 'nova', 'orbit', 'pulse',
  'radar', 'shadow', 'titan', 'valley', 'vortex', 'whisper', 'yonder', 'zephyr'
];

export const PasswordGenerator: React.FC = () => {
  const { t, language } = useApp();
  const [length, setLength] = useState<number>(18);
  const [useUpper, setUseUpper] = useState<boolean>(true);
  const [useLower, setUseLower] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [isPassphrase, setIsPassphrase] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState<number>(4);
  const [passphraseSeparator, setPassphraseSeparator] = useState<string>('-');
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateSinglePassword = (): string => {
    if (isPassphrase) {
      const selectedWords: string[] = [];
      const array = new Uint32Array(wordCount);
      crypto.getRandomValues(array);

      for (let i = 0; i < wordCount; i++) {
        const wordIndex = array[i] % MEMORABLE_WORDS.length;
        let word = MEMORABLE_WORDS[wordIndex];
        if (useUpper) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        selectedWords.push(word);
      }

      let res = selectedWords.join(passphraseSeparator);
      if (useNumbers) {
        const num = Math.floor(Math.random() * 90) + 10;
        res += `${passphraseSeparator}${num}`;
      }
      return res;
    }

    let charset = '';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (useUpper) charset += upper;
    if (useLower) charset += lower;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (excludeAmbiguous) {
      charset = charset.replace(/[1lIO0o]/g, '');
    }

    if (!charset) charset = lower;

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  };

  const generateAllPasswords = () => {
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      list.push(generateSinglePassword());
    }
    setPasswords(list);
  };

  useEffect(() => {
    generateAllPasswords();
  }, [
    length,
    useUpper,
    useLower,
    useNumbers,
    useSymbols,
    excludeAmbiguous,
    isPassphrase,
    wordCount,
    passphraseSeparator,
    bulkCount,
  ]);

  const primaryPassword = passwords[0] || '';

  // Calculate Entropy and Strength
  const strengthInfo = useMemo(() => {
    if (!primaryPassword) return { score: 0, label: t('weak'), color: 'text-red-500', bg: 'bg-red-500', bits: 0 };

    let poolSize = 0;
    if (isPassphrase) {
      poolSize = MEMORABLE_WORDS.length;
      const bits = Math.round(wordCount * Math.log2(poolSize));
      let label = t('strong');
      let color = 'text-emerald-500';
      let bg = 'bg-emerald-500';

      if (bits < 40) {
        label = t('weak');
        color = 'text-red-500';
        bg = 'bg-red-500';
      } else if (bits < 60) {
        label = t('medium');
        color = 'text-amber-500';
        bg = 'bg-amber-500';
      } else if (bits >= 80) {
        label = t('veryStrong');
        color = 'text-emerald-600 dark:text-emerald-400';
        bg = 'bg-emerald-600';
      }
      return { score: Math.min(100, bits), label, color, bg, bits };
    }

    if (useUpper) poolSize += 26;
    if (useLower) poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 28;
    if (poolSize === 0) poolSize = 26;

    const bits = Math.round(primaryPassword.length * Math.log2(poolSize));
    let label = t('weak');
    let color = 'text-rose-500';
    let bg = 'bg-rose-500';

    if (bits >= 90) {
      label = t('veryStrong');
      color = 'text-emerald-600 dark:text-emerald-400';
      bg = 'bg-emerald-600';
    } else if (bits >= 65) {
      label = t('strong');
      color = 'text-emerald-500';
      bg = 'bg-emerald-500';
    } else if (bits >= 45) {
      label = t('medium');
      color = 'text-amber-500';
      bg = 'bg-amber-500';
    }

    return { score: Math.min(100, Math.round((bits / 110) * 100)), label, color, bg, bits };
  }, [primaryPassword, isPassphrase, wordCount, useUpper, useLower, useNumbers, useSymbols, t]);

  const handleCopy = (pwd: string, index: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedIndex(index);
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6" id="password-generator-tool">
      {/* Generated Primary Password Display */}
      <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl border border-slate-800 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            {t('passwordStrength')}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${strengthInfo.color}`}>{strengthInfo.label}</span>
            <span className="text-[11px] text-slate-500">({strengthInfo.bits} bits entropy)</span>
          </div>
        </div>

        {/* Password Output Box */}
        <div className="flex items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          <span className="font-mono text-lg md:text-xl font-bold tracking-wide break-all text-indigo-200 select-all">
            {primaryPassword}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={generateAllPasswords}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Regenerate"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => handleCopy(primaryPassword, 0)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md cursor-pointer"
            >
              {copiedIndex === 0 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedIndex === 0 ? t('copied') : t('copy')}
            </button>
          </div>
        </div>

        {/* Strength Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthInfo.bg}`}
            style={{ width: `${strengthInfo.score}%` }}
          />
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Left Column: Sliders & Modes */}
        <div className="space-y-5">
          {/* Mode Switch: Standard Password vs Passphrase */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsPassphrase(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isPassphrase ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {language === 'ar' ? 'كلمة مرور عشوائية' : 'Random Password'}
            </button>
            <button
              type="button"
              onClick={() => setIsPassphrase(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isPassphrase ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t('passphraseMode')}
            </button>
          </div>

          {!isPassphrase ? (
            /* Length Slider */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t('length')}</span>
                <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">{length}</span>
              </div>
              <input
                type="range"
                min={6}
                max={64}
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>6 chars</span>
                <span>32 chars</span>
                <span>64 chars</span>
              </div>
            </div>
          ) : (
            /* Passphrase Word Count & Separator */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{language === 'ar' ? 'عدد الكلمات' : 'Word Count'}</span>
                  <span className="font-mono text-base font-bold text-indigo-600 dark:text-indigo-400">{wordCount}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  value={wordCount}
                  onChange={e => setWordCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{language === 'ar' ? 'الفاصل بين الكلمات' : 'Separator'}</span>
                <div className="flex items-center gap-1">
                  {['-', '_', '.', ' ', '#'].map(sep => (
                    <button
                      key={sep}
                      type="button"
                      onClick={() => setPassphraseSeparator(sep)}
                      className={`w-7 h-7 text-xs font-mono font-bold rounded-md border transition-all ${
                        passphraseSeparator === sep
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {sep === ' ' ? '␣' : sep}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bulk Generation Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'ar' ? 'توليد كلمات مرور متعددة دفعة واحدة' : 'Bulk Generation Count'}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{bulkCount}</span>
            </label>
            <div className="flex gap-2">
              {[1, 5, 10].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBulkCount(n)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    bulkCount === n
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {n} {n === 1 ? (language === 'ar' ? 'واحدة' : 'item') : (language === 'ar' ? 'كلمات' : 'items')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Character Set Checkboxes */}
        <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {language === 'ar' ? 'مجموعات الرموز المضمنة' : 'Character Sets'}
          </h4>

          <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('includeUppercase')}</span>
            <input
              type="checkbox"
              checked={useUpper}
              onChange={e => setUseUpper(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('includeLowercase')}</span>
            <input
              type="checkbox"
              checked={useLower}
              onChange={e => setUseLower(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('includeNumbers')}</span>
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={e => setUseNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
            />
          </label>

          {!isPassphrase && (
            <>
              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('includeSymbols')}</span>
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={e => setUseSymbols(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{t('excludeAmbiguous')}</span>
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={e => setExcludeAmbiguous(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Bulk Passwords List (if bulk > 1) */}
      {bulkCount > 1 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {language === 'ar' ? 'قائمة كلمات المرور المولدة' : 'Generated Passwords Batch'}
          </h4>
          <div className="space-y-2">
            {passwords.map((pwd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
              >
                <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 break-all select-all">
                  {pwd}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(pwd, idx)}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 cursor-pointer shrink-0"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
