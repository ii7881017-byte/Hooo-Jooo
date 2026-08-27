import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Pipette, Sparkles, RefreshCw, Layers } from 'lucide-react';

export const ColorStudio: React.FC = () => {
  const { t, language } = useApp();
  const [hexColor, setHexColor] = useState<string>('#6366f1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Helper conversions
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const num = parseInt(clean, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    h = ((h % 360) + 360) % 360;
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  };

  const { rgb, hsl, cmyk } = useMemo(() => {
    try {
      const rgbVal = hexToRgb(hexColor);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      const cmykVal = rgbToCmyk(rgbVal.r, rgbVal.g, rgbVal.b);
      return { rgb: rgbVal, hsl: hslVal, cmyk: cmykVal };
    } catch {
      return { rgb: { r: 99, g: 102, b: 241 }, hsl: { h: 239, s: 84, l: 67 }, cmyk: { c: 59, m: 58, y: 0, k: 5 } };
    }
  }, [hexColor]);

  // Generate Color Harmonies
  const harmonies = useMemo(() => {
    const h = hsl.h;
    const s = hsl.s;
    const l = hsl.l;

    return [
      {
        name: t('complementary'),
        colors: [hexColor, hslToHex(h + 180, s, l)],
      },
      {
        name: t('analogous'),
        colors: [hslToHex(h - 30, s, l), hexColor, hslToHex(h + 30, s, l)],
      },
      {
        name: t('triadic'),
        colors: [hexColor, hslToHex(h + 120, s, l), hslToHex(h + 240, s, l)],
      },
      {
        name: t('tetradic'),
        colors: [hexColor, hslToHex(h + 90, s, l), hslToHex(h + 180, s, l), hslToHex(h + 270, s, l)],
      },
      {
        name: t('monochromatic'),
        colors: [
          hslToHex(h, s, Math.max(15, l - 30)),
          hslToHex(h, s, Math.max(25, l - 15)),
          hexColor,
          hslToHex(h, s, Math.min(85, l + 15)),
          hslToHex(h, s, Math.min(95, l + 30)),
        ],
      },
    ];
  }, [hexColor, hsl, t]);

  // WCAG Contrast calculation
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const contrastWhite = useMemo(() => {
    const lum1 = getLuminance(rgb.r, rgb.g, rgb.b);
    const lum2 = 1.0; // white
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return parseFloat(ratio.toFixed(2));
  }, [rgb]);

  const contrastBlack = useMemo(() => {
    const lum1 = getLuminance(rgb.r, rgb.g, rgb.b);
    const lum2 = 0.0; // black
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return parseFloat(ratio.toFixed(2));
  }, [rgb]);

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const pickRandom = () => {
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setHexColor(randomHex);
  };

  // Preset Palettes
  const curatedPalettes = [
    { name: 'Cyber Neon', colors: ['#0f172a', '#6366f1', '#06b6d4', '#ec4899', '#f43f5e'] },
    { name: 'Forest Emerald', colors: ['#064e3b', '#059669', '#10b981', '#34d399', '#a7f3d0'] },
    { name: 'Warm Sunset', colors: ['#4c0519', '#9f1239', '#e11d48', '#f97316', '#fbbf24'] },
    { name: 'Nordic Slate', colors: ['#0f172a', '#1e293b', '#334155', '#64748b', '#cbd5e1'] },
  ];

  return (
    <div className="space-y-6" id="color-studio-tool">
      {/* Top Banner with Main Color Preview */}
      <div
        className="p-8 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-6 transition-colors duration-300"
        style={{ backgroundColor: hexColor }}
      >
        <div className="space-y-1">
          <span
            className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: contrastWhite > 4.5 ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)',
              color: contrastWhite > 4.5 ? '#ffffff' : '#000000',
            }}
          >
            {language === 'ar' ? 'اللون المحدد حالياً' : 'Selected Active Color'}
          </span>
          <h2
            className="text-3xl md:text-4xl font-extrabold font-mono"
            style={{ color: contrastWhite > 4.5 ? '#ffffff' : '#0f172a' }}
          >
            {hexColor.toUpperCase()}
          </h2>
        </div>

        {/* Color Picker & EyeDropper Controls */}
        <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl shadow-md border border-white/20">
          <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input
              type="color"
              value={hexColor}
              onChange={e => setHexColor(e.target.value)}
              className="w-10 h-10 rounded-xl cursor-pointer p-0 border-0"
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {language === 'ar' ? 'لوحة الألوان' : 'Picker'}
            </span>
          </label>

          <button
            type="button"
            onClick={pickRandom}
            className="p-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 rounded-xl transition-colors cursor-pointer"
            title="Random Color"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Formats Grid: Hex, RGB, HSL, CMYK, CSS Variable */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'HEX', val: hexColor.toUpperCase() },
          { label: 'RGB', val: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
          { label: 'HSL', val: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
          { label: 'CMYK', val: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
        ].map(fmt => (
          <div
            key={fmt.label}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 font-mono">{fmt.label}</span>
              <button
                type="button"
                onClick={() => handleCopy(fmt.label, fmt.val)}
                className="text-slate-400 hover:text-indigo-600 cursor-pointer"
              >
                {copiedKey === fmt.label ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 truncate">{fmt.val}</p>
          </div>
        ))}
      </div>

      {/* Harmonies & Variations */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>{t('harmonies')}</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {harmonies.map(h => (
            <div key={h.name} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{h.name}</span>
              <div className="flex h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
                {h.colors.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={() => setHexColor(c)}
                    className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity relative group"
                    style={{ backgroundColor: c }}
                    title={`Click to use ${c}`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold bg-black/40 text-white transition-opacity">
                      {c}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WCAG Contrast Ratio & Accessibility Check */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {t('contrastRatio')} (WCAG AA & AAA)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Against White */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between" style={{ backgroundColor: '#ffffff' }}>
            <span className="text-sm font-bold" style={{ color: hexColor }}>Sample Text on White</span>
            <div className="text-end">
              <span className="text-xs font-mono font-bold text-slate-900">{contrastWhite} : 1</span>
              <div className="flex gap-1 mt-0.5 justify-end">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${contrastWhite >= 4.5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  AA {contrastWhite >= 4.5 ? 'Pass' : 'Fail'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${contrastWhite >= 7 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                  AAA {contrastWhite >= 7 ? 'Pass' : 'Fail'}
                </span>
              </div>
            </div>
          </div>

          {/* Against Black */}
          <div className="p-4 rounded-xl border border-slate-800 flex items-center justify-between" style={{ backgroundColor: '#0f172a' }}>
            <span className="text-sm font-bold" style={{ color: hexColor }}>Sample Text on Dark</span>
            <div className="text-end">
              <span className="text-xs font-mono font-bold text-white">{contrastBlack} : 1</span>
              <div className="flex gap-1 mt-0.5 justify-end">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${contrastBlack >= 4.5 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  AA {contrastBlack >= 4.5 ? 'Pass' : 'Fail'}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${contrastBlack >= 7 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  AAA {contrastBlack >= 7 ? 'Pass' : 'Fail'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Trending Palettes */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {language === 'ar' ? 'لوحات ألوان ملهمة وجاهزة' : 'Curated Color Schemes'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {curatedPalettes.map(p => (
            <div key={p.name} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{p.name}</span>
              <div className="flex h-8 rounded-md overflow-hidden">
                {p.colors.map(c => (
                  <div
                    key={c}
                    onClick={() => setHexColor(c)}
                    className="flex-1 h-full cursor-pointer hover:scale-105 transition-transform"
                    style={{ backgroundColor: c }}
                    title={`Use ${c}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
