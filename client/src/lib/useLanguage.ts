import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    'home': 'الرئيسية',
    'sectors': 'القطاعات',
    'market_overview': 'نظرة عامة على السوق',
    'key_indicators': 'أبرز المؤشرات',
    'top_economic_indicators': 'أهم المؤشرات الاقتصادية المصرية',
    'all_sectors': 'جميع القطاعات',
    'back_to_market': 'العودة للرئيسية',
    'markets_tracked': 'السلع المتعقبة',
    'market_summary': 'ملخص السوق',
    'total_assets': 'إجمالي الأصول',
    'advancing': 'صاعد',
    'declining': 'هابط',
    'no_data': 'لا توجد بيانات',
    'unable_to_load': 'لم نتمكن من تحميل بيانات السوق الحالية',
    'product_not_found': 'السلعة غير موجودة',
    'search_placeholder': 'ابحث عن السلع والمعادن...',
    'browse_sectors': 'استكشف القطاعات',
  },
  en: {
    'home': 'Home',
    'sectors': 'Sectors',
    'market_overview': 'Market Overview',
    'key_indicators': 'Key Indicators',
    'top_economic_indicators': 'Top Economic Indicators',
    'all_sectors': 'All Sectors',
    'back_to_market': 'Back to Home',
    'markets_tracked': 'Markets Tracked',
    'market_summary': 'Market Summary',
    'total_assets': 'Total Assets',
    'advancing': 'Advancing',
    'declining': 'Declining',
    'no_data': 'No Data',
    'unable_to_load': 'Unable to load market data',
    'product_not_found': 'Product not found',
    'search_placeholder': 'Search markets, metals, tech...',
    'browse_sectors': 'Browse Sectors',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    return (saved as Language) || 'ar';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  const value = { language, setLanguage: handleSetLanguage, t, isArabic: language === 'ar' };

  return React.createElement(
    LanguageContext.Provider,
    { value },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
