import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, Download, Image as ImageIcon, Sparkles, Sliders, Check } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const { t, language } = useApp();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const [quality, setQuality] = useState<number>(80);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [naturalWidth, setNaturalWidth] = useState<number>(0);
  const [naturalHeight, setNaturalHeight] = useState<number>(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/webp');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setOriginalFile(file);
    setOriginalSize(file.size);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      setNaturalWidth(img.width);
      setNaturalHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
      compressImage(img, img.width, img.height, quality, outputFormat);
    };
    img.src = url;
  };

  const compressImage = (
    img: HTMLImageElement,
    w: number,
    h: number,
    q: number,
    fmt: string
  ) => {
    setIsProcessing(true);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High quality downsampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);

    canvas.toBlob(
      blob => {
        if (blob) {
          setCompressedSize(blob.size);
          const compressedObjectUrl = URL.createObjectURL(blob);
          setCompressedUrl(compressedObjectUrl);
        }
        setIsProcessing(false);
      },
      fmt,
      q / 100
    );
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (keepAspectRatio && naturalWidth > 0) {
      const ratio = naturalHeight / naturalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (keepAspectRatio && naturalHeight > 0) {
      const ratio = naturalWidth / naturalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleApply = () => {
    if (!originalUrl) return;
    const img = new Image();
    img.onload = () => {
      compressImage(img, targetWidth, targetHeight, quality, outputFormat);
    };
    img.src = originalUrl;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="space-y-6" id="image-compressor-tool">
      {/* Upload Zone */}
      {!originalUrl ? (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-12 text-center bg-slate-50 dark:bg-slate-900/60 transition-all cursor-pointer group"
        >
          <label className="cursor-pointer flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              {language === 'ar' ? 'اسحب وأفلت الصورة هنا، أو انقر للاختيار' : 'Drop your image here, or click to browse'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mb-4">
              {language === 'ar' ? 'يدعم صيغ PNG و JPEG و WebP مع معالجة محلية سريعة 100% داخل المتصفح' : 'Supports PNG, JPEG, WebP. 100% local client-side processing.'}
            </p>
            <span className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors">
              {language === 'ar' ? 'اختيار صورة' : 'Select Image'}
            </span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        /* Workspace when Image is loaded */
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Quality Slider (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t('quality')} ({quality}%)</span>
                <span className="text-[11px] text-slate-400">{quality > 80 ? 'High' : quality > 50 ? 'Balanced' : 'Max Compression'}</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Target Dimensions (4 cols) */}
            <div className="md:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>{t('resize')}</span>
                <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepAspectRatio}
                    onChange={e => setKeepAspectRatio(e.target.checked)}
                    className="w-3.5 h-3.5 accent-indigo-600 rounded"
                  />
                  <span>{t('keepAspectRatio')}</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={targetWidth}
                  onChange={e => handleWidthChange(Number(e.target.value))}
                  placeholder="Width"
                  className="p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                />
                <input
                  type="number"
                  value={targetHeight}
                  onChange={e => handleHeightChange(Number(e.target.value))}
                  placeholder="Height"
                  className="p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* Format & Apply (4 cols) */}
            <div className="md:col-span-4 space-y-2 flex flex-col justify-end">
              <div className="flex gap-2">
                <select
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value as any)}
                  className="flex-1 p-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                >
                  <option value="image/webp">WebP (Best)</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                </select>

                <button
                  type="button"
                  onClick={handleApply}
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'تطبيق التعديل' : 'Re-compress'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Savings Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div>
                <span className="text-slate-500">{t('originalSize')}: </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{formatBytes(originalSize)}</span>
                <span className="text-[11px] text-slate-400 ms-1">({naturalWidth}x{naturalHeight}px)</span>
              </div>
              <span className="text-indigo-400">➔</span>
              <div>
                <span className="text-slate-500">{t('compressedSize')}: </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatBytes(compressedSize)}</span>
                <span className="text-[11px] text-slate-400 ms-1">({targetWidth}x{targetHeight}px)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {savingsPercent > 0 && (
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-extrabold rounded-lg shadow-2xs">
                  {t('savings')}: {savingsPercent}%
                </span>
              )}

              {compressedUrl && (
                <a
                  href={compressedUrl}
                  download={`optimized_${Date.now()}.${outputFormat.split('/')[1]}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  {t('downloadCompressed')}
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setOriginalFile(null);
                  setOriginalUrl(null);
                  setCompressedUrl(null);
                }}
                className="text-xs text-slate-500 hover:text-red-500 cursor-pointer"
              >
                {language === 'ar' ? 'صورة جديدة' : 'New Image'}
              </button>
            </div>
          </div>

          {/* Visual Comparison View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 text-center">
              <span className="text-xs font-semibold text-slate-500">{t('originalSize')}</span>
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex items-center justify-center min-h-[250px] overflow-hidden">
                {originalUrl && (
                  <img src={originalUrl} alt="Original" className="max-h-72 max-w-full object-contain rounded-lg" />
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-center">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{t('compressedSize')}</span>
              <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 flex items-center justify-center min-h-[250px] overflow-hidden">
                {compressedUrl ? (
                  <img src={compressedUrl} alt="Compressed" className="max-h-72 max-w-full object-contain rounded-lg" />
                ) : (
                  <span className="text-xs text-slate-400">Processing...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
