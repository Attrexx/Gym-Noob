import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/archivo-black';
import '@fontsource/rammetto-one';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './design/global.css';
import App from './App';
import { incarcaLimba, limbaInitiala } from './i18n/boot';

// Limba se încarcă ÎNAINTE de primul render, ca să nu existe un cadru în limba
// greșită. Indiciul din localStorage face ca, în regim normal, să nimerim din
// prima limba salvată în profil — `aplicaLimba` confirmă (sau corectează) după
// ce se încarcă profilul.
void incarcaLimba(limbaInitiala()).then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});
