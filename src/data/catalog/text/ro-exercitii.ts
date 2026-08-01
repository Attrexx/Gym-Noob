import type { ExerciseId } from '../ids';
import type { TextExercitiu } from './types';

/**
 * Textul românesc al celor 98 de exerciții — mutat aici, verbatim, din
 * fișierele de definiții. Denumirile aparatelor sunt cele uzuale în sălile
 * din România (helcometru, presă de picioare, vaslit), nu traduceri.
 */
export const EXERCITII_RO: Record<ExerciseId, TextExercitiu> = {
  'mers-inclinat-banda': {
    nume: 'Mers înclinat pe bandă',
    echipamentNume: 'Banda de alergare',
    forma: [
      'Stai drept, nu te agăța de mânere — brațele se mișcă natural pe lângă corp.',
      'Pas complet: călcâi–talpă–vârf, privirea înainte, nu în telefon.',
      'Înclinație 8-12% și viteză 5-6 km/h e combinația de aur pentru ars grăsime fără să alergi.',
    ],
    utilizare: [
      'Urcă pe margini, pornește banda cu butonul Start, apoi crește viteza treptat din săgeți.',
      'Setează înclinația (INCLINE) după ce ai prins ritmul de mers.',
      'La final scade viteza treptat 1-2 minute — nu sări de pe banda în mers!',
    ],
    greseli: [
      'Ținutul de mânere anulează mare parte din efort (corpul „atârnă").',
      'Aplecarea în față obosește lombarii degeaba.',
    ],
    ponturi: [
      'Clipsul de siguranță prins de tricou oprește banda dacă aluneci. Folosește-l.',
      '10 minute de mers înclinat sunt o încălzire excelentă înaintea forței.',
    ],
  },
  'alergare-banda': {
    nume: 'Alergare pe bandă',
    echipamentNume: 'Banda de alergare',
    forma: [
      'Pași scurți și deși, aterizare pe mijlocul tălpii sub corp.',
      'Umerii relaxați, coatele la ~90°, pumnii moi.',
      'Respiră ritmic: 2 pași inspiri, 2 pași expiri.',
    ],
    utilizare: [
      'Începe cu mers 2-3 minute, apoi crește la ritmul de alergare.',
      'Înclinație 1% simulează alergarea afară.',
    ],
    greseli: [
      'Pornitul direct la viteză mare — invitație la accidentare.',
      'Pași prea lungi (aterizare pe călcâi mult în fața corpului) — șochează genunchii.',
    ],
    ponturi: [
      'Dacă gâfâi și nu poți vorbi deloc, ai ieșit din zona de ardere a grăsimii. Încetinește.',
      'Alternativa blândă cu kilogramele în plus: intervale mers/alergare 1:1.',
    ],
  },
  'bicicleta-stationara': {
    nume: 'Pedalat pe bicicletă staționară',
    echipamentNume: 'Bicicleta staționară',
    forma: [
      'Șaua la înălțimea șoldului când stai lângă bicicletă; genunchiul rămâne ușor îndoit la pedala de jos.',
      'Spatele drept, mâinile relaxate pe ghidon.',
      'Cadență constantă 70-90 rotații/minut.',
    ],
    utilizare: [
      'Reglează șaua ÎNAINTE să urci — cheia confortului.',
      'Crește rezistența din buton/rotiță până simți efort, dar poți menține cadența.',
    ],
    greseli: [
      'Șaua prea joasă — dureri de genunchi garantate.',
      'Rezistență zero și pedalat „în gol" — nu arzi mai nimic.',
    ],
    ponturi: [
      'Cea mai blândă opțiune cardio pentru articulații — ideală la început de drum.',
    ],
  },
  'eliptica': {
    nume: 'Antrenament pe eliptică',
    echipamentNume: 'Bicicleta eliptică',
    forma: [
      'Toată talpa rămâne pe pedală, mișcarea e fluidă, fără salturi.',
      'Împinge și trage și de mânerele mobile — lucrezi și partea de sus.',
      'Stai înalt, fără să te lași pe consolă.',
    ],
    utilizare: [
      'Pornește pedalând; consola se aprinde singură la majoritatea modelelor.',
      'Rezistența și eventual înclinația se setează din consolă.',
    ],
    greseli: [
      'Sprijinul cu toată greutatea pe mânerele fixe.',
      'Doar vârfurile pe pedale — amorțesc tălpile.',
    ],
    ponturi: [
      'Zero impact pe genunchi — perfectă pentru zilele în care picioarele sunt obosite.',
    ],
  },
  'vaslit-aparat': {
    nume: 'Vâslit la aparat',
    echipamentNume: 'Aparatul de vâslit (rowing)',
    forma: [
      'Ordinea corectă: împingi cu PICIOARELE → apleci ușor trunchiul pe spate → tragi mânerul la baza pieptului.',
      'La revenire, exact invers: brațele → trunchiul → genunchii.',
      'Spatele rămâne drept tot timpul, umerii jos.',
    ],
    utilizare: [
      'Prinde-ți tălpile în curele strâns.',
      'Rezistența (damper) 3-5 e suficientă — mai mult nu înseamnă mai bine.',
    ],
    greseli: [
      'Trasul cu brațele înaintea picioarelor — picioarele fac 60% din treabă.',
      'Spatele rotunjit la aplecarea în față.',
    ],
    ponturi: [
      'Cardio + spate într-un singur exercițiu — cel mai subestimat aparat din sală.',
    ],
  },
  'stepper': {
    nume: 'Urcat trepte la stepper',
    echipamentNume: 'Stepperul (simulator de trepte)',
    forma: [
      'Pas complet pe treaptă, împinge prin călcâi.',
      'Mâinile doar pentru echilibru, nu pentru sprijin.',
      'Stai drept, fără aplecare pe consolă.',
    ],
    utilizare: [
      'Începe cu viteză mică — treptele nu iartă.',
      'Butonul de STOP e la îndemână; folosește-l dacă pierzi ritmul.',
    ],
    greseli: [
      'Sprijinirea cu toată greutatea pe mânere — anulezi jumătate din calorii.',
    ],
    ponturi: [
      'Cel mai mare consum caloric pe minut dintre aparatele cardio, la același efort perceput.',
    ],
  },
  'sarituri-coarda': {
    nume: 'Sărituri cu coarda',
    echipamentNume: 'Coarda de sărit',
    forma: [
      'Sărituri mici, pe vârfuri, genunchii moi.',
      'Rotirea vine din încheieturi, nu din umeri.',
      'Privirea înainte, corpul înalt.',
    ],
    utilizare: [
      'Lungimea corectă: calci pe mijlocul corzii, mânerele ajung la subraț.',
    ],
    greseli: [
      'Sărituri prea înalte — obosești rapid și șochezi gleznele.',
    ],
    ponturi: [
      '30 de secunde de sărituri = un minut bun de alergare, ca efort. Ideal pentru finaluri de antrenament.',
    ],
  },
  'impins-piept-aparat': {
    nume: 'Împins la piept la aparat',
    echipamentNume: 'Aparatul de împins la piept (chest press)',
    forma: [
      'Reglează scaunul astfel încât mânerele să fie la mijlocul pieptului.',
      'Omoplații lipiți de spătar, pieptul scos în față.',
      'Împinge controlat până aproape de întinderea completă a brațelor, revino lent (2-3 secunde).',
    ],
    utilizare: [
      'Pinul din stiva de greutăți selectează sarcina — începe cu puțin și crește treptat.',
      'Multe aparate au o pedală care aduce mânerele în față pentru poziționare ușoară.',
    ],
    greseli: [
      'Coatele blocate violent la final.',
      'Umerii ridicați spre urechi în loc să stea „în buzunar".',
      'Revenire în cădere liberă.',
    ],
    ponturi: [
      'Cel mai sigur mod de a începe pieptul — traiectoria e ghidată, nu poate cădea nimic pe tine.',
    ],
  },
  'impins-gantere-banca': {
    nume: 'Împins cu gantere pe bancă',
    echipamentNume: 'Gantere + banca orizontală',
    forma: [
      'Întins pe bancă, tălpile ferm pe podea, omoplații strânși.',
      'Ganterele pornesc de la nivelul pieptului, coatele la ~45° față de corp (nu perpendicular).',
      'Împinge în arc ușor — ganterele se apropie sus fără să se ciocnească.',
    ],
    utilizare: [
      'Ridică ganterele pe genunchi, apoi „aruncă-le" pe rând spre umeri în timp ce te lași pe spate.',
      'La final, coboară ganterele spre piept și ridică genunchii — te ridici cu tot cu ele.',
    ],
    greseli: [
      'Coatele perpendiculare pe corp — stres inutil pe umeri.',
      'Arcuirea exagerată a spatelui.',
      'Greutăți prea mari, control zero.',
    ],
    ponturi: [
      'Față de haltera, ganterele lasă umerii să se miște natural — mai prietenoase la început.',
      'Fiecare braț muncește singur — nu poate „fura" partea puternică.',
    ],
  },
  'impins-haltera-banca': {
    nume: 'Împins cu haltera pe bancă (bench press)',
    echipamentNume: 'Haltera + banca cu suporți',
    forma: [
      'Priză puțin mai lată decât umerii, încheieturile drepte.',
      'Bara coboară controlat la baza pieptului, coatele la ~45-70°.',
      'Împinge exploziv, expirând sus. Omoplații rămân strânși.',
    ],
    utilizare: [
      'Bara olimpică goală are deja 20 kg — începe doar cu ea.',
      'Colierele de siguranță pe bară, mereu.',
      'Cere ajutor („Îmi dai o asigurare?") la seturi grele — nimeni nu refuză.',
    ],
    greseli: [
      'Săltatul barei pe piept.',
      'Fesele ridicate de pe bancă.',
      'Fără asigurare la greutăți mari — periculos de-a dreptul.',
    ],
    ponturi: [
      'Progresează cu 2,5 kg pe ședință, nu cu 10.',
      'Abia după ce împinsul cu gantere e stabil are sens bara.',
    ],
  },
  'fluturari-aparat': {
    nume: 'Fluturări la aparat (pec deck)',
    echipamentNume: 'Aparatul de fluturări (pec deck)',
    forma: [
      'Scaunul reglat ca mânerele să fie la înălțimea pieptului.',
      'Coatele ușor îndoite, fixe — mișcarea vine din umeri, ca o îmbrățișare.',
      'Strânge 1 secundă în față, revino lent fără să lași plăcile să se atingă.',
    ],
    utilizare: [
      'Pinul în stivă pentru greutate; unele modele au manetă de preîntindere pentru poziția de start.',
    ],
    greseli: [
      'Îndoirea coatelor transformă exercițiul în împins.',
      'Deschidere exagerată în spate — umărul suferă.',
    ],
    ponturi: [
      'Excelent la final de antrenament de piept, cu repetări mai multe (12-15).',
    ],
  },
  'fluturari-gantere': {
    nume: 'Fluturări cu gantere pe bancă',
    echipamentNume: 'Gantere + banca orizontală',
    forma: [
      'Brațele aproape întinse (coate ușor flexate, unghi fix) deasupra pieptului.',
      'Deschide larg până simți întinderea în piept — nu mai jos de nivelul umerilor.',
      'Închide pe același arc, ca și cum ai îmbrățișa un butoi.',
    ],
    utilizare: [
      'Folosește gantere vizibil mai ușoare decât la împins — jumătate e un punct de pornire bun.',
    ],
    greseli: [
      'Coborâre prea adâncă — pericol pentru umeri.',
      'Transformarea în împins prin îndoirea coatelor.',
    ],
    ponturi: [
      'Aici contează întinderea și controlul, nu greutatea. Ego-ul rămâne la vestiar.',
    ],
  },
  'flotari': {
    nume: 'Flotări',
    echipamentNume: 'Greutatea corpului (saltea)',
    forma: [
      'Corpul — o scândură dreaptă din cap până în călcâie, abdomenul încordat.',
      'Palmele puțin mai late decât umerii, coatele la ~45°.',
      'Coboară pieptul aproape de sol, împinge înapoi complet.',
    ],
    utilizare: [
      'Nu-ți ies încă flotările pline? Fă-le cu mâinile pe o bancă (înclinate) — scad dificultatea corect, spre deosebire de cele „din genunchi".',
    ],
    greseli: [
      'Șoldurile lăsate sau cocoașa de pisică.',
      'Jumătăți de repetare — coboară până jos.',
      'Gâtul întins spre podea.',
    ],
    ponturi: [
      'Progresie: bancă înaltă → bancă joasă → sol. Când faci 15 pe sol, ești oficial trecut de nivelul noob.',
    ],
  },
  'cablu-crossover': {
    nume: 'Fluturări la cabluri (crossover)',
    echipamentNume: 'Aparatul cu cabluri (crossover)',
    forma: [
      'Scripeții sus, un pas în față cu un picior pentru stabilitate.',
      'Trage mânerele în arc, jos și în față, până se ating în dreptul buricului.',
      'Revino lent, simțind întinderea pieptului.',
    ],
    utilizare: [
      'Ajustează înălțimea scripeților din pinul lateral al coloanei.',
      'Greutatea din stiva fiecărei coloane, egală pe ambele părți.',
    ],
    greseli: [
      'Aplecare exagerată în față și „aruncarea" greutății.',
      'Coatele care se îndoaie pe parcurs.',
    ],
    ponturi: [
      'Tensiune continuă pe tot arcul — senzația de „pompare" e garantată.',
    ],
  },
  'tractiuni-helcometru': {
    nume: 'Tracțiuni la helcometru (lat pulldown)',
    echipamentNume: 'Helcometrul (aparatul cu scripete vertical)',
    forma: [
      'Priză mai lată decât umerii, genunchii fixați sub perne.',
      'Trage bara la baza gâtului, prin coborârea COATELOR, nu prin tras din brațe.',
      'Pieptul sus, aplecare foarte ușoară pe spate; revino lent, complet.',
    ],
    utilizare: [
      'Reglează pernele pentru genunchi cât stai jos.',
      'Pinul din stivă alege greutatea.',
    ],
    greseli: [
      'Balansarea trunchiului pentru a „smulge" greutatea.',
      'Bara trasă după ceafă — rețetă de accidentare la umăr.',
      'Repetări pe jumătate.',
    ],
    ponturi: [
      'Gândește „coatele în buzunare" — bicepșii se liniștesc și spatele preia lucrul.',
      'Drumul spre prima tracțiune la bară trece pe aici.',
    ],
  },
  'ramat-cablu-asezat': {
    nume: 'Ramat la cablu din așezat',
    echipamentNume: 'Aparatul de ramat cu cablu (scripete orizontal)',
    forma: [
      'Tălpile pe suporți, genunchii ușor îndoiți, spatele drept.',
      'Trage mânerul spre buric, strângând omoplații la final.',
      'Revino întinzând complet brațele, fără să rotunjești spatele.',
    ],
    utilizare: [
      'Mânerul îngust (triunghi) e cel clasic; poți varia cu bară lată.',
    ],
    greseli: [
      'Legănarea trunchiului față-spate ca la vâslit.',
      'Umerii ridicați spre urechi.',
    ],
    ponturi: [
      'Ține pieptul „mândru" pe tot parcursul — poziția se corectează de la sine.',
    ],
  },
  'ramat-gantera': {
    nume: 'Ramat cu gantera (un braț)',
    echipamentNume: 'Ganteră + banca orizontală',
    forma: [
      'Genunchiul și palma pe bancă, spatele paralel cu solul, drept.',
      'Trage gantera spre șold (nu spre umăr), cotul pe lângă corp.',
      'Coboară lent, până la întinderea completă a brațului.',
    ],
    utilizare: [
      'Termină toate repetările pe o parte, apoi schimbă.',
    ],
    greseli: [
      'Rotirea trunchiului ca să „ajute".',
      'Trasul cu bicepsul în loc de spatele.',
    ],
    ponturi: [
      'Imaginează-ți că pornești o drujbă — exact aia e mișcarea.',
    ],
  },
  'ramat-aparat': {
    nume: 'Ramat la aparat cu piept sprijinit',
    echipamentNume: 'Aparatul de ramat (seated row machine)',
    forma: [
      'Pieptul lipit de pernă pe TOT parcursul.',
      'Trage mânerele spre tine cu coatele pe lângă corp.',
      'Strânge omoplații o secundă, revino lent.',
    ],
    utilizare: [
      'Reglează scaunul ca mânerele să fie la înălțimea pieptului.',
      'Pinul din stivă pentru greutate.',
    ],
    greseli: [
      'Dezlipirea pieptului de pernă la trasul greutăților mari.',
    ],
    ponturi: [
      'Sprijinul pentru piept elimină trișatul — greutatea reală a spatelui tău.',
    ],
  },
  'hiperextensii': {
    nume: 'Hiperextensii pentru lombari',
    echipamentNume: 'Banca de hiperextensii (roman chair)',
    forma: [
      'Pernele la nivelul șoldurilor, gleznele fixate.',
      'Coboară trunchiul controlat, cu spatele drept, până la ~90°.',
      'Urcă până corpul e în linie dreaptă — NU mai sus.',
    ],
    utilizare: [
      'Reglează înălțimea pernei de șold ca pliul șoldului să fie liber deasupra ei.',
    ],
    greseli: [
      'Extensia exagerată sus (arcuirea) — de aici vine numele rău al exercițiului.',
      'Mișcări bruște.',
    ],
    ponturi: [
      'Un spate lombar întărit aici te ferește de dureri la orice alt exercițiu. Fă-le săptămânal.',
    ],
  },
  'indreptari-romanesti': {
    nume: 'Îndreptări românești cu haltera',
    echipamentNume: 'Haltera',
    forma: [
      'Bara aproape lipită de picioare pe tot traseul.',
      'Împinge ȘOLDURILE în spate, genunchii doar puțin îndoiți, spatele perfect drept.',
      'Coboară până simți întinderea ischiogambierilor (de obicei sub genunchi), apoi revino strângând fesierii.',
    ],
    utilizare: [
      'Începe cu bara goală sau cu gantere ușoare, în fața oglinzii, din profil.',
    ],
    greseli: [
      'Spatele rotunjit — regula de aur: mai bine mai sus cu spatele drept decât mai jos cocoșat.',
      'Bara plimbată departe de corp.',
    ],
    ponturi: [
      'Da, exercițiul chiar se numește „românesc" în toată lumea (Romanian Deadlift). Poartă-l cu mândrie.',
    ],
  },
  'face-pull': {
    nume: 'Tras spre față la cablu (face pull)',
    echipamentNume: 'Aparatul cu cabluri + frânghie',
    forma: [
      'Scripetele la nivelul feței, frânghia prinsă cu ambele mâini.',
      'Trage capetele frânghiei spre urechi, desfăcând coatele larg.',
      'Strânge omoplații, revino lent.',
    ],
    utilizare: [
      'Greutate mică, repetări multe (15-20) — e exercițiu de sănătate, nu de forță brută.',
    ],
    greseli: [
      'Greutate prea mare și tras din tot corpul.',
    ],
    ponturi: [
      'Antidotul poziției de birou. Umerii traşi în față ți se „deschid" în câteva săptămâni.',
    ],
  },
  'tractiuni-bara': {
    nume: 'Tracțiuni la bară (asistate sau libere)',
    echipamentNume: 'Bara de tracțiuni / aparatul de tracțiuni asistate',
    forma: [
      'Priză puțin mai lată decât umerii, atârnare completă la start.',
      'Trage pieptul spre bară conducând cu coatele în jos.',
      'Coboară controlat, complet — jumătățile nu se pun.',
    ],
    utilizare: [
      'La aparatul asistat: îngenunchezi pe platformă, iar greutatea selectată te ÎMPINGE în sus (mai multă greutate = mai ușor!).',
      'Alternativ: bandă elastică prinsă de bară, sub genunchi.',
    ],
    greseli: [
      'Legănarea corpului (kipping) ca să treci bărbia de bară.',
      'Gâtul întins disperat în loc de tras real.',
    ],
    ponturi: [
      'Prima tracțiune liberă e un moment de sărbătoare oficial în aplicația asta. Lucrează la helcometru și cu asistare până vine ziua.',
    ],
  },
  'presa-umeri-gantere': {
    nume: 'Presă pentru umeri cu gantere',
    echipamentNume: 'Gantere + banca cu spătar vertical',
    forma: [
      'Spătarul aproape vertical, ganterele la nivelul urechilor, palmele în față.',
      'Împinge în sus până brațele sunt aproape întinse, ganterele se apropie deasupra capului.',
      'Coboară lent înapoi la urechi.',
    ],
    utilizare: [
      'Ridică ganterele pe genunchi și „dă-le" pe rând spre umeri cu un impuls de genunchi.',
    ],
    greseli: [
      'Arcuirea puternică a spatelui (transformi în împins înclinat).',
      'Coborâre incompletă, doar câțiva centimetri.',
    ],
    ponturi: [
      'Abdomenul încordat protejează lombarii — imaginează-ți că urmează un pumn în burtă.',
    ],
  },
  'presa-umeri-aparat': {
    nume: 'Presă pentru umeri la aparat',
    echipamentNume: 'Aparatul de presă pentru umeri (shoulder press)',
    forma: [
      'Scaunul reglat ca mânerele să pornească de la nivelul umerilor.',
      'Împinge vertical, coboară controlat.',
      'Spatele lipit de spătar.',
    ],
    utilizare: [
      'Pinul din stivă pentru greutate; multe modele au manete de start la îndemână.',
    ],
    greseli: [
      'Scaun prea jos — pornești din poziție chinuită pentru umeri.',
    ],
    ponturi: [
      'Varianta cu cel mai mic risc pentru umerii de începător.',
    ],
  },
  'ridicari-laterale': {
    nume: 'Ridicări laterale cu gantere',
    echipamentNume: 'Gantere',
    forma: [
      'În picioare, gantere pe lângă corp, coate foarte ușor îndoite.',
      'Ridică lateral până la nivelul umerilor — ca și cum torni apă din două căni.',
      'Coboară LENT — jumătate din exercițiu e coborârea.',
    ],
    utilizare: [
      'Gantere mici. Serios. 2-6 kg e tot ce îți trebuie luni întregi.',
    ],
    greseli: [
      'Balans din genunchi și trunchi la gantere prea grele.',
      'Ridicarea peste nivelul umerilor cu umerii încordați spre urechi.',
    ],
    ponturi: [
      'Umerii „3D" vin din acest exercițiu făcut curat, nu din greutăți mari.',
    ],
  },
  'ridicari-frontale': {
    nume: 'Ridicări frontale cu gantere',
    echipamentNume: 'Gantere',
    forma: [
      'Ridică ganterele în față, alternativ sau simultan, până la nivelul umerilor.',
      'Coate cvasi-întinse, mișcare controlată, fără avânt.',
    ],
    utilizare: [
      'Poți folosi și un disc ținut cu ambele mâini.',
    ],
    greseli: [
      'Legănarea trunchiului pe spate la fiecare repetare.',
    ],
    ponturi: [
      'Dacă faci deja prese pentru umeri, frontalele sunt opționale — partea din față a umărului lucrează oricum mult.',
    ],
  },
  'fluturari-inverse': {
    nume: 'Fluturări inverse (umeri posteriori)',
    echipamentNume: 'Aparatul pec deck (invers) sau gantere',
    forma: [
      'La aparat: pieptul spre pernă, mânerele în față, deschide brațele în lateral-spate.',
      'Cu gantere: aplecat cu spatele drept, deschide brațele lateral ca niște aripi.',
      'Strânge omoplații la final, revino lent.',
    ],
    utilizare: [
      'La pec deck, mută mânerele în poziția „reverse" (spre spate) — au clichet de reglare.',
    ],
    greseli: [
      'Greutate mare și smucituri — deltoidul posterior e mușchi mic.',
    ],
    ponturi: [
      'Cel mai neglijat mușchi la începători și motivul umerilor „traşi în față". Nu-l sări.',
    ],
  },
  'flexii-gantere': {
    nume: 'Flexii biceps cu gantere',
    echipamentNume: 'Gantere',
    forma: [
      'Coatele lipite de corp — sunt balamale, nu se mișcă înainte.',
      'Ridică rotind palma în sus (supinare), strânge sus o clipă.',
      'Coboară lent și complet — brațul se întinde de tot.',
    ],
    utilizare: [
      'Alternativ sau simultan; alternativ permite ceva mai multă greutate.',
    ],
    greseli: [
      'Balansul din spate la fiecare repetare.',
      'Coatele care fug în față — devine ridicare frontală.',
      'Coborâre în cădere liberă.',
    ],
    ponturi: [
      'Vrei brațe? Coborârea lentă (3 secunde) face mai mult decât 5 kg în plus.',
    ],
  },
  'flexii-bara-z': {
    nume: 'Flexii biceps cu bara Z',
    echipamentNume: 'Bara Z (EZ bar)',
    forma: [
      'Priză pe porțiunile înclinate ale barei — de aceea e îndoită, menajează încheieturile.',
      'Aceleași reguli: coate fixe, urcare controlată, coborâre lentă.',
    ],
    utilizare: [
      'Discurile se pun simetric și se fixează cu opritori.',
    ],
    greseli: [
      'Împinsul șoldurilor în față ca să „ajute" bara să urce.',
    ],
    ponturi: [
      'Ambele brațe lucrează împreună — poți progresa în greutate mai ușor decât la gantere.',
    ],
  },
  'flexii-ciocan': {
    nume: 'Flexii ciocan (hammer curl)',
    echipamentNume: 'Gantere',
    forma: [
      'Ca flexiile normale, dar palmele stau față în față tot timpul (ca și cum ai ține un ciocan).',
      'Coate fixe, fără balans.',
    ],
    utilizare: [
      'Merge excelent alternativ, la finalul zilei de brațe.',
    ],
    greseli: [
      'Aceleași ca la flexiile clasice: balans și coate călătoare.',
    ],
    ponturi: [
      'Îngroașă antebrațul și „umple" brațul văzut din lateral.',
    ],
  },
  'flexii-cablu': {
    nume: 'Flexii biceps la cablu',
    echipamentNume: 'Aparatul cu cabluri (scripete jos)',
    forma: [
      'Scripetele jos, bara scurtă atașată.',
      'Un pas în spate, coate fixe la corp, flexie completă.',
    ],
    utilizare: [
      'Schimbi accesoriul (bară dreaptă, frânghie) după preferință — cârligul se desprinde simplu.',
    ],
    greseli: [
      'Statul prea aproape de aparat — dispare tensiunea de la baza mișcării.',
    ],
    ponturi: [
      'Cablul ține mușchiul sub tensiune și jos, unde ganterele „se odihnesc". Pompare maximă.',
    ],
  },
  'extensii-cablu-triceps': {
    nume: 'Extensii triceps la cablu (pushdown)',
    echipamentNume: 'Aparatul cu cabluri + frânghie sau bară scurtă',
    forma: [
      'Scripetele sus, coatele lipite de corp — iar balamale fixe.',
      'Împinge în jos până brațele se întind complet; cu frânghia, desparte capetele la final.',
      'Revino lent până antebrațele trec de paralel.',
    ],
    utilizare: [
      'Frânghia e cea mai prietenoasă cu coatele pentru început.',
    ],
    greseli: [
      'Coatele care se depărtează de corp — devine exercițiu de piept.',
      'Aplecarea cu toată greutatea peste cablu.',
    ],
    ponturi: [
      'Tricepsul e 2/3 din grosimea brațului. Vrei brațe groase? Prioritate la triceps.',
    ],
  },
  'extensii-ganteră-cap': {
    nume: 'Extensii triceps deasupra capului',
    echipamentNume: 'Ganteră',
    forma: [
      'Ținută cu ambele mâini de discul superior, gantera pornește deasupra capului.',
      'Coboară în spatele capului îndoind DOAR coatele.',
      'Întinde brațele complet — coatele rămân aproape de urechi.',
    ],
    utilizare: [
      'Din picioare sau așezat pe bancă cu spătar; așezat e mai stabil pentru început.',
    ],
    greseli: [
      'Coatele care se deschid larg în lateral.',
      'Arcuirea spatelui la greutate prea mare.',
    ],
    ponturi: [
      'Singura poziție care întinde complet capul lung al tricepsului — merită locul în program.',
    ],
  },
  'fondari-paralele': {
    nume: 'Fondări la paralele (dips, asistate)',
    echipamentNume: 'Paralele / aparatul de tracțiuni-fondări asistate',
    forma: [
      'Brațele întinse la start, corpul vertical (triceps) sau ușor aplecat (piept).',
      'Coboară până brațul face ~90° la cot, nu mai jos.',
      'Împinge înapoi fără să blochezi violent coatele.',
    ],
    utilizare: [
      'La aparatul asistat, genunchii pe platformă; mai multă greutate selectată = mai mult ajutor.',
    ],
    greseli: [
      'Coborâre prea adâncă — umerii protestează.',
      'Umerii ridicați spre urechi.',
    ],
    ponturi: [
      'Regele exercițiilor de triceps cu greutatea corpului. Începe asistat fără rușine.',
    ],
  },
  'dips-banca': {
    nume: 'Fondări la bancă (triceps)',
    echipamentNume: 'Banca orizontală',
    forma: [
      'Palmele pe marginea băncii, picioarele întinse în față.',
      'Coboară șezutul pe lângă bancă îndoind coatele la ~90°.',
      'Împinge înapoi sus din triceps.',
    ],
    utilizare: [
      'Cu genunchii îndoiți e mai ușor; cu picioarele pe altă bancă, mai greu.',
    ],
    greseli: [
      'Umerii cocoșați spre urechi la coborâre.',
      'Fundul plimbat departe de bancă.',
    ],
    ponturi: [
      'Exercițiu de rezervă excelent când aparatele sunt ocupate.',
    ],
  },
  'presa-picioare': {
    nume: 'Presă de picioare',
    echipamentNume: 'Presa de picioare (leg press)',
    forma: [
      'Tălpile pe platformă la lățimea umerilor, spatele și șezutul LIPITE de spătar.',
      'Coboară controlat până genunchii fac ~90°.',
      'Împinge prin călcâie fără să blochezi genunchii la final.',
    ],
    utilizare: [
      'Eliberează siguranțele laterale DUPĂ ce ai preluat greutatea cu picioarele; pune-le înapoi înainte să cobori de pe aparat.',
      'Discuri sau stivă, după model. Începe modest — presa iartă, dar nu chiar tot.',
    ],
    greseli: [
      'Genunchii care se ating (colapsul spre interior).',
      'Coborâre atât de adâncă încât șezutul se dezlipește — periculos pentru lombari.',
      'Blocarea agresivă a genunchilor sus.',
    ],
    ponturi: [
      'Cel mai bun prieten al picioarelor de începător: toată încărcarea, fără probleme de echilibru.',
    ],
  },
  'genuflexiuni-corp': {
    nume: 'Genuflexiuni cu greutatea corpului',
    echipamentNume: 'Greutatea corpului',
    forma: [
      'Tălpile la lățimea umerilor, vârfurile ușor în afară.',
      'Șezutul în spate și în jos ca și cum te-ai așeza pe un scaun; pieptul sus.',
      'Coboară cât poți cu călcâiele pe sol, împinge înapoi prin călcâie.',
    ],
    utilizare: [
      'Poți începe cu o cutie sau bancă în spate — te așezi scurt și te ridici.',
    ],
    greseli: [
      'Călcâiele ridicate de pe sol.',
      'Genunchii prăbușiți spre interior.',
      'Privirea în podea și spatele cocoșat.',
    ],
    ponturi: [
      'Stăpânește 20 curate înainte să pui greutate pe spate. Fundamentul întregii forțe de picioare.',
    ],
  },
  'genuflexiuni-smith': {
    nume: 'Genuflexiuni la aparatul Smith',
    echipamentNume: 'Aparatul Smith (bara ghidată)',
    forma: [
      'Bara pe trapez (nu pe gât!), tălpile puțin în fața barei.',
      'Coboară controlat până coapsele ajung paralele cu solul.',
      'Împinge prin călcâie, rotind bara la final ca s-o agăți în cârlige.',
    ],
    utilizare: [
      'Rotești bara ca să o eliberezi din cârlige; aceeași rotație o pune înapoi.',
      'Setează opritorii de siguranță puțin sub punctul cel mai de jos al mișcării.',
    ],
    greseli: [
      'Picioarele exact sub bară — te împinge în față.',
      'Coborâre pe jumătate cu greutate mare de fală.',
    ],
    ponturi: [
      'Bara ghidată = echilibru rezolvat. Pasul intermediar perfect spre genuflexiunile libere.',
    ],
  },
  'extensii-cvadriceps': {
    nume: 'Extensii pentru cvadriceps la aparat',
    echipamentNume: 'Aparatul de extensii picioare (leg extension)',
    forma: [
      'Perna pe gleznă, genunchiul aliniat cu axul aparatului.',
      'Întinde picioarele complet, ține 1 secundă sus.',
      'Coboară lent, fără să lași stiva să cadă.',
    ],
    utilizare: [
      'Reglează spătarul ca genunchiul să fie exact la marginea scaunului, în dreptul pivotului.',
    ],
    greseli: [
      'Smulgerea greutății cu avânt din șold.',
      'Ridicarea șezutului de pe scaun.',
    ],
    ponturi: [
      'Arsura de la final e normală și inofensivă — cvadricepsul e dramatic din fire.',
    ],
  },
  'flexii-ischiogambieri': {
    nume: 'Flexii pentru ischiogambieri la aparat',
    echipamentNume: 'Aparatul de flexii picioare (leg curl)',
    forma: [
      'Întins pe burtă (sau așezat, după model), perna deasupra călcâielor.',
      'Trage călcâiele spre șezut controlat.',
      'Revino lent, fără să lași greutatea să te tragă.',
    ],
    utilizare: [
      'Genunchii aliniați cu pivotul aparatului; reglează perna după lungimea picioarelor.',
    ],
    greseli: [
      'Șoldurile ridicate de pe pernă la varianta culcat.',
      'Repetări smulse.',
    ],
    ponturi: [
      'Ischiogambierii echilibrează genunchiul. Fă-i la fiecare antrenament de picioare, nu doar cvadriceps.',
    ],
  },
  'fandari-gantere': {
    nume: 'Fandări cu gantere',
    echipamentNume: 'Gantere',
    forma: [
      'Pas mare în față, coboară vertical până ambii genunchi fac ~90°.',
      'Genunchiul din spate coboară spre sol fără să-l atingă.',
      'Împinge prin călcâiul piciorului din față ca să revii.',
    ],
    utilizare: [
      'Începe fără greutăți, doar cu corpul, lângă un perete pentru echilibru.',
    ],
    greseli: [
      'Pas prea scurt — genunchiul din față trece mult peste vârf.',
      'Trunchiul aplecat în față.',
    ],
    ponturi: [
      'Lucrează echilibrul și fiecare picior separat — diferențele dintre picioare ies imediat la iveală.',
    ],
  },
  'ridicari-gambe': {
    nume: 'Ridicări pe vârfuri pentru gambe',
    echipamentNume: 'Aparatul de gambe / treaptă + ganteră',
    forma: [
      'Vârfurile pe margine, călcâiele libere.',
      'Coboară călcâiele sub nivel până simți întinderea, apoi urcă pe vârfuri cât de sus poți.',
      'Pauză scurtă sus, coborâre lentă.',
    ],
    utilizare: [
      'La aparat: umerii sub perne, greutate din stivă. Fără aparat: o treaptă și o ganteră în mână.',
    ],
    greseli: [
      'Sărituri rapide pe amplitudine mică — gambele răspund la amplitudine completă.',
    ],
    ponturi: [
      'Gambele suportă mult volum: 15-20 de repetări per set, de 2-3 ori pe săptămână.',
    ],
  },
  'hip-thrust': {
    nume: 'Împins de șolduri (hip thrust)',
    echipamentNume: 'Banca + haltera (sau doar corpul)',
    forma: [
      'Omoplații sprijiniți pe bancă, tălpile pe sol, bara peste șolduri (cu pernuță!).',
      'Împinge șoldurile sus până trunchiul e paralel cu solul, strângând fesierii.',
      'Bărbia în piept, privirea înainte; coboară controlat.',
    ],
    utilizare: [
      'Începe fără bară — doar corpul, apoi un disc, apoi bara cu pernuță de protecție.',
    ],
    greseli: [
      'Arcuirea lombarilor sus în loc de strângerea fesierilor.',
      'Împins din vârfuri în loc de călcâie.',
    ],
    ponturi: [
      'Cel mai eficient exercițiu pur de fesieri, punct. Nu e „doar pentru fete" — te ajută la orice ridicare.',
    ],
  },
  'abductii-aparat': {
    nume: 'Abducții la aparat (fesier lateral)',
    echipamentNume: 'Aparatul de abducții',
    forma: [
      'Așezat, genunchii la pernele exterioare.',
      'Deschide picioarele împotriva rezistenței, ține o clipă, revino lent.',
    ],
    utilizare: [
      'Pinul din stivă; unele modele au manetă de apropiere a pernelor pentru start comod.',
    ],
    greseli: [
      'Avânt și trântirea plăcilor la revenire.',
    ],
    ponturi: [
      'Fesierul mijlociu stabilizează bazinul — utile și pentru genunchi sănătoși la alergare.',
    ],
  },
  'plank': {
    nume: 'Planșa (plank)',
    echipamentNume: 'Saltea',
    forma: [
      'Coatele sub umeri, corpul o linie perfectă din cap în călcâie.',
      'Abdomenul și fesierii încordați; nu lăsa șoldurile să cadă.',
      'Respiră normal — nu-ți ține respirația.',
    ],
    utilizare: [
      'Cronometrează: începe cu 20-30 secunde, adaugă 5-10 secunde pe săptămână.',
    ],
    greseli: [
      'Șoldurile prea sus (cort) sau prea jos (hamac).',
      'Capul lăsat sau ridicat exagerat.',
    ],
    ponturi: [
      'Mai bine 3×30 secunde perfecte decât 2 minute tremurate cu spatele lăsat.',
    ],
  },
  'crunch-saltea': {
    nume: 'Crunch pe saltea',
    echipamentNume: 'Saltea',
    forma: [
      'Întins pe spate, genunchii îndoiți, mâinile la tâmple (nu după ceafă!).',
      'Ridică DOAR omoplații de pe sol, împingând lombarii în saltea.',
      'Expiră la urcare, coboară lent.',
    ],
    utilizare: [
      'Fără echipament; o saltea mai groasă e mai prietenoasă cu spatele.',
    ],
    greseli: [
      'Trasul de ceafă cu mâinile.',
      'Ridicarea întregului trunchi (aia e altă mișcare, cu alt stres pe lombari).',
    ],
    ponturi: [
      'Amplitudine mică + contracție maximă = crunch corect. Nu număra repetările smulse.',
    ],
  },
  'crunch-aparat': {
    nume: 'Crunch la aparat',
    echipamentNume: 'Aparatul de abdomen (ab crunch)',
    forma: [
      'Pieptul pe pernă sau mâinile pe mânere, după model.',
      'Rulează trunchiul în jos din abdomen, nu din brațe.',
      'Revino lent, fără să lași stiva să cadă.',
    ],
    utilizare: [
      'Greutate moderată — abdomenul răspunde la execuție, nu la tone.',
    ],
    greseli: [
      'Trasul din brațe cu abdomenul în vacanță.',
    ],
    ponturi: [
      'Avantajul față de saltea: poți progresa măsurabil în greutate.',
    ],
  },
  'ridicari-picioare': {
    nume: 'Ridicări de genunchi la paralele (captain’s chair)',
    echipamentNume: 'Scaunul căpitanului / paralele cu spătar',
    forma: [
      'Antebrațele pe suporți, spatele lipit de pernă.',
      'Ridică genunchii spre piept rulând ușor bazinul la final.',
      'Coboară lent, fără balans.',
    ],
    utilizare: [
      'Practic orice sală are aparatul combinat cu spătar și suporți de antebraț.',
    ],
    greseli: [
      'Balansarea picioarelor ca un pendul.',
      'Ridicare doar din flexorii șoldului, fără rularea bazinului.',
    ],
    ponturi: [
      'Vrei „abdomenul de jos"? Rularea bazinului la final e tot secretul.',
    ],
  },
  'russian-twist': {
    nume: 'Răsuciri rusești (russian twist)',
    echipamentNume: 'Saltea + disc sau minge medicinală',
    forma: [
      'Așezat, trunchiul lăsat la ~45°, călcâiele pe sol (sau ridicate, mai greu).',
      'Rotește trunchiul stânga-dreapta cu greutatea în mâini.',
      'Mișcarea vine din trunchi, nu din brațele care flutură.',
    ],
    utilizare: [
      'Începe fără greutate; adaugă un disc de 2,5-5 kg când 20 de răsuciri devin ușoare.',
    ],
    greseli: [
      'Spatele complet rotunjit.',
      'Doar brațele se mișcă, trunchiul stă.',
    ],
    ponturi: [
      'Oblicii lucrați aici „strâng" talia vizual mai repede decât o mie de crunch-uri.',
    ],
  },
  'mountain-climbers': {
    nume: 'Alergarea în planșă (mountain climbers)',
    echipamentNume: 'Saltea',
    forma: [
      'Poziție de flotare, umerii deasupra palmelor.',
      'Adu genunchii alternativ spre piept, în ritm susținut.',
      'Spatele drept, șoldurile jos.',
    ],
    utilizare: [
      'Intervale: 20-30 secunde de lucru, 30 secunde pauză.',
    ],
    greseli: [
      'Fundul ridicat ca un munte (ironie, da).',
      'Umerii care rămân în spatele palmelor.',
    ],
    ponturi: [
      'Cardio + abdomen simultan — eficient când timpul e scurt.',
    ],
  },
  'kettlebell-swing': {
    nume: 'Balansul cu kettlebell (swing)',
    echipamentNume: 'Kettlebell (gantera cu mâner)',
    forma: [
      'E o mișcare de ȘOLD, nu de brațe: șoldurile se duc în spate, kettlebell-ul trece printre picioare.',
      'Împinge șoldurile exploziv în față — brațele doar urmează, până la nivelul pieptului.',
      'Spatele drept tot timpul, abdomenul încordat.',
    ],
    utilizare: [
      'Începe cu 8-12 kg; priza de sus, ambele mâini.',
    ],
    greseli: [
      'Genuflexiune + ridicare de brațe — nu, e balans de șold.',
      'Spatele rotunjit jos.',
      'Ridicarea peste cap fără tehnica specifică.',
    ],
    ponturi: [
      'Arde calorii ca sprintul și întărește tot lanțul posterior. Regele exercițiilor „mult în puțin timp".',
    ],
  },
  'farmers-walk': {
    nume: 'Mersul fermierului (farmer’s walk)',
    echipamentNume: 'Gantere sau kettlebell-uri grele',
    forma: [
      'Câte o greutate serioasă în fiecare mână, umerii „în buzunare".',
      'Mergi drept, pași controlați, abdomenul de piatră.',
      'Nu te lăsa tras într-o parte.',
    ],
    utilizare: [
      'Alege o zonă liberă de 10-20 metri; du-te și întoarce-te până expiră timpul.',
    ],
    greseli: [
      'Greutăți prea mici — trebuie să fie o luptă să le ții.',
      'Umerii cocoșați în față.',
    ],
    ponturi: [
      'Cel mai simplu exercițiu din lume: iei greutăți, mergi. Și totuși întărește tot corpul, mai ales priza.',
    ],
  },
  'burpee': {
    nume: 'Burpee',
    echipamentNume: 'Greutatea corpului',
    forma: [
      'Din picioare: palmele pe sol, picioarele sar în spate în poziție de flotare.',
      'Opțional o flotare, apoi picioarele sar înapoi la palme.',
      'Ridică-te cu o săritură mică și palmele deasupra capului.',
    ],
    utilizare: [
      'Versiunea blândă (fără flotare, fără săritură, cu pași în loc de salt) e complet legitimă la început.',
    ],
    greseli: [
      'Șoldurile lăsate în poziția de flotare.',
      'Viteza înaintea formei.',
    ],
    ponturi: [
      'Nimeni nu iubește burpees. Toți iubesc rezultatele lor. 5 la finalul antrenamentului ajung la început.',
    ],
  },
  'genuflexiuni-haltera': {
    nume: 'Genuflexiuni cu bara pe spate (back squat)',
    echipamentNume: 'Haltera + rastelul de genuflexiuni (power rack)',
    forma: [
      'Bara stă pe mușchii trapezului, nu pe osul gâtului. Strânge omoplații și fă-ți o „pernă" de mușchi.',
      'Picioarele la lățimea umerilor, vârfurile ușor spre exterior; genunchii merg în direcția vârfurilor.',
      'Coboară împingând șoldul înapoi ȘI genunchii înainte, până coapsa e cel puțin paralelă cu solul.',
      'Urcă împingând tare în podea cu toată talpa, pieptul sus, spatele neutru tot drumul.',
    ],
    utilizare: [
      'Reglează suporții rastelului la nivelul pieptului: să intri sub bară ușor îndoind genunchii.',
      'Pune ÎNTOTDEAUNA barele de siguranță (safety bars) puțin sub cel mai jos punct al genuflexiunii tale.',
      'Ieși din rastel cu 2-3 pași, nu cu 5 — economisești energie pentru seturi.',
    ],
    greseli: [
      'Ridicarea călcâielor de pe sol — semn de glezne rigide; folosește temporar încălțăminte cu talpă tare.',
      'Rotunjirea spatelui jos la capătul de jos („butt wink") din coborâre prea adâncă pentru mobilitatea ta.',
      'Genunchii care cad spre interior la urcare — împinge-i activ în afară.',
    ],
    ponturi: [
      'Începe cu bara goală (20 kg). Serios. Tehnica se învață ușoară, se corectează greu.',
      'Dacă nu ai rastel cu siguranțe, fă genuflexiuni la Smith sau cu gantere până apare rastelul.',
      'Respirația: inspiri sus, ții aerul la coborâre, expiri după ce ai trecut de punctul greu.',
    ],
  },
  'indreptari-clasice': {
    nume: 'Îndreptări clasice (deadlift)',
    echipamentNume: 'Haltera olimpică + discuri de 20 kg',
    forma: [
      'Bara deasupra mijlocului tălpii, aproape de tibie. Picioarele la lățimea șoldurilor.',
      'Apucă bara puțin în afara genunchilor, coboară șoldul până simți tensiune în ischiogambieri.',
      'Piept sus, spate DREPT (nu vertical — drept), umerii ușor în fața barei.',
      'Împinge podeaua cu picioarele, ține bara lipită de corp, încheie strângând fesierii — nu te lăsa pe spate.',
    ],
    utilizare: [
      'Cu discuri de 20 kg bara stă la înălțimea corectă. Cu discuri mici, ridic-o pe două cutii/step-uri.',
      'Priza mixtă (o palmă în față, una în spate) sau chingi — abia când priza cedează înaintea spatelui.',
      'Coborârea: șold înapoi până bara trece de genunchi, apoi îndoaie genunchii. Nu o „scăpa" pe podea în sală.',
    ],
    greseli: [
      'Spatele rotunjit — cea mai frecventă și cea mai scumpă greșeală. Mai puțină greutate, mai multă tehnică.',
      'Pornirea cu șoldul prea jos (o transformi în genuflexiune cu bara în mâini).',
      'Bara care se depărtează de tibie — pârghia crește și lombarii plătesc nota.',
    ],
    ponturi: [
      'E cel mai „scump" exercițiu ca oboseală: 3-5 seturi sunt suficiente, nu 8.',
      'Zgârieturile pe tibie sunt normale — de-aia poartă lumea jambiere la îndreptări.',
      'Dacă mobilitatea nu ajunge, începe cu îndreptări românești sau de la suporți (rack pulls).',
    ],
  },
  'indreptari-sumo': {
    nume: 'Îndreptări sumo',
    echipamentNume: 'Haltera olimpică',
    forma: [
      'Picioarele mult mai late, vârfurile la 40-45° în afară, mâinile apucă bara PE DINĂUNTRUL genunchilor.',
      'Șoldul mai jos, trunchiul mai vertical decât la clasic — spatele lucrează mai puțin.',
      'Deschide activ genunchii spre exterior și „împinge podeaua în lături".',
    ],
    utilizare: [
      'Aceeași bară și aceleași discuri; se schimbă doar poziția.',
    ],
    greseli: [
      'Ridicarea șoldului înaintea pieptului.',
      'Genunchii care se închid spre interior la pornire.',
    ],
    ponturi: [
      'Dacă ai șolduri mobile și trunchi lung, sumo poate fi net mai confortabil decât clasicul.',
      'Prima porțiune (de la podea) e cea mai grea — nu te grăbi, „strânge" bara de pe sol.',
    ],
  },
  'impins-haltera-inclinat': {
    nume: 'Împins înclinat cu haltera (incline press)',
    echipamentNume: 'Banca înclinată + haltera',
    forma: [
      'Banca la 30-45°. Mai mult de atât și lucrează umerii, nu pieptul.',
      'Bara coboară controlat spre claviculă/partea de sus a pieptului, nu spre stern.',
      'Omoplații strânși și „băgați în buzunarul din spate", tălpile ferm pe sol.',
    ],
    utilizare: [
      'Reglează unghiul băncii ÎNAINTE, apoi poziționează-te ca bara să treacă liber de suporți.',
      'La greutăți serioase cere asistare (spot) — e normal și politicos în orice sală.',
    ],
    greseli: [
      'Unghi prea abrupt (60°+) — devine practic presă de umeri.',
      'Ridicarea feselor de pe bancă la ultima repetare.',
    ],
    ponturi: [
      'Partea de sus a pieptului e ce dă aspectul de „piept plin" — merită prioritate la începători.',
    ],
  },
  'impins-priza-ingusta': {
    nume: 'Împins cu priză îngustă (close grip bench)',
    echipamentNume: 'Banca orizontală + haltera',
    forma: [
      'Priza la lățimea umerilor — NU lipite. Prea îngust doar chinuie încheieturile.',
      'Coatele rămân aproape de corp (30-45°), bara coboară spre partea de jos a pieptului.',
      'Împinge concentrându-te pe „întinderea cotului", nu pe piept.',
    ],
    utilizare: [
      'Aceeași bancă și bară ca la împinsul clasic; se schimbă doar priza și traseul coatelor.',
    ],
    greseli: [
      'Priză lipită — încheieturile se răsucesc dureros.',
      'Coate depărtate — devine împins normal.',
    ],
    ponturi: [
      'Cel mai bun exercițiu compus pentru triceps: crește și împinsul de la piept.',
    ],
  },
  'presa-umeri-haltera': {
    nume: 'Presă militară cu haltera (overhead press)',
    echipamentNume: 'Haltera + rastel',
    forma: [
      'Bara pe partea de sus a pieptului, coatele puțin în fața barei, priza puțin peste umeri.',
      'Trage bărbia pe spate ca bara să urce în linie dreaptă pe lângă nas.',
      'La final capul „trece prin fereastră": bara ajunge deasupra mijlocului capului, nu în față.',
      'Fesele și abdomenul strânse — altfel arcuiești lombarii ca să compensezi.',
    ],
    utilizare: [
      'Scoate bara din rastel de la nivelul pieptului, nu de jos. Fă 1-2 pași în spate.',
      'Fără elan din genunchi — asta e deja alt exercițiu (push press).',
    ],
    greseli: [
      'Arcuirea exagerată a spatelui, cu bara împinsă în față.',
      'Oprirea la jumătatea coborârii — bara trebuie să revină la claviculă.',
    ],
    ponturi: [
      'E cel mai lent exercițiu la progres: +1,25 kg pe săptămână e deja excelent.',
      'Bara goală de 20 kg e un început perfect legitim pentru presă militară.',
    ],
  },
  'ramat-haltera-aplecat': {
    nume: 'Ramat cu haltera din aplecat (bent-over row)',
    echipamentNume: 'Haltera',
    forma: [
      'Șoldul împins înapoi, trunchiul la ~45° sau mai jos, spatele perfect drept.',
      'Trage bara spre buric/partea de jos a abdomenului, coatele pe lângă corp.',
      'Strânge omoplații la final, apoi coboară controlat până brațele se întind complet.',
    ],
    utilizare: [
      'Ridică bara de pe sol ca la o îndreptare, apoi „intră" în poziția aplecată.',
    ],
    greseli: [
      'Ridicarea trunchiului la fiecare repetare (îl transformi în îndreptare cu smucitură).',
      'Tragerea spre piept cu coatele larg deschise — asta lucrează umerii posteriori, nu spatele lat.',
    ],
    ponturi: [
      'Dacă lombarii cedează primii, treci la ramat cu gantera cu sprijin pe bancă.',
      'Regulă bună: greutatea la ramat ≈ 60-70% din împinsul de la piept.',
    ],
  },
  'ramat-t-bar': {
    nume: 'Ramat la T-bar',
    echipamentNume: 'Aparatul de ramat T-bar (sau bara în colț)',
    forma: [
      'Piept pe pernă (dacă aparatul are), sau aplecat cu spatele drept peste bară.',
      'Trage mânerele spre abdomen, coatele aproape de corp, strânge omoplații.',
      'Coboară complet — vrei întinderea maximă a spatelui.',
    ],
    utilizare: [
      'Adaugi discuri direct pe capătul barei; începe cu unul de 10 kg.',
    ],
    greseli: [
      'Ridicarea pieptului de pe pernă și tragerea cu tot corpul.',
      'Repetări scurte, la jumătate de cursă.',
    ],
    ponturi: [
      'Varianta cu piept sprijinit scoate lombarii din ecuație — perfectă când ai făcut deja îndreptări.',
    ],
  },
  'ridicari-umeri-haltera': {
    nume: 'Ridicări de umeri (shrugs)',
    echipamentNume: 'Haltera sau gantere grele',
    forma: [
      'Bara în față, brațele întinse, umerii relaxați în jos la start.',
      'Ridică umerii DREPT în sus, spre urechi. Ține sus o secundă.',
      'Coboară lent, complet — întinderea de jos face jumătate din treabă.',
    ],
    utilizare: [
      'Cu haltera în față sau cu gantere pe lângă corp; ganterele sunt mai prietenoase cu umerii.',
    ],
    greseli: [
      'Rotirea umerilor în cerc — nu adaugă nimic, doar irită articulația.',
      'Îndoirea coatelor — transformă exercițiul într-un ramat prost.',
    ],
    ponturi: [
      'Trapezul suportă greutăți mari; dar dacă nu poți ține 2 secunde sus, e prea greu.',
    ],
  },
  'genuflexiuni-frontale': {
    nume: 'Genuflexiuni frontale (front squat)',
    echipamentNume: 'Haltera + rastel',
    forma: [
      'Bara stă pe umerii din față (deltoizi anteriori), coatele SUS și paralele cu solul.',
      'Trunchiul rămâne vertical; coborâre adâncă, controlată.',
      'Dacă coatele cad, bara cade. Coatele sus e regula numărul unu.',
    ],
    utilizare: [
      'Priza „încrucișată" (brațele în X) e cea mai ușoară pentru începători, dacă încheieturile sunt rigide.',
    ],
    greseli: [
      'Coatele coborâte.',
      'Încercarea de a folosi aceeași greutate ca la back squat — normal e cu 20-30% mai puțin.',
    ],
    ponturi: [
      'Cel mai bun exercițiu pentru cvadricepși și pentru un trunchi puternic. Și cel mai onest: nu poți trișa.',
    ],
  },
  'genuflexiuni-goblet': {
    nume: 'Genuflexiuni goblet (cu gantera la piept)',
    echipamentNume: 'Gantera sau kettlebell',
    forma: [
      'Ține gantera vertical la piept, ca pe un pahar (goblet), coatele sub ea.',
      'Coboară între călcâie, coatele trec pe interiorul genunchilor și îi împing în afară.',
      'Piept sus tot timpul — greutatea din față te ajută automat să stai drept.',
    ],
    utilizare: [
      'O ganteră de 8-16 kg e suficientă mult timp.',
    ],
    greseli: [
      'Gantera ținută prea departe de piept — obosesc umerii înaintea picioarelor.',
    ],
    ponturi: [
      'Cel mai bun mod de a învăța genuflexiunea corectă. Practic imposibil de făcut greșit.',
    ],
  },
  'fandari-bulgaresti': {
    nume: 'Fandări bulgărești (split squat cu piciorul pe bancă)',
    echipamentNume: 'Banca + gantere',
    forma: [
      'Piciorul din spate pe bancă (șiretul sau vârful), cel din față la ~70 cm în față.',
      'Coboară vertical până genunchiul din spate aproape atinge solul.',
      'Împinge prin călcâiul piciorului din față. Trunchiul ușor aplecat = mai mult fesier.',
    ],
    utilizare: [
      'Fără greutate la început. Echilibrul e provocarea, nu greutatea.',
    ],
    greseli: [
      'Pas prea scurt — genunchiul din față trece mult peste vârf și doare.',
      'Împingerea din piciorul de pe bancă.',
    ],
    ponturi: [
      'Numit „split squat" în programele englezești. Un picior odată = dezechilibrele se corectează singure.',
      'Ține-te cu o mână de rastel până prinzi echilibrul, fără rușine.',
    ],
  },
  'fandari-mers': {
    nume: 'Fandări în mers',
    echipamentNume: 'Gantere (sau doar greutatea corpului)',
    forma: [
      'Pas lung în față, coboară până ambii genunchi sunt la ~90°.',
      'Împinge din călcâiul din față și adu piciorul din spate direct în următorul pas.',
      'Trunchiul drept, privirea înainte, abdomenul încordat.',
    ],
    utilizare: [
      'Ai nevoie de un culoar de 8-10 m. Numără repetările pe fiecare picior.',
    ],
    greseli: [
      'Genunchiul din spate lovit de podea.',
      'Pași mici, care încarcă doar genunchiul din față.',
    ],
    ponturi: [
      'Fesierii vor ține minte ziua asta 48 de ore. E normal.',
    ],
  },
  'impins-gantere-inclinat': {
    nume: 'Împins înclinat cu gantere',
    echipamentNume: 'Banca înclinată + gantere',
    forma: [
      'Banca la 30-45°, ganterele pornesc la nivelul pieptului de sus.',
      'Împinge în sus și ușor spre interior; nu ciocni ganterele.',
      'Coboară până simți întinderea în piept, fără să forțezi umărul.',
    ],
    utilizare: [
      'Ridică ganterele pe coapse, apoi „aruncă-le" pe rând în poziție culcându-te pe spate.',
    ],
    greseli: [
      'Coborâre prea adâncă cu umerii rotiți în față.',
      'Ganterele ținute prea depărtate de corp.',
    ],
    ponturi: [
      'Ganterele permit o cursă mai lungă decât bara — mai bun stimul pentru mușchi.',
    ],
  },
  'flexii-inclinat-gantere': {
    nume: 'Flexii biceps pe banca înclinată',
    echipamentNume: 'Banca înclinată + gantere',
    forma: [
      'Banca la 45-60°, stai pe spate cu brațele atârnând complet liber în spatele corpului.',
      'Flexează fără să miști cotul din loc; sus, palmele „privesc" spre umăr.',
      'Coboară până brațul e complet întins — întinderea e tot rostul acestei variante.',
    ],
    utilizare: [
      'Gantere ușoare: poziția e mult mai grea decât în picioare.',
    ],
    greseli: [
      'Ridicarea coatelor înainte.',
      'Ridicarea umerilor de pe spătar la ultimele repetări.',
    ],
    ponturi: [
      'Poziția întinsă lucrează capul lung al bicepsului — partea care dă „vârful".',
    ],
  },
  'flexii-predicator': {
    nume: 'Flexii la pupitru (predicator / preacher curl)',
    echipamentNume: 'Pupitrul de biceps + bara Z',
    forma: [
      'Axila sprijinită pe marginea de sus a pernei; brațele lipite complet de pernă.',
      'Coboară controlat, dar nu relaxa complet cotul în punctul de jos.',
      'Ridică până simți contracția, fără să te ridici de pe scaun.',
    ],
    utilizare: [
      'Reglează scaunul până umerii sunt sub nivelul marginii de sus a pupitrului.',
    ],
    greseli: [
      'Extensia bruscă și completă jos — cea mai bună metodă de a-ți întinde un tendon.',
    ],
    ponturi: [
      'Imposibil de trișat cu balansul — de-aia arde așa.',
    ],
  },
  'extensii-triceps-frunte': {
    nume: 'Extensii triceps culcat („skull crusher")',
    echipamentNume: 'Banca orizontală + bara Z',
    forma: [
      'Culcat, brațele vertical, coatele fixe. Coboară bara spre frunte sau puțin în spatele capului.',
      'Doar antebrațul se mișcă. Umărul rămâne nemișcat.',
      'Întinde complet fără să blochezi brutal cotul.',
    ],
    utilizare: [
      'Bara Z e mult mai blândă cu încheieturile decât bara dreaptă.',
    ],
    greseli: [
      'Coatele care se deschid în lateral.',
      'Coborâre spre piept — devine împins cu priză îngustă.',
    ],
    ponturi: [
      'Numele e sinistru, dar dacă alegi greutatea potrivit e cel mai eficient exercițiu de triceps cu bară.',
    ],
  },
  'ridicari-trunchi': {
    nume: 'Ridicări de trunchi (sit-up)',
    echipamentNume: 'Salteaua (opțional banca de abdomene)',
    forma: [
      'Culcat, genunchii îndoiți, tălpile pe sol. Mâinile încrucișate pe piept (nu la ceafă).',
      'Ridică-te rulând coloana vertebră cu vertebră, până trunchiul e aproape vertical.',
      'Coboară la fel de controlat — nu te „trânti" înapoi.',
    ],
    utilizare: [
      'Dacă tălpile se ridică, blochează-le sub o ganteră sau la banca de abdomene.',
    ],
    greseli: [
      'Mâinile la ceafă, trăgând de cap — gâtul nu e mușchi abdominal.',
      'Repetări rapide cu elan din brațe.',
    ],
    ponturi: [
      'Diferența față de crunch: sit-up-ul ridică tot trunchiul, crunch-ul doar umerii.',
      'Când 20 de repetări devin ușoare, ține o ganteră la piept.',
    ],
  },
  'rasuciri-cablu-oblici': {
    nume: 'Răsuciri cu cablul pentru oblici (oblique cable twist)',
    echipamentNume: 'Aparatul cu cablu (scripete la nivelul pieptului)',
    forma: [
      'Stai lateral față de scripete, brațele întinse, mânerul ținut cu ambele mâini la nivelul pieptului.',
      'Rotește din trunchi, nu din brațe: umerii și șoldurile se răsucesc împreună, brațele rămân întinse.',
      'Revenirea e controlată, cablul nu te trage înapoi.',
    ],
    utilizare: [
      'Reglează scripetele la nivelul pieptului și pune mânerul simplu (D-handle) sau frânghia.',
      'Depărtează-te 2 pași ca să existe tensiune constantă pe cablu.',
    ],
    greseli: [
      'Mișcarea doar din brațe, cu trunchiul nemișcat.',
      'Greutate prea mare care te smucește și forțează lombarii.',
    ],
    ponturi: [
      'Numără repetările PE FIECARE PARTE. 20 pe stânga + 20 pe dreapta.',
      'Fără cablu? Aceeași mișcare cu o bandă elastică prinsă la nivelul pieptului.',
    ],
  },
  'gambe-asezat': {
    nume: 'Ridicări pe vârfuri din așezat',
    echipamentNume: 'Aparatul de gambe din așezat (seated calf raise)',
    forma: [
      'Vârfurile pe suport, călcâiele libere. Perna pe genunchi, nu pe coapsă.',
      'Coboară călcâiele cât de jos poți, apoi ridică-te complet pe vârfuri.',
      'Pauză de o secundă sus și una jos — gambele răspund la timp sub tensiune.',
    ],
    utilizare: [
      'Deblochează maneta laterală după ce ai ridicat prima dată greutatea.',
    ],
    greseli: [
      'Repetări scurte și rapide, ca un motor de cusut.',
    ],
    ponturi: [
      'Din așezat lucrează solearul (gamba „de dedesubt") — completează perfect ridicările din picioare.',
    ],
  },
  'pulover-cablu': {
    nume: 'Pulover la cablu (straight-arm pulldown)',
    echipamentNume: 'Aparatul cu cablu (scripete sus) + bară dreaptă',
    forma: [
      'Brațele întinse (ușor îndoite fix), trage bara într-un arc până la coapse.',
      'Mișcarea vine din umăr, nu din cot. Trunchiul ușor aplecat, nemișcat.',
      'Simte dorsalii cum se contractă — e un exercițiu de „conectare", nu de greutăți mari.',
    ],
    utilizare: [
      'Scripetele sus, bară dreaptă sau frânghie; poziționează-te la 2 pași de aparat.',
    ],
    greseli: [
      'Îndoirea coatelor — devine extensie de triceps.',
      'Balansul din trunchi.',
    ],
    ponturi: [
      'Cel mai bun exercițiu pentru a învăța cum SE SIMTE spatele lucrând, înaintea tracțiunilor.',
    ],
  },
  'ramat-cablu-un-brat': {
    nume: 'Ramat la cablu cu un braț',
    echipamentNume: 'Aparatul cu cablu + mâner simplu',
    forma: [
      'Un picior în față pentru stabilitate, trage mânerul spre șold cu cotul lipit de corp.',
      'Lasă umărul să se întindă complet în față la revenire, apoi trage-l înapoi.',
      'Trunchiul rămâne nemișcat — doar brațul și omoplatul lucrează.',
    ],
    utilizare: [
      'Scripete la nivelul pieptului sau jos; mâner simplu (D-handle).',
    ],
    greseli: [
      'Rotirea trunchiului la fiecare repetare pentru a câștiga câțiva centimetri.',
    ],
    ponturi: [
      'Un braț odată = observi imediat dacă o parte e mai slabă. Începe seria cu partea slabă.',
    ],
  },
  'fluturari-inverse-cablu': {
    nume: 'Fluturări inverse la cablu (rear delt fly)',
    echipamentNume: 'Aparatul cu cablu (două scripete)',
    forma: [
      'Cablurile încrucișate în față, apucă mânerul opus cu fiecare mână.',
      'Deschide brațele lateral, în arc, până în linie cu umerii. Coatele aproape întinse.',
      'Revenire lentă, controlată — nu lăsa greutatea să te tragă.',
    ],
    utilizare: [
      'Ambele scripete la nivelul umerilor; ia mânerul din stânga cu mâna dreaptă și invers.',
    ],
    greseli: [
      'Greutate prea mare → tragi cu trapezul și cu spatele, nu cu umerii posteriori.',
    ],
    ponturi: [
      'Umerii posteriori sunt cel mai neglijat mușchi la începători — și cei care corectează postura.',
    ],
  },
  'abdomene-roata': {
    nume: 'Roata de abdomene (ab wheel)',
    echipamentNume: 'Roata de abdomene',
    forma: [
      'Din genunchi, roata sub umeri. Bazinul „băgat sub tine" (fără arcuirea spatelui).',
      'Rulează înainte cât poți păstra spatele DREPT. Un centimetru în plus cu spate rotunjit nu contează.',
      'Trage-te înapoi cu abdomenul, nu cu brațele.',
    ],
    utilizare: [
      'Genunchii pe un prosop pliat. Pune o pernă în față ca limită la început.',
    ],
    greseli: [
      'Lăsarea șoldului în jos și arcuirea lombarilor — de aici vin durerile de spate.',
    ],
    ponturi: [
      'Dacă lombarii te dor a doua zi, ai mers prea departe. Ai răbdare: câțiva centimetri pe lună.',
    ],
  },
  'tractiuni-supinat': {
    nume: 'Tracțiuni cu priză supinată (chin-up)',
    echipamentNume: 'Bara fixă de tracțiuni',
    forma: [
      'Palmele spre tine, la lățimea umerilor. Atârnă cu brațele complet întinse.',
      'Trage până bărbia trece de bară, coatele coboară pe lângă corp.',
      'Coboară complet, controlat. Fără balans din picioare.',
    ],
    utilizare: [
      'Nu poți nici una? Folosește aparatul asistat, banda elastică prinsă de bară, sau doar coborâri lente (negative).',
      'Sari sus, ține-te la bărbie deasupra barei și coboară în 5 secunde — 3-5 repetări.',
    ],
    greseli: [
      'Balansul (kipping) — arată spectaculos, nu construiește spatele.',
      'Repetări la jumătate, fără întindere jos.',
    ],
    ponturi: [
      'Priza supinată e mai ușoară decât cea pronată pentru că bicepsul ajută mult. Începe cu ea.',
      'AMRAP („cât poți") înseamnă exact atât: mergi până mai poți face O repetare curată.',
    ],
  },
  'tractiuni-negative': {
    nume: 'Tracțiuni negative (doar coborârea)',
    echipamentNume: 'Bara fixă + o cutie/step ca să ajungi sus',
    forma: [
      'Urcă pe cutie și pornește cu bărbia deasupra barei.',
      'Ia picioarele de pe cutie și coboară cât de LENT poți — țintește 5 secunde.',
      'Când ajungi jos, urcă din nou pe cutie. Asta e o repetare.',
    ],
    utilizare: [
      'O cutie, un step aerobic sau chiar banca de la piept — orice te ridică la bară.',
    ],
    greseli: [
      'Coborârea prea rapidă — negativa e tot rostul exercițiului.',
    ],
    ponturi: [
      'Cea mai rapidă cale de la 0 tracțiuni la prima tracțiune. 3 seturi × 3-5 negative, de 2 ori pe săptămână.',
      'Flexu a plâns la prima. A doua săptămână deja râdea.',
    ],
  },
  'ramat-orizontal-bara': {
    nume: 'Ramat orizontal la bară joasă (inverted row)',
    echipamentNume: 'Bara din rastel la nivelul șoldului (sau TRX)',
    forma: [
      'Atârnă sub bară cu corpul întins ca o scândură, călcâiele pe sol.',
      'Trage pieptul până atinge bara, coatele pe lângă corp, strânge omoplații.',
      'Coboară complet, corpul rămâne drept din umeri până în călcâie.',
    ],
    utilizare: [
      'Reglezi dificultatea din unghi: bara mai sus = mai ușor, corpul mai orizontal = mai greu.',
      'Picioarele pe o bancă = versiunea grea.',
    ],
    greseli: [
      'Șoldul lăsat în jos.',
      'Repetări scurte, fără atingerea barei.',
    ],
    ponturi: [
      'Cel mai bun „tras" pentru un începător care încă nu are nicio tracțiune.',
    ],
  },
  'fondari-paralele-libere': {
    nume: 'Fondări la paralele (dips liberi)',
    echipamentNume: 'Paralele fixe',
    forma: [
      'Sprijinit pe brațe întinse, corpul ușor aplecat în față pentru piept sau drept pentru triceps.',
      'Coboară până brațul e la ~90° — nu mai jos dacă simți umărul.',
      'Împinge în sus fără să blochezi brutal coatele.',
    ],
    utilizare: [
      'Nu ai nicio repetare? Folosește aparatul asistat sau banda elastică peste paralele.',
      'Când 12 devin ușoare, adaugă greutate cu centura de fondări.',
    ],
    greseli: [
      'Coborâre exagerată cu umerii ridicați spre urechi — sursa clasică de accidentare la umăr.',
    ],
    ponturi: [
      '„Genuflexiunea părții de sus" — dips-ul construiește piept și triceps ca nimic altceva.',
    ],
  },
  'flotari-inclinate': {
    nume: 'Flotări cu mâinile pe suport (flotări înclinate)',
    echipamentNume: 'Banca, un step sau bara din rastel',
    forma: [
      'Mâinile pe bancă/bară, corpul întins, o linie dreaptă din cap în călcâie.',
      'Coboară pieptul până atinge suportul, coatele la ~45° față de corp.',
      'Împinge înapoi complet, „împinge pământul departe de tine".',
    ],
    utilizare: [
      'Cu cât suportul e mai sus, cu atât e mai ușor. Coboară suportul pe măsură ce devii mai puternic.',
    ],
    greseli: [
      'Șoldul lăsat sau ridicat.',
      'Coatele deschise la 90° — dor umerii.',
    ],
    ponturi: [
      'Scara completă: perete → bancă → step → sol → picioare ridicate. Urcă o treaptă la 15 repetări curate.',
    ],
  },
  'flotari-diamant': {
    nume: 'Flotări diamant (priză îngustă)',
    echipamentNume: 'Doar corpul',
    forma: [
      'Palmele sub piept, degetele mari și arătătoarele formând un romb („diamant").',
      'Coatele rămân lipite de corp la coborâre.',
      'Corpul rigid ca o scândură tot timpul.',
    ],
    utilizare: [
      'Prea greu? Fă-le cu mâinile pe o bancă (varianta înclinată).',
    ],
    greseli: [
      'Coatele care se deschid — pierzi tot accentul pe triceps.',
      'Șoldul care „conduce" mișcarea.',
    ],
    ponturi: [
      'Cel mai eficient exercițiu de triceps cu greutatea corpului, măsurat în studii EMG.',
    ],
  },
  'genuflexiuni-pistol-asistate': {
    nume: 'Genuflexiuni pe un picior asistate (pistol squat)',
    echipamentNume: 'Un stâlp/TRX de care să te ții',
    forma: [
      'Un picior întins în față, coboară pe celălalt cât poți controla.',
      'Ține-te ușor de un stâlp doar pentru echilibru, nu ca să te tragi în sus.',
      'Călcâiul rămâne pe sol; trunchiul se apleacă natural în față.',
    ],
    utilizare: [
      'Variantă mai ușoară: coboară pe o bancă și ridică-te de pe ea („box pistol").',
    ],
    greseli: [
      'Prăbușirea în jos fără control.',
      'Genunchiul care cade spre interior.',
    ],
    ponturi: [
      'Testul suprem de forță pe un picior. Nu e obligatoriu, dar e o insignă frumoasă.',
    ],
  },
  'ridicari-picioare-atarnat': {
    nume: 'Ridicări de picioare atârnat la bară (hanging leg raise)',
    echipamentNume: 'Bara fixă de tracțiuni',
    forma: [
      'Atârnă cu brațele întinse, umerii activi (nu „prăbușit" în articulație).',
      'Ridică picioarele întinse până la orizontală sau mai sus, rulând bazinul la final.',
      'Coboară LENT. Zero balans — dacă te legeni, e prea greu.',
    ],
    utilizare: [
      'Prea greu cu picioarele întinse? Începe cu genunchii îndoiți (hanging knee raise).',
    ],
    greseli: [
      'Folosirea elanului — ajungi să faci un pendul, nu abdomene.',
      'Ridicarea doar din flexorii șoldului, fără rularea bazinului la final.',
    ],
    ponturi: [
      'Priza cedează înaintea abdomenului? Chingile de bară rezolvă problema.',
      'Cel mai greu exercițiu de abdomen din sală care nu are nevoie de niciun aparat.',
    ],
  },
  'plank-lateral': {
    nume: 'Scândura laterală (side plank)',
    echipamentNume: 'Salteaua',
    forma: [
      'Pe o parte, cotul sub umăr, corpul într-o linie dreaptă din cap în glezne.',
      'Ridică șoldul și ține-l sus. Nu lăsa bazinul să cadă înapoi sau înainte.',
      'Respiră normal — dacă îți ții respirația, ai cedat deja.',
    ],
    utilizare: [
      'Mai ușor: sprijină genunchii pe sol. Mai greu: ridică brațul și piciorul de sus.',
    ],
    greseli: [
      'Șoldul lăsat în jos.',
      'Rotirea corpului spre podea.',
    ],
    ponturi: [
      'Oblicii lucrați cu izometrie protejează spatele mai bine decât 100 de răsuciri.',
    ],
  },
  'pod-fesier-sol': {
    nume: 'Pod fesier la sol (glute bridge)',
    echipamentNume: 'Salteaua',
    forma: [
      'Culcat pe spate, genunchii îndoiți, tălpile la ~30 cm de fese.',
      'Împinge prin călcâie și ridică șoldul până corpul e drept de la umeri la genunchi.',
      'Strânge fesierii sus 2 secunde. Nu hiperextinde lombarii.',
    ],
    utilizare: [
      'Când devine ușor, pune o ganteră pe șold sau fă-l pe un singur picior.',
    ],
    greseli: [
      'Împingerea din vârfuri în loc de călcâie.',
      'Arcuirea lombarilor în loc de contracția fesierilor.',
    ],
    ponturi: [
      'Perfect ca încălzire înaintea genuflexiunilor — „trezește" fesierii care stau pe scaun toată ziua.',
    ],
  },
  'superman': {
    nume: 'Superman (extensii la sol)',
    echipamentNume: 'Salteaua',
    forma: [
      'Culcat pe burtă, brațele întinse în față.',
      'Ridică simultan brațele și picioarele câțiva centimetri; privirea spre podea, gâtul neutru.',
      'Ține 2 secunde sus, coboară controlat.',
    ],
    utilizare: [
      'Varianta mai ușoară: braț drept + picior stâng, apoi invers („bird dog" la sol).',
    ],
    greseli: [
      'Ridicarea capului și privitul înainte — încarcă gâtul degeaba.',
    ],
    ponturi: [
      'Nu ai bancă de hiperextensii? Superman face aceeași treabă acasă, cu zero echipament.',
    ],
  },
  'urcari-banca': {
    nume: 'Urcări pe bancă (step-up)',
    echipamentNume: 'Banca sau cutia pliometrică (+ gantere)',
    forma: [
      'Toată talpa pe bancă, urcă împingând DOAR din piciorul de sus.',
      'Nu te avânta cu piciorul de jos și nu sări.',
      'Coboară controlat, cu același picior de sprijin, până celălalt atinge ușor solul.',
    ],
    utilizare: [
      'Banca la înălțimea genunchiului. Mai sus = mai mult fesier, dar mai greu de controlat.',
    ],
    greseli: [
      'Împingerea din piciorul de jos.',
      'Coborârea prin „cădere".',
    ],
    ponturi: [
      'Exercițiul care se traduce direct în scări urcate fără să gâfâi.',
    ],
  },
  'jumping-jacks': {
    nume: 'Sărituri cu desfacerea picioarelor (jumping jacks)',
    echipamentNume: 'Doar corpul',
    forma: [
      'Sari desfăcând picioarele și ducând brațele deasupra capului.',
      'Aterizare moale, pe toată talpa, genunchii ușor îndoiți.',
      'Ritm constant, respirație ritmică.',
    ],
    utilizare: [
      'Zero echipament. 30-60 de secunde ca încălzire generală.',
    ],
    greseli: [
      'Aterizarea rigidă, pe călcâie.',
    ],
    ponturi: [
      'Cea mai rapidă încălzire când toate benzile sunt ocupate.',
    ],
  },
  'atarnare-bara': {
    nume: 'Atârnare pasivă la bară (dead hang)',
    echipamentNume: 'Bara fixă de tracțiuni',
    forma: [
      'Apucă bara la lățimea umerilor și atârnă relaxat, dar cu umerii activi.',
      'Respiră adânc. Umerii nu se prăbușesc lângă urechi.',
      'Coboară controlat, nu sări de la înălțime.',
    ],
    utilizare: [
      'Ai nevoie doar de o bară. Un scaun sub tine ajută la urcare și coborâre.',
    ],
    greseli: [
      'Atârnare complet pasivă, cu umerii „scoși din articulație", dacă ai umeri sensibili.',
    ],
    ponturi: [
      'Priza e ce te oprește de la prima tracțiune, de obicei. 3 × 30 de secunde rezolvă asta în câteva săptămâni.',
      'Bonus: întinde coloana după o zi de stat pe scaun.',
    ],
  },
  'birddog': {
    nume: 'Bird dog (braț + picior opus)',
    echipamentNume: 'Salteaua',
    forma: [
      'În patru labe: mâinile sub umeri, genunchii sub șolduri, spatele neutru.',
      'Întinde brațul drept și piciorul stâng simultan, până ajung în linie cu trunchiul.',
      'Ține 3 secunde fără să lași șoldul să se rotească. Schimbă partea.',
    ],
    utilizare: [
      'Un prosop pliat sub genunchi dacă podeaua e dură.',
    ],
    greseli: [
      'Rotirea bazinului.',
      'Ridicarea piciorului prea sus, cu arcuirea lombarilor.',
    ],
    ponturi: [
      'Cea mai bună încălzire înaintea îndreptărilor și a genuflexiunilor.',
      'Un pahar cu apă imaginar pe spate: dacă se varsă, ai barat.',
    ],
  },
  'catarare-frankie': {
    nume: 'Mers de urs (bear crawl)',
    echipamentNume: 'Doar corpul + spațiu liber',
    forma: [
      'În patru labe cu genunchii ridicați 5 cm de sol.',
      'Mergi înainte mutând braț + picior OPUS simultan.',
      'Șoldul rămâne jos, spatele plat ca o masă.',
    ],
    utilizare: [
      'Un culoar de 6-8 metri. Înainte și înapoi.',
    ],
    greseli: [
      'Șoldul ridicat în „V" — pierzi complet lucrul abdomenului.',
    ],
    ponturi: [
      'Arată caraghios, arde ca naiba, lucrează tot corpul. Flexu îl adoră.',
    ],
  },
  'ramat-trx': {
    nume: 'Ramat la TRX (chingi de suspensie)',
    echipamentNume: 'Chingile TRX',
    forma: [
      'Ține mânerele, lasă-te pe spate cu corpul întins și călcâiele înfipte în sol.',
      'Trage-te până mânerele ajung lângă coaste, coatele pe lângă corp.',
      'Coboară complet, controlat, cu umerii activi.',
    ],
    utilizare: [
      'Dificultatea o reglezi din pași: cu cât tălpile sunt mai în față, cu atât e mai greu.',
      'Chingile se prind de orice ancoră solidă — bara rastelului merge perfect.',
    ],
    greseli: [
      'Șoldul lăsat în jos.',
      'Tragerea cu coatele mult depărtate.',
    ],
    ponturi: [
      'Reglaj infinit al dificultății — practic orice începător poate face un set corect.',
    ],
  },
  'impins-sanie': {
    nume: 'Împins sania (prowler push)',
    echipamentNume: 'Sania de împins (prowler / sled)',
    forma: [
      'Prinde stâlpii jos (mai greu, mai mult picioare) sau sus (mai vertical, mai ușor).',
      'Trunchiul aplecat în linie cu brațele, pași scurți și deși.',
      'Împinge continuu — dacă sania se oprește, e prea greu.',
    ],
    utilizare: [
      'Adaugi discuri pe suport; pe covor sau gazon sintetic merge mai greu decât pe parchet.',
      'Culoare de 15-20 m, dus-întors, 20-30 de secunde pe repriză.',
    ],
    greseli: [
      'Prea multă greutate → mers, nu împins.',
      'Spatele rotunjit din efort.',
    ],
    ponturi: [
      'Zero coborâre (fază excentrică) = arde plămânii, dar aproape fără febră musculară a doua zi.',
      'Cel mai bun „cardio" pentru cineva care urăște cardio-ul.',
    ],
  },
  'incalzire-articulara': {
    nume: 'Încălzire articulară generală',
    echipamentNume: 'Doar corpul',
    forma: [
      'De sus în jos: rotiri de gât (blând), umeri, coate, încheieturi, șolduri, genunchi, glezne.',
      '10 rotiri în fiecare sens pentru fiecare articulație.',
      'Mișcări ample, dar fără forțare — încălzești, nu întinzi.',
    ],
    utilizare: [
      'Zero echipament. 3-5 minute înainte de orice antrenament de forță.',
    ],
    greseli: [
      'Sărirea peste ea „ca să câștigi timp" — apoi 3 săptămâni de pauză din cauza umărului.',
    ],
    ponturi: [
      'Regula lui Flexu: dacă ai timp să te antrenezi, ai timp să te încălzești.',
    ],
  },
  'mobilitate-solduri': {
    nume: 'Mobilitate de șolduri (fandare cu rotire)',
    echipamentNume: 'Salteaua',
    forma: [
      'Pas mare în fandare, mâinile pe sol lângă piciorul din față.',
      'Coboară șoldul spre podea, apoi ridică brațul din interior spre tavan, rotind trunchiul.',
      'Ține 3 respirații, schimbă partea.',
    ],
    utilizare: [
      'Un covoraș și 2 minute. Ideal înainte de genuflexiuni.',
    ],
    greseli: [
      'Grăbirea — mobilitatea vine din respirat, nu din forțat.',
    ],
    ponturi: [
      'Dacă „butt wink"-ul de la genuflexiuni te enervează, aici e leacul.',
    ],
  },
  'intindere-finala': {
    nume: 'Întinderi finale (stretching)',
    echipamentNume: 'Salteaua',
    forma: [
      'După antrenament, ține fiecare întindere 30 de secunde, fără arcuiri.',
      'Grupele lucrate în ziua respectivă au prioritate.',
      'Respiră lung; senzația e de tensiune plăcută, nu de durere.',
    ],
    utilizare: [
      '5 minute la final, pe covoraș.',
    ],
    greseli: [
      'Întinderi puternice ÎNAINTE de forță — scad temporar forța. Lasă-le la final.',
    ],
    ponturi: [
      'Nu previne febra musculară (nimic nu o previne), dar te face să te simți om.',
    ],
  },
};
