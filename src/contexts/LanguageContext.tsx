
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bg';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
      blog: 'Blog',
      getStarted: 'Get Started'
    },
    hero: {
      title: 'Transform Your Business With Advanced AI Solutions',
      subtitle: 'We build custom AI agents and integrate intelligent solutions to revolutionize your business processes'
    },
    services: {
      title: 'Our Services',
      subtitle: 'Discover how our AI solutions can transform your business operations and drive growth'
    },
    portfolio: {
      title: 'Our Portfolio',
      subtitle: 'See how we've helped businesses transform their operations'
    },
    testimonials: {
      title: 'What Our Clients Say',
      subtitle: 'Hear from businesses that have transformed their operations with our AI solutions'
    },
    cta: {
      title: 'Ready to Transform Your Business?',
      subtitle: 'Let's discuss how our AI solutions can help you achieve your business goals',
      button: 'Contact Us'
    }
  },
  bg: {
    nav: {
      home: 'Начало',
      about: 'За нас',
      services: 'Услуги',
      portfolio: 'Портфолио',
      contact: 'Контакти',
      blog: 'Блог',
      getStarted: 'Започнете'
    },
    hero: {
      title: 'Трансформирайте Вашия Бизнес с Модерни AI Решения',
      subtitle: 'Създаваме персонализирани AI решения и интегрираме интелигентни системи за революционизиране на бизнес процесите'
    },
    services: {
      title: 'Нашите Услуги',
      subtitle: 'Открийте как нашите AI решения могат да трансформират вашите бизнес операции'
    },
    portfolio: {
      title: 'Нашето Портфолио',
      subtitle: 'Вижте как помагаме на бизнесите да трансформират своите операции'
    },
    testimonials: {
      title: 'Какво Казват Нашите Клиенти',
      subtitle: 'Чуйте от бизнеси, които трансформираха своите операции с нашите решения'
    },
    cta: {
      title: 'Готови ли сте да Трансформирате Вашия Бизнес?',
      subtitle: 'Нека обсъдим как нашите AI решения могат да ви помогнат да постигнете целите си',
      button: 'Свържете се с нас'
    }
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => '',
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value[k];
      if (value === undefined) return key;
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
