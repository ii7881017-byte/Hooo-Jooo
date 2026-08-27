import React from 'react';
import {
  FileText,
  GitCompare,
  Binary,
  FileCode,
  Braces,
  Regex,
  ShieldCheck,
  KeyRound,
  QrCode,
  Palette,
  Image,
  Scale,
  Clock,
  Percent,
  Sparkles,
  Wrench,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  FileText,
  GitCompare,
  Binary,
  FileCode,
  Braces,
  Regex,
  ShieldCheck,
  KeyRound,
  QrCode,
  Palette,
  Image,
  Scale,
  Clock,
  Percent,
  Sparkles,
};

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[name] || Wrench;
  return <IconComponent className={className} />;
};
