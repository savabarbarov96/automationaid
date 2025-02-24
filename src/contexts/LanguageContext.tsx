
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'bg';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    blog: 'Blog',
    services: 'Services',
    contact: 'Contact',
    getStarted: 'Get Started',
    aiSolutions: 'AI Solutions',
    heroTitle: 'Transform Your Business With Advanced AI Solutions',
    heroSubtitle: 'We build custom AI agents and integrate intelligent solutions to revolutionize your business processes',
    services: 'Our Services',
    servicesSubtitle: 'Discover how our AI solutions can transform your business operations and drive growth',
    testimonials: 'What Our Clients Say',
    testimonialsSubtitle: 'Hear from businesses that have transformed their operations with our AI solutions',
    pricing: 'Choose Your AI Partner',
    pricingSubtitle: 'Select the perfect AI solution that matches your business needs',
    readyToTransform: 'Ready to Transform Your Business?',
    readyToTransformSubtitle: "Let's discuss how our AI solutions can help you achieve your business goals",
    contactUs: 'Contact Us',
  },
  bg: {
    home: 'Начало',
    blog: 'Блог',
    services: 'Услуги',
    contact: 'Контакти',
    getStarted: 'Започнете',
    aiSolutions: 'AI Решения',
    heroTitle: 'Трансформирайте Вашия Бизнес с Модерни AI Решения',
    heroSubtitle: 'Създаваме персонализирани AI агенти и интегрираме интелигентни решения за революционизиране на бизнес процесите',
    services: 'Нашите Услуги',
    servicesSubtitle: 'Открийте как нашите AI решения могат да трансформират вашите бизнес операции и да стимулират растежа',
    testimonials: 'Какво Казват Нашите Клиенти',
    testimonialsSubtitle: 'Чуйте от бизнеси, които трансформираха своите операции с нашите AI решения',
    pricing: 'Изберете Вашия AI Партньор',
    pricingSubtitle: 'Изберете перфектното AI решение, което отговаря на нуждите на вашия бизнес',
    readyToTransform: 'Готови ли сте да Трансформирате Вашия Бизнес?',
    readyToTransformSubtitle: 'Нека обсъдим как нашите AI решения могат да ви помогнат да постигнете бизнес целите си',
    contactUs: 'Свържете се с нас',
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
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
