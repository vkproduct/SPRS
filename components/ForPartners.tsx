import React, { useState } from 'react';
import { CheckCircle, TrendingUp, Calendar, DollarSign, Star, Shield, Users, ChevronDown, ChevronUp, ArrowRight, X } from 'lucide-react';

export const ForPartners: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [formState, setFormState] = useState({ name: '', category: '', city: '', phone: '', email: '' });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleScrollToForm = () => {
    const formElement = document.getElementById('registration-form');
    if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="partner-page bg-white pt-20">
      
      {/* SECTION 1: HERO */}
      <section className="partner-hero relative bg-portal-dark text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Wedding bg" className="w-full h-full object-cover" />
        </div>
        
        <div className="partner-hero__container container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <div className="partner-hero__content lg:w-3/5">
            <div className="inline-block bg-primary/20 text-primary-light border border-primary/30 rounded-full px-4 py-1 mb-6 text-sm font-semibold tracking-wide">
              🚀 Prvih 100 partnera dobija bonuse
            </div>
            <h1 className="partner-hero__title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Popunite kalendar venčanjima tokom <span className="text-primary">cele godine</span>
            </h1>
            <p className="partner-hero__subtitle text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Ne dozvolite da mladenci odu konkurenciji. Primajte kvalitetne upite svakog dana bez trošenja novca na neefikasne reklame.
            </p>
            
            <div className="partner-hero__trust flex flex-wrap gap-4 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Besplatno zauvek</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Bez provizije</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> 5 min za podešavanje</div>
            </div>
          </div>

          {/* Registration Form in Hero */}
          <div className="partner-hero__form lg:w-2/5 w-full bg-white text-portal-dark rounded-2xl p-6 md:p-8 shadow-2xl relative" id="registration-form">
             <h3 className="text-2xl font-bold mb-4 text-center">Započnite besplatno</h3>
             <form className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ime i prezime</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-gray-50" placeholder="Vaše ime" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kategorija</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-gray-50">
                        <option value="">Izaberite uslugu...</option>
                        <option value="venue">Restoran / Sala</option>
                        <option value="photo">Fotograf</option>
                        <option value="music">Muzika / Bend</option>
                        <option value="decor">Dekoracija</option>
                        <option value="other">Ostalo</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grad</label>
                    <input type="text" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-gray-50" placeholder="npr. Beograd" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Telefon</label>
                    <input type="tel" className="w-full p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary outline-none bg-gray-50" placeholder="+381 6..." />
                </div>
                <button type="button" className="bg-primary text-white font-bold py-4 rounded-lg hover:bg-rose-600 transition-all shadow-lg transform hover:-translate-y-1 mt-2">
                    Otvori besplatni profil
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                    Bez obaveza. Otkazivanje u svakom trenutku.
                </p>
             </form>
          </div>

        </div>
      </section>

      {/* SECTION 2: PROBLEM */}
      <section className="partner-problems py-20 bg-portal-bg">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4">Da li vam ovo zvuči poznato?</h2>
                <p className="text-portal-gray">Izazovi sa kojima se suočava 90% svadbenih profesionalaca u Srbiji.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: "Sezonski padovi", text: "Leti ste prebukirani, a zimi kalendar ostaje prazan i prihodi padaju." },
                    { title: "Skupa reklama", text: "Instagram i Facebook 'jedu' budžet, a rezultati su često nepredvidivi." },
                    { title: "Previše pitanja", text: "Gubite sate odgovarajući na poruke 'pošto je', a malo ko rezerviše." },
                    { title: "Jaka konkurencija", text: "Teško je istaći se kada klijenti gledaju samo ko nudi nižu cenu." }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 font-bold text-xl">!</div>
                        <h3 className="font-bold text-lg mb-2 text-portal-dark">{item.title}</h3>
                        <p className="text-sm text-portal-gray leading-relaxed">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 3: SOLUTION */}
      <section className="partner-solution py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4">Samo 3 koraka do prvog klijenta</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gray-100 -z-10"></div>

                {[
                    { icon: Users, title: "1. Kreirajte profil", desc: "Besplatno dodajte slike, opis usluga i cene. Traje manje od 15 minuta.", time: "15 min" },
                    { icon: Star, title: "2. Primajte upite", desc: "Mladenci vas pronalaze putem pametne pretrage i šalju direktne zahteve.", time: "Automatski" },
                    { icon: DollarSign, title: "3. Zatvorite posao", desc: "Dogovorite detalje direktno sa klijentom i naplatite svoju uslugu 100%.", time: "Vaša magija" }
                ].map((step, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center text-center bg-white">
                        <div className="w-24 h-24 bg-portal-bg rounded-full flex items-center justify-center text-primary mb-6 shadow-sm border-4 border-white z-10">
                            <step.icon size={36} />
                        </div>
                        <h3 className="text-xl font-bold text-portal-dark mb-2">{step.title}</h3>
                        <p className="text-portal-gray text-sm px-4 mb-2">{step.desc}</p>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{step.time}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 4: BENEFITS */}
      <section className="partner-benefits py-20 bg-portal-dark text-white">
        <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {[
                    { icon: TrendingUp, title: "Više klijenata bez reklame", desc: "Mladenci traže baš vas. Pojavljujete se u pravom trenutku kada su spremni da rezervišu." },
                    { icon: Calendar, title: "Pun kalendar cele godine", desc: "Zaboravite na mrtve sezone. Portal radi 24/7 i donosi klijente koji planiraju unapred." },
                    { icon: Shield, title: "Samo ozbiljni upiti", desc: "Bez spama. Klijenti vide vaše cene i uslove pre nego što vas kontaktiraju." },
                    { icon: Star, title: "Reputacija radi za vas", desc: "Jedan dobar utisak donosi deset novih preporuka kroz naš sistem ocenjivanja." },
                    { icon: TrendingUp, title: "Statistika i uvid", desc: "Pratite koliko ljudi gleda vaš profil i šta ih najviše interesuje." },
                    { icon: Users, title: "Vaša pravila", desc: "Vi birate s kim radite. Odbijte termine koji vam ne odgovaraju bez penala." }
                ].map((benefit, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className="shrink-0 mt-1">
                            <benefit.icon size={32} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                            <p className="text-gray-400 font-light leading-relaxed">{benefit.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 5: SOCIAL PROOF */}
      <section className="partner-testimonials py-20 bg-white">
         <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold text-center text-portal-dark mb-16">Priče prvih partnera</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Marija Petrović", role: "Svadbeni fotograf, Beograd", quote: "Ranije sam zavisila od Instagrama, sada mi 70% klijenata dolazi preko portala. Najbolja odluka za moj biznis.", result: "+24 upita/mes", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
                    { name: "Restoran 'Zlatni Dvor'", role: "Novi Sad", quote: "Popunili smo termine za sledeću godinu brže nego ikada. Panel za upravljanje je veoma jednostavan.", result: "Kalendar 90% pun", image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=200&q=80" },
                    { name: "DJ Marko", role: "Niš", quote: "Sviđa mi se što su klijenti ozbiljni. Nema gubljenja vremena, odmah prelazimo na dogovor.", result: "0€ troška reklame", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
                ].map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-8 rounded-2xl relative">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                            <div>
                                <div className="font-bold text-portal-dark">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.role}</div>
                            </div>
                        </div>
                        <p className="text-portal-gray italic mb-6">"{item.quote}"</p>
                        <div className="inline-block bg-white border border-gray-200 rounded-full px-3 py-1 text-xs font-bold text-primary">
                            {item.result}
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* SECTION 6: PRICING */}
      <section className="partner-pricing py-20 bg-portal-bg" id="cenovnik">
         <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-portal-dark mb-4">Transparentne cene</h2>
            <p className="text-center text-gray-500 mb-16">Bez skrivenih troškova. Plaćate samo ako ste zadovoljni.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-portal-dark mb-2">Besplatno</h3>
                    <div className="text-4xl font-bold mb-1">0€ <span className="text-lg font-normal text-gray-500">/ zauvek</span></div>
                    <p className="text-sm text-gray-500 mb-6">Za one koji tek počinju.</p>
                    <button onClick={handleScrollToForm} className="w-full py-3 border border-portal-dark text-portal-dark font-bold rounded-lg hover:bg-gray-50 transition-colors mb-6">
                        Počnite besplatno
                    </button>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Osnovni profil</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Do 5 fotografija</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Prikaz u pretrazi</li>
                        <li className="flex gap-2 text-gray-400"><X size={16} /> Prioritetno rangiranje</li>
                        <li className="flex gap-2 text-gray-400"><X size={16} /> Direktni link ka sajtu</li>
                    </ul>
                </div>

                {/* Standard Plan (Popular) */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-primary relative transform md:scale-105 z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        Najpopularnije
                    </div>
                    <h3 className="text-xl font-bold text-portal-dark mb-2">Standard</h3>
                    <div className="text-4xl font-bold mb-1">29€ <span className="text-lg font-normal text-gray-500">/ mes</span></div>
                    <p className="text-sm text-gray-500 mb-6">Sve što vam treba za rast.</p>
                    <button onClick={handleScrollToForm} className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-rose-600 transition-colors mb-6 shadow-md">
                        Probajte 14 dana besplatno
                    </button>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> <strong>Sve iz Besplatnog</strong></li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Neograničene slike</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Istaknuti profil</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Statistika pregleda</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Direktni linkovi</li>
                    </ul>
                </div>

                {/* Premium Plan */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h3 className="text-xl font-bold text-portal-dark mb-2">Premium</h3>
                    <div className="text-4xl font-bold mb-1">79€ <span className="text-lg font-normal text-gray-500">/ mes</span></div>
                    <p className="text-sm text-gray-500 mb-6">Dominacija u vašem gradu.</p>
                    <button onClick={handleScrollToForm} className="w-full py-3 bg-portal-dark text-white font-bold rounded-lg hover:opacity-90 transition-colors mb-6">
                        Postanite Premium
                    </button>
                    <ul className="space-y-3 text-sm">
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> <strong>Sve iz Standarda</strong></li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Zagarantovan TOP 3</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> "Provereno" bedž</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Email promocija</li>
                        <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Lični menadžer</li>
                    </ul>
                </div>

            </div>
            <div className="text-center mt-8 text-sm text-gray-400 flex justify-center gap-4">
                <span>🔒 Bezbedno plaćanje</span>
                <span>💳 Kartice & PayPal</span>
            </div>
         </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="partner-faq py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-portal-dark mb-12">Često postavljana pitanja</h2>
            
            <div className="space-y-4">
                {[
                    { q: "Zašto bih plaćao ako već imam Instagram?", a: "Instagram je odličan za inspiraciju, ali SvadbeniPortal donosi 'tople' klijente koji su spremni da kupe. Ovde ljudi dolaze sa namerom da rezervišu, a ne da samo gledaju slike." },
                    { q: "Šta ako ne dobijem nijedan upit?", a: "Besplatni nalog nema vremensko ograničenje, tako da nemate rizik. Za plaćene pakete nudimo 14 dana probnog perioda - ako niste zadovoljni, otkažite jednim klikom." },
                    { q: "Da li uzimate proviziju od mojih poslova?", a: "Ne! Zarada od klijenata je 100% vaša. Mi naplaćujemo samo fiksnu mesečnu pretplatu za korišćenje platforme (ili ništa, ako ste na besplatnom planu)." },
                    { q: "Koliko vremena treba za održavanje profila?", a: "Samo 15-20 minuta za inicijalno postavljanje. Nakon toga, samo odgovarate na upite koji vam stižu. Nema potrebe za stalnim objavljivanjem kao na društvenim mrežama." },
                    { q: "Ja sam iz manjeg grada, da li to radi?", a: "Apsolutno! U manjim mestima je konkurencija manja, pa ćete verovatno biti prvi izbor za sve mlade iz vašeg kraja." }
                ].map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button 
                            className="w-full flex justify-between items-center p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleFaq(idx)}
                        >
                            <span className="font-bold text-portal-dark">{faq.q}</span>
                            {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {activeFaq === idx && (
                            <div className="p-5 bg-white text-gray-600 border-t border-gray-100">
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="partner-cta py-20 bg-gradient-to-r from-primary to-[#D80565] text-white text-center">
        <div className="container mx-auto px-6 md:px-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Preuzmite kontrolu nad svojim biznisom</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Pridružite se zajednici najboljih. Bez rizika, bez skrivenih troškova. Prvi klijent vas možda već traži.</p>
            
            <button 
                onClick={handleScrollToForm}
                className="bg-white text-primary font-bold text-lg px-10 py-5 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
            >
                Registrujte se besplatno <ArrowRight size={20} />
            </button>
            
            <div className="mt-8 flex justify-center gap-8 text-sm font-medium opacity-80">
                <span>⚡ Aktivacija odmah</span>
                <span>🔒 Bez kreditne kartice</span>
            </div>
        </div>
      </section>

    </div>
  );
};