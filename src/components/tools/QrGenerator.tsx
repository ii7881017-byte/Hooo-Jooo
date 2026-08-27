import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import QRCode from 'qrcode';
import {
  Download,
  Copy,
  Check,
  Globe,
  FileText,
  Wifi,
  MessageSquare,
  User,
  Palette,
  Sparkles,
} from 'lucide-react';

type QrContentType = 'url' | 'text' | 'wifi' | 'whatsapp' | 'vcard';

export const QrGenerator: React.FC = () => {
  const { t, language } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [contentType, setContentType] = useState<QrContentType>('url');
  const [url, setUrl] = useState<string>('https://ai.studio');
  const [text, setText] = useState<string>('Welcome to Digital Utility Hub!');
  const [wifiSsid, setWifiSsid] = useState<string>('Home_Office_5G');
  const [wifiPassword, setWifiPassword] = useState<string>('Secur3P@ssw0rd!');
  const [wifiType, setWifiType] = useState<string>('WPA');
  const [waPhone, setWaPhone] = useState<string>('+966501234567');
  const [waMessage, setWaMessage] = useState<string>('مرحباً، أود الاستفسار عن خدماتكم.');
  const [vcardName, setVcardName] = useState<string>('Ahmad Al-Mansoor');
  const [vcardPhone, setVcardPhone] = useState<string>('+966 50 000 0000');
  const [vcardEmail, setVcardEmail] = useState<string>('ahmad@example.com');
  const [vcardOrg, setVcardOrg] = useState<string>('Tech Solutions Inc.');

  // Custom styling
  const [fgColor, setFgColor] = useState<string>('#1e1b4b');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(280);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [copied, setCopied] = useState(false);

  // Compute final QR payload
  const qrPayload = (() => {
    switch (contentType) {
      case 'url':
        return url || 'https://ai.studio';
      case 'text':
        return text || 'Digital Utility Suite';
      case 'wifi':
        return `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};;`;
      case 'whatsapp': {
        const cleanPhone = waPhone.replace(/[^0-9]/g, '');
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
      }
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      default:
        return 'https://ai.studio';
    }
  })();

  // Render QR Code to canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    QRCode.toCanvas(
      canvasRef.current,
      qrPayload,
      {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      },
      err => {
        if (err) console.error(err);
      }
    );
  }, [qrPayload, fgColor, bgColor, qrSize, errorLevel]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qrcode_${contentType}_${Date.now()}.png`;
    a.click();
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await QRCode.toString(qrPayload, {
        type: 'svg',
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorLevel,
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qrcode_${contentType}_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="qr-generator-tool">
      {/* Content Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        {[
          { id: 'url', label: t('qrTypeUrl'), icon: Globe },
          { id: 'text', label: t('qrTypeText'), icon: FileText },
          { id: 'wifi', label: t('qrTypeWifi'), icon: Wifi },
          { id: 'whatsapp', label: t('qrTypeWhatsapp'), icon: MessageSquare },
          { id: 'vcard', label: t('qrTypeVcard'), icon: User },
        ].map(item => {
          const Icon = item.icon;
          const isActive = contentType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setContentType(item.id as QrContentType)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Inputs vs Live QR Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Dynamic Content Inputs */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('input')}
            </h4>

            {contentType === 'url' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('qrTypeUrl')}</label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}

            {contentType === 'text' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('qrTypeText')}</label>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Type any message, note or instructions..."
                  className="w-full h-24 p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}

            {contentType === 'wifi' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('networkName')}</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={e => setWifiSsid(e.target.value)}
                    placeholder="SSID Name"
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('password')}</label>
                    <input
                      type="text"
                      value={wifiPassword}
                      onChange={e => setWifiPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('encryptionType')}</label>
                    <select
                      value={wifiType}
                      onChange={e => setWifiType(e.target.value)}
                      className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {contentType === 'whatsapp' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('phoneNumber')}</label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={e => setWaPhone(e.target.value)}
                    placeholder="+966501234567"
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'الرسالة الافتراضية' : 'Default Message'}</label>
                  <textarea
                    value={waMessage}
                    onChange={e => setWaMessage(e.target.value)}
                    placeholder="Message pre-filled in chat..."
                    className="w-full h-20 p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}

            {contentType === 'vcard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    value={vcardName}
                    onChange={e => setVcardName(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('phoneNumber')}</label>
                  <input
                    type="text"
                    value={vcardPhone}
                    onChange={e => setVcardPhone(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('emailPreset')}</label>
                  <input
                    type="email"
                    value={vcardEmail}
                    onChange={e => setVcardEmail(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'الشركة / المنظمة' : 'Organization'}</label>
                  <input
                    type="text"
                    value={vcardOrg}
                    onChange={e => setVcardOrg(e.target.value)}
                    className="w-full p-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* QR Design & Color Palette */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>{language === 'ar' ? 'تخصيص ألوان وتصميم الرمز' : 'QR Appearance & Colors'}</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Pattern Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('qrFgColor')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{fgColor}</span>
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('qrBgColor')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0"
                  />
                  <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{bgColor}</span>
                </div>
              </div>

              {/* Error Correction */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'دقة تصحيح الخطأ' : 'Error Correction'}</label>
                <select
                  value={errorLevel}
                  onChange={e => setErrorLevel(e.target.value as any)}
                  className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
                >
                  <option value="L">L (7% Low)</option>
                  <option value="M">M (15% Standard)</option>
                  <option value="Q">Q (25% High)</option>
                  <option value="H">H (30% Highest)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live QR Preview & Downloads (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 inline-block">
            <canvas ref={canvasRef} className="rounded-lg max-w-full" />
          </div>

          {/* Download Buttons */}
          <div className="w-full space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t('downloadPng')}
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {t('downloadSvg')}
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? t('copied') : (language === 'ar' ? 'نسخ نص المحتوى الخام' : 'Copy Raw QR Text')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
