# 🏋️ Gym Noob

> **Ghidul complet al începătorului absolut** — aplicația de sală care nu te judecă.

O aplicație web progresivă (PWA) de antrenament, complet în **limba română**, cu estetica ghidurilor
galbene din anii '90 și cu **Flexu**, mascota care te încurajează, te învață și îți sărbătorește recordurile.

**Aplicația live:** https://attrexx.github.io/Gym-Noob/

## Ce știe să facă

- 🧭 **Onboarding cu profiluri** — metrici corporale, nivel de activitate, obiectiv de slăbire cu ritm sănătos (max 1 kg/săpt.), IMC, BMR (Mifflin-St Jeor), TDEE, grăsime corporală estimată (US Navy).
- 📚 **Bibliotecă de ~50 exerciții în română** — aparate și unelte cu numele lor din sălile românești, execuție pas cu pas, cum folosești aparatul, greșeli frecvente, ponturi, **demonstrații animate** și diagrama grupelor musculare.
- 📋 **Antrenamente (șabloane)** — compui serii de exerciții cu seturi/repetări/greutate/timp/pauză/cadență, le salvezi și le refolosești. Vine cu 4 planuri de start pentru începători.
- ▶️ **Sesiune live** — Start/Pauză/Reia/Stop cu butoane mari, jurnal de seturi cu steppere rapide, RPE, cronometru de pauză cu bipuri și vibrații, metronom de tempo, cronometru pentru exerciții pe timp, **contor de apă** cu țintă per sesiune, **indicații vocale în română** (opționale) și **sugestii de exerciții** — la cerere sau automate.
- 🏃 **Banda de alergare cu viteză și înclinație** — le schimbi din aplicație exact când le schimbi pe bandă; caloriile se calculează pe segmente, cu ecuațiile metabolice ACSM (mers/alergare), nu cu un MET fix.
- 🌘 **Ecranul nu se stinge în sesiune** (wake lock) + **economizor stil ceas**: după 45 s fără atingeri, ecran negru cu cronometrul, pauza, kcal și pulsul estompate în alb/galben — se trezește la atingere sau la mișcarea telefonului.
- 🔥 **Calorii** — ardere estimată pe exercițiu (MET × greutate × durată, modulată de RPE; formula Keytel când există puls). **Bugetul zilei**: cât ai voie să mănânci azi, cu caloriile arse la sală adăugate automat peste deficitul spre obiectiv (cu prag de siguranță).
- 🏅 **Recorduri și realizări** — detectare automată de PR-uri (greutate, repetări, volum, 1RM estimat) cu confetti, plus 25 de insigne pentru consecvență, volum, hidratare și kilograme date jos.
- 📊 **Statistici bogate** — trend de greutate cu medie pe 7 zile și ETA spre țintă, volum săptămânal, radar de echilibru muscular, progresie 1RM per exercițiu, calorii și apă pe sesiune, calendar de consecvență, export CSV.
- 🎓 **Ghidul Noobului** — 8 lecții esențiale (etichetă, încălzire, febră musculară, supraîncărcare progresivă, nutriție, hidratare, somn, primele săptămâni) + sfatul zilei.
- ⌚ **Puls live prin Bluetooth** — ceasurile cu difuzare de ritm cardiac (ex. Huawei GT4 cu „HR broadcast" pornit în antrenament) se conectează direct din sesiune (Chrome pe Android/desktop; iOS nu are Web Bluetooth).
- 📥 **Import Freefit** — istoricul de greutate de pe cântarul Bluetooth intră printr-un export CSV (Freefit nu are API public).
- 🌙 **Temă Zi / Noapte / Auto**, 📴 **funcționează complet offline**, 💾 **backup/restaurare JSON** — datele stau doar pe dispozitivul tău.

## Instalare pe telefon

1. Deschide **https://attrexx.github.io/Gym-Noob/** în Chrome (Android) sau Safari (iPhone).
2. Android: „Adaugă pe ecranul de pornire" din meniul ⋮ (sau bannerul de instalare). iPhone: Partajare → „Adaugă pe ecranul principal".
3. Gata — pornește ca o aplicație normală, cu tot cu date, și fără internet.

## Dezvoltare

```bash
npm install
npm run dev        # server local
npm test           # teste unitare (formulele de calorii, obiective, PR-uri…)
npm run build      # build de producție + service worker
npm run smoke      # test end-to-end în Chromium headless
```

Stack: Vite + React 18 + TypeScript · Zustand · Dexie (IndexedDB) · Recharts · vite-plugin-pwa.
Fără backend: totul e local-first, iar stratul de date (`src/data/`) e izolat ca să poată primi
sincronizare pe server mai târziu fără rescrierea aplicației.

## Publicare

La fiecare push pe `main`, GitHub Actions rulează testele, face build-ul și publică pe GitHub Pages.
**Setare unică:** în repo → Settings → Pages → Source: **GitHub Actions**.
