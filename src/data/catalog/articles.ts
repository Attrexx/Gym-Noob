export interface Article {
  id: string;
  titlu: string;
  emoji: string;
  rezumat: string;
  /** paragrafe; rândurile care încep cu "• " devin liste */
  continut: string[];
}

export const ARTICOLE: Article[] = [
  {
    id: 'eticheta',
    titlu: 'Eticheta la sală — regulile nescrise',
    emoji: '🤝',
    rezumat: 'Ce fac veteranii fără să se gândească și ce așteaptă (politicos) de la tine.',
    continut: [
      'Vestea bună: nimeni nu se uită la tine. Serios. Toți sunt ocupați cu propriul antrenament. Vestea și mai bună: dacă respecți câteva reguli simple, ești deja „de-al casei".',
      '• Pune greutățile la loc. Regula numărul 1, 2 și 3. Discurile pe suport, ganterele la raft, în ordinea mărimii.',
      '• Prosopul pe bancă și șterge aparatul după tine dacă ai transpirat.',
      '• Nu ocupa un aparat cât stai pe telefon. Setul, pauza rezonabilă, apoi eliberezi.',
      '• Poți cere „lucrez și eu între seturi?" — se cheamă „working in" și e complet normal.',
      '• Nu da sfaturi necerute și nu te speria dacă primești unele — mulțumești și mergi mai departe.',
      '• Cere asigurare la împins („Îmi dai o asigurare, te rog?") — nimeni normal nu refuză.',
      'Atât. Restul e antrenament.',
    ],
  },
  {
    id: 'incalzire',
    titlu: 'Încălzirea — 10 minute care te feresc de pauze de 3 luni',
    emoji: '🔥',
    rezumat: 'De ce, cât și cum te încălzești corect înainte de orice.',
    continut: [
      'Mușchiul rece e ca guma de mestecat scoasă din frigider: trage de el și se rupe. Aceeași gumă, încălzită, se întinde. Fizica ta funcționează la fel.',
      '• 5-8 minute de cardio ușor (mers înclinat, bicicletă) — până transpiri fin.',
      '• Mișcări articulare: rotiri de umeri, brațe, șolduri, genunchi — 10 pe sens.',
      '• La fiecare exercițiu de forță, primul set e „de încălzire": jumătate din greutatea de lucru, 12-15 repetări.',
      'Setul de încălzire nu se pune la socoteală și nu e opțional. E biletul de intrare al articulațiilor tale la antrenament.',
      'Stretchingul static lung (întinderi ținute 30+ secunde) e pentru DUPĂ antrenament, nu înainte — înainte reduce temporar forța.',
    ],
  },
  {
    id: 'febra',
    titlu: 'Febra musculară — de ce te doare și când să te îngrijorezi',
    emoji: '🤕',
    rezumat: 'DOMS pe numele ei tehnic. E normală, trece, și nu, nu e acid lactic.',
    continut: [
      'A doua zi după primul antrenament vei coborî scările ca un robot ruginit. Felicitări, e complet normal — se numește DOMS (durere musculară cu debut întârziat) și apare la 24-72 de ore după efort nou.',
      'Cauza: micro-leziuni în fibrele musculare (partea din proces care te face mai puternic), NU acidul lactic — acela dispare în câteva ore.',
      '• Ce ajută: mișcare ușoară (plimbare, bicicletă lejeră), somn, apă, proteine.',
      '• Ce nu ajută: statul nemișcat pe canapea (paradoxal, e mai rău).',
      '• Poți antrena alte grupe fără probleme — dacă te dor picioarele, lucrezi spatele.',
      'Semnal de alarmă (mergi la medic): durere ascuțită într-un punct precis apărută ÎN timpul exercițiului, umflătură vizibilă, sau urină foarte închisă la culoare după efort extrem.',
      'După 2-3 săptămâni de antrenament regulat, febra musculară aproape dispare. Nu înseamnă că nu mai progresezi — înseamnă că te-ai adaptat.',
    ],
  },
  {
    id: 'supraincarcarea',
    titlu: 'Supraîncărcarea progresivă — singurul secret real',
    emoji: '📈',
    rezumat: 'Cum crește mușchiul: cere-i de fiecare dată puțin mai mult.',
    continut: [
      'Mușchii cresc dintr-un singur motiv: îi pui să facă ceva puțin mai greu decât data trecută, iar ei se adaptează. Asta e toată știința. Restul sunt detalii.',
      '„Puțin mai mult" poate însemna, în ordinea preferată:',
      '• o repetare în plus la aceeași greutate;',
      '• 1-2,5 kg în plus când atingi capătul intervalului de repetări;',
      '• un set în plus;',
      '• o execuție mai curată sau o coborâre mai lentă.',
      'De aici și rolul jurnalului din aplicația asta: nu poți depăși ce nu ții minte. Fiecare set notat e o țintă pentru data viitoare.',
      'Regula practică: alegi un interval (de exemplu 8-12 repetări). Când poți face 12 curate la toate seturile, crești greutatea și cobori la 8. Repetă până ești bătrân.',
      'Atenție: progresul liniar nedefinit e matematic imposibil. Săptămânile fără progres sunt normale — contează trendul pe luni.',
    ],
  },
  {
    id: 'nutritie',
    titlu: 'Nutriția pentru slăbit + mușchi — pe scurt și fără secte',
    emoji: '🍽️',
    rezumat: 'Deficit caloric moderat, proteine multe, răbdare. Restul e marketing.',
    continut: [
      'Slăbitul e aritmetică: mănânci mai puține calorii decât consumi, corpul completează diferența din rezerve. Aplicația îți calculează bugetul zilnic exact pentru asta.',
      'Ca să pierzi grăsime și NU mușchi, două lucruri sunt obligatorii:',
      '• Proteine: ~1,6-2 g per kg de greutate corporală pe zi (la 100 kg: 160-200 g). Carne, pește, ouă, lactate, leguminoase.',
      '• Antrenament de forță: semnalul care îi spune corpului „mușchiul e folosit, arde altceva".',
      '• Deficit moderat (0,25-0,5 kg/săptămână la început; până la 1 kg dacă e mult de dat jos). Dietele extreme pierd mușchi și se termină cu efect yo-yo.',
      'Da, poți construi mușchi și slăbi simultan ca începător — se numește „recompoziție corporală" și e superputerea primului an. Profită de ea.',
      'Cântarul minte pe termen scurt (apă, glicogen, sare). Cântărește-te des, dar judecă doar media pe 7 zile — exact ce afișează graficul din aplicație.',
    ],
  },
  {
    id: 'hidratare',
    titlu: 'Hidratarea — de ce aplicația te bate la cap cu apa',
    emoji: '💧',
    rezumat: 'Cât să bei, când, și ce se întâmplă dacă nu.',
    continut: [
      'La 2% deshidratare, forța și concentrarea scad măsurabil. La sală transpiri mai mult decât crezi — de aici contorul de apă pe sesiune.',
      '• Peste zi: ~33 ml per kg corp (la 100 kg ≈ 3,3 litri, incluzând ce vine din mâncare).',
      '• La sală: câteva înghițituri (150-250 ml) la fiecare 15-20 de minute, nu jumătate de litru dintr-o dată.',
      '• Urina galben-pai = ești bine. Galben închis = bea mai mult.',
      'Băuturile izotonice au sens abia peste ~60-90 de minute de efort intens sau la transpirație abundentă. Pentru o oră de sală, apa e tot ce trebuie.',
      'Truc practic: umple sticla ÎNAINTE să începi antrenamentul și propune-ți să fie goală la final. Butonul de +250 ml din sesiune face restul.',
    ],
  },
  {
    id: 'somn',
    titlu: 'Somnul — sala construiește, patul finalizează',
    emoji: '😴',
    rezumat: 'Mușchii cresc când dormi. La propriu.',
    continut: [
      'Antrenamentul dă semnalul, mâncarea dă materialul, dar construcția propriu-zisă se întâmplă în somn — acolo se secretă hormonul de creștere și se repară fibrele.',
      '• 7-9 ore. Sub 6 ore cronic: forță mai mică, foame hormonală mai mare (grelina crește), rezultate mai lente.',
      '• Un studiu celebru: la aceeași dietă, grupul care dormea 5,5 ore a pierdut cu 55% mai puțină grăsime (și mai mult mușchi) decât cel cu 8,5 ore.',
      '• Antrenamentul târziu seara poate întârzia adormirea la unii — dacă e cazul tău, mută sesiunile mai devreme.',
      'Dacă trebuie să alegi între o oră de somn și o oră de sală când ești praf: alege somnul. Sala de mâine va fi de două ori mai bună.',
    ],
  },
  {
    id: 'primele-saptamani',
    titlu: 'Primele 4 săptămâni — la ce să te aștepți',
    emoji: '🗓️',
    rezumat: 'Calendarul realist al începutului, ca să nu te sperii și să nu te lași.',
    continut: [
      'Săptămâna 1: totul e greu, totul doare a doua zi, cifrele din aplicație par mici. Perfect normal. Obiectivul unic: să apari de 3 ori.',
      'Săptămâna 2: febra musculară scade dramatic. Greutățile de săptămâna trecută par deja mai ușoare — e sistemul nervos care învață, nu (încă) mușchi noi.',
      'Săptămâna 3-4: primele progrese vizibile în jurnal — mai multe repetări, primele kg în plus pe aparate. Cântarul poate fi haotic (retenție de apă de la antrenament) — ignoră-l, urmărește media.',
      'Luna 2-3: hainele se așază altfel, energia zilnică crește, iar la sală începi să te simți „acasă".',
      '• Regula de aur a începutului: consecvența bate intensitatea. 3 antrenamente medii pe săptămână, luni la rând, bat orice săptămână eroică urmată de abandon.',
      'Și dacă ratezi o săptămână? Nimic pierdut — te întorci pur și simplu. Streak-ul se reia, mușchii au memorie (la propriu, e un mecanism celular real).',
    ],
  },
];
