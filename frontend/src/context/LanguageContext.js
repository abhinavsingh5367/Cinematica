import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    return useContext(LanguageContext);
}

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('English');

    const changeLanguage = (selectedLanguage) => {
        setLanguage(selectedLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}
