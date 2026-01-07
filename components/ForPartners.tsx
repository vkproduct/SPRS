
import React, { useState, useMemo } from 'react';
import { CheckCircle, TrendingUp, Calendar, DollarSign, Star, Shield, Users, ChevronDown, ChevronUp, ArrowRight, X, Gift, BarChart3, Search, Zap, Check, AlertCircle } from 'lucide-react';
import { ViewType } from '../App';
import { SEOManager } from './SEOManager';

interface ForPartnersProps {
    onNavigate: (view: ViewType) => void;
}

type PartnerCategory = 'venue' | 'media' | 'service';
type BillingPeriod = 'monthly' | 'yearly';

export const ForPartners: React.FC<ForPartnersProps> = ({ onNavigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Pricing State
  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory>('venue');
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleRegisterClick = () => {
      onNavigate('partner-auth');
  };

  // Pricing Logic
  const pricingData = useMemo(() => {
      let basePrice = 0;
      let discountPercent = 0;
      let title = "";
      let avgJobValue = 0; // Average earnings from one job

      switch (selectedCategory) {
          case 'venue':
              basePrice = 69; // Restorani, Sale
              discountPercent = 20; // 20% discount
              title = "Restorani i Sale";
              avgJobValue = 2500; // Approx earnings per wedding
              break;
          case 'media':
              basePrice = 29; // Fotografi, Muzika
              discountPercent = 20; // 20% discount
              title = "Foto, Video i Muzika";
              avgJobValue = 600;
              break;
          case 'service':
              basePrice = 13; // Dekoracija, Torte, Ostalo
              discountPercent = 20; // 20% discount
              title = "Dekoracija, Torte i Ostalo";
              avgJobValue = 300;
              break;
      }

      // Calculate Single Paid Plan
      const monthly = basePrice;
      const yearlyTotal = basePrice * 12 * ((100 - discountPercent) / 100);
      const yearlyMonthlyEq = yearlyTotal / 12;

      return {
          title,
          discountPercent,
          avgJobValue,
          plan: {
              monthly: monthly,
              yearlyTotal: Math.round(yearlyTotal),
              yearlyMonthlyEq: parseFloat(yearlyMonthlyEq.toFixed(1))
          }
      };
  }, [selectedCategory]);

  const currentPrice = billingPeriod === 'monthly' ? pricingData.plan.monthly : pricingData.plan.yearlyMonthlyEq;

  // Comparison Data
  const comparisonData = [
      { 
          label: "Mesečni trošak", 
          portal: { text: "13€ - 69€", sub: "Fiksno / mes" }, 
          ads: { text: "300€ - 1000€+", sub: "Budžet za oglase" },
          highlight: true 
      },
      { 
          label: "Povrat investicije (ROI)", 
          portal: { text: "20x - 50x", sub: "Visok povrat" }, 
          ads: { text: "2x - 5x", sub: "Nizak povrat" },
          highlight: true 
      },
      { 
          label: "Kvalitet publike", 
          portal: { text: "100% Kupci", sub: "Traže uslugu" }, 
          ads: { text: "~2% Konverzija", sub: "Hladan saobraćaj" },
          highlight: false 
      },
      { 
          label: "Vreme za podešavanje", 
          portal: { text: "15 min", sub: "Jednokratno" }, 
          ads: { text: "5+ sati", sub: "Mesečno održavanje" },
          highlight: false 
      },
      { 
          label: "SEO Rangiranje", 
          portal: { text: "Uključeno", sub: "Google 1. strana" }, 
          ads: { text: "Nema uticaja", sub: "Plaćate svaki klik" },
          highlight: false 
      },
  ];

  // FAQ Schema Data
  const faqs = [
      { q: "Zašto bih plaćao ako već imam Instagram?", a: "Instagram je odličan za inspiraciju, ali SveZaProslavu.rs donosi 'tople' klijente koji su spremni da kupe. Ovde ljudi dolaze sa namerom da organizuju događaj." },
      { q: "Šta ako ne dobijem nijedan upit?", a: "Besplatni nalog nema vremensko ograničenje, tako da nemate rizik. Za plaćene pakete nudimo 14 dana probnog perioda - ako niste zadovoljni, otkažite jednim klikom." },
      { q: "Da li uzimate proviziju od mojih poslova?", a: "Ne! Zarada od klijenata je 100% vaša. Mi naplaćujemo samo fiksnu mesečnu pretplatu za korišćenje platforme (ili ništa, ako ste na besplatnom planu)." },
      { q: "Koliko vremena treba za održavanje profila?", a: "Samo 15-20 minuta za inicijalno postavljanje. Nakon toga, samo odgovarate na upite koji vam stižu. Nema potrebe za stalnim objavljivanjem kao na društvenim mrežama." },
      { q: "Ja sam iz manjeg grada, da li to radi?", a: "Apsolutno! U manjim mestima je konkurencija manja, pa ćete verovatno biti prvi izbor za sve proslave u vašem kraju." }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": f.a
        }
    }))
  };

  return (
    <div className="partner-page bg-white pt-36">
      <SEOManager 
         title="Partner Program | SveZaProslavu.rs"
         description="Pridružite se mreži najboljih ugostitelja i agencija. Povećajte broj rezervacija bez provizije."
         jsonLd={faqSchema}
      />
      
      {/* SECTION 1: HERO */}
      <section className="partner-hero relative bg-portal-dark text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Event bg" className="w-full h-full object-cover" />
        </div>
        
        <div className="partner-hero__container container mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          
          <article className="partner-hero__content lg:w-3/5">
            <div className="inline-block bg-primary/20 text-primary-light border border-primary/30 rounded-full px-4 py-1 mb-6 text-sm font-semibold tracking-wide">
              🚀 Prvih 100 partnera dobija bonuse
            </div>
            <h1 className="partner-hero__title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Popunite kalendar proslavama tokom <span className="text-primary">cele godine</span>
            </h1>
            <p className="partner-hero__subtitle text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Venčanja, rođendani, korporativne žurke. Primajte kvalitetne upite svakog dana bez trošenja novca na veoma skupo reklame.
            </p>
            
            <div className="partner-hero__trust flex flex-wrap gap-4 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Besplatno zauvek</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Bez provizije</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-primary" /> Sve vrste proslava</div>
            </div>
          </article>

          {/* Quick Start Form */}
          <div className="partner-hero__form lg:w-2/5 w-full bg-white text-portal-dark rounded-2xl p-8 md:p-10 shadow-2xl relative flex flex-col justify-center items-center text-center">
             <h3 className="text-2xl font-bold mb-4">Započnite besplatno</h3>
             <p className="text-gray-500 mb-8">
                Pridružite se mreži od preko 1000 profesionalaca u Srbiji. Registracija traje manje od 2 minuta.
             </p>
             
             <button onClick={handleRegisterClick} className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-rose-600 transition-all shadow-lg transform hover:-translate-y-1 text-lg flex items-center justify-center gap-2">
                Otvori besplatni profil <ArrowRight size={20} />
             </button>
             
             <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-400">
                 <span className="flex items-center gap-1"><Shield size={12} /> Bezbedni podaci</span>
                 <span className="flex items-center gap-1"><DollarSign size={12} /> Bez skrivenih troškova</span>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM */}
      <section className="partner-problems py-20 bg-portal-bg">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4">Da li vam ovo zvuči poznato?</h2>
                <p className="text-portal-gray">Izazovi sa kojima se suočava 90% ugostitelja i agencija u Srbiji.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: "Prazni termini", text: "Vikendi su puni, ali radni dani ostaju prazni. Teško je naći korporativne klijente." },
                    { title: "Skupa reklama", text: "Instagram i Facebook 'jedu' budžet, a rezultati su često nepredvidivi." },
                    { title: "Previše pitanja", text: "Gubite sate odgovarajući na poruke 'pošto je', a malo ko rezerviše." },
                    { title: "Jaka konkurencija", text: "Teško je istaći se kada klijenti gledaju samo ko nudi nižu cenu." }
                ].map((item, idx) => (
                    <article key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4 font-bold text-xl">!</div>
                        <h3 className="font-bold text-lg mb-2 text-portal-dark">{item.title}</h3>
                        <p className="text-sm text-portal-gray leading-relaxed">{item.text}</p>
                    </article>
                ))}
            </div>
        </div>
      </section>

      {/* SECTION 3: SOLUTION */}
      <section className="partner-solution py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4">Samo 3 koraka do novih klijenata</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-gray-100 -z-10"></div>
                {[
                    { icon: Users, title: "1. Kreirajte profil", desc: "Besplatno dodajte slike, opis usluga i cene. Traje manje od 15 minuta.", time: "15 min" },
                    { icon: Star, title: "2. Primajte upite", desc: "Klijenti vas pronalaze za svadbe, rođendane i proslave i šalju zahteve.", time: "Automatski" },
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

      {/* SECTION 4: COMPARISON TABLE & ROI */}
      <section className="partner-comparison py-20 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6 md:px-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4">Zašto SveZaProslavu, a ne samo oglasi?</h2>
                <p className="text-portal-gray">Pogledajte razliku između specijalizovanog portala i klasičnog oglašavanja na društvenim mrežama.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-stretch">
                
                {/* COMPARISON TABLE */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col h-full">
                    <div className="grid grid-cols-3 bg-portal-dark text-white p-6 font-bold text-sm md:text-base">
                        <div className="flex items-center gap-2">Karakteristika</div>
                        <div className="text-center text-primary flex justify-center items-center gap-2"><CheckCircle size={18} /> SveZaProslavu</div>
                        <div className="text-center text-gray-400 opacity-80">Google / FB Ads</div>
                    </div>
                    
                    <div className="text-sm md:text-base flex-1 flex flex-col justify-between">
                        {comparisonData.map((row, idx) => (
                            <div key={idx} className={`grid grid-cols-3 p-5 border-b border-gray-100 hover:bg-gray-50 transition-colors flex-1 items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                <div className="font-bold text-gray-700 flex items-center">{row.label}</div>
                                
                                {/* Portal Column */}
                                <div className="text-center flex flex-col items-center justify-center border-x border-gray-100 h-full px-2">
                                    <span className={`font-bold text-lg ${row.highlight ? 'text-primary' : 'text-gray-800'}`}>
                                        {row.portal.text}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full mt-1">
                                        {row.portal.sub}
                                    </span>
                                </div>

                                {/* Ads Column */}
                                <div className="text-center flex flex-col items-center justify-center text-gray-500 h-full px-2">
                                     <span className="font-semibold">{row.ads.text}</span>
                                     <span className="text-xs text-gray-400 mt-1">{row.ads.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROI CALCULATOR CARD */}
                <div className="bg-gradient-to-br from-primary to-[#D80565] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                    
                    <div>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <BarChart3 className="text-white" /> Matematika uspeha
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm shadow-inner">
                                <div className="text-xs text-white/80 uppercase font-bold mb-1">Prosečna zarada (1 posao)</div>
                                <div className="text-4xl font-bold tracking-tight">~{pricingData.avgJobValue}€</div>
                                <div className="text-xs text-white/70 mt-1">Za kategoriju: {pricingData.title}</div>
                            </div>

                            <div className="flex items-center justify-center text-2xl font-bold opacity-50 my-2">VS</div>

                            <div className="bg-white/10 p-5 rounded-xl backdrop-blur-sm border border-white/20 shadow-inner">
                                <div className="text-xs text-white/80 uppercase font-bold mb-1">Godišnja članarina</div>
                                <div className="text-4xl font-bold text-white">
                                    {pricingData.plan.yearlyTotal}€
                                </div>
                                <div className="text-xs text-green-300 mt-1 font-bold flex items-center gap-1">
                                    <Check size={12} /> Vaš jedini trošak za 12 meseci
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/20">
                        <p className="font-medium text-lg leading-tight">
                            <span className="text-yellow-300 font-bold text-xl">Zaključak:</span> <br/>
                            Samo <span className="underline decoration-yellow-300 decoration-2 font-bold">JEDNA</span> rezervacija pokriva trošak portala za narednih 4-5 godina!
                        </p>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* SECTION 6: PRICING (SPLIT LAYOUT) */}
      <section className="partner-pricing py-24 bg-portal-bg" id="cenovnik">
         <div className="container mx-auto px-6 md:px-12">
            
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
                
                {/* LEFT SIDE: CONTROLS */}
                <div className="w-full lg:w-1/3 lg:sticky lg:top-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-portal-dark mb-4 leading-tight">
                        Transparentne cene bez skrivenih troškova
                    </h2>
                    <p className="text-gray-500 mb-8 text-lg">
                        Prilagodili smo pakete vašem tipu poslovanja. Izaberite kategoriju da biste videli tačnu cenu.
                    </p>

                    {/* 1. Category Selector */}
                    <div className="mb-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vaša delatnost</label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-white border-2 border-gray-200 text-portal-dark font-bold text-lg py-4 px-6 rounded-xl focus:outline-none focus:border-primary shadow-sm cursor-pointer transition-colors"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as PartnerCategory)}
                            >
                                <option value="venue">Restorani, Sale, Hoteli, Imanja</option>
                                <option value="media">Fotografi, Video, Bendovi, DJ</option>
                                <option value="service">Dekoracija, Torte, Šminka, Prevoz</option>
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                <ChevronDown size={24} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Billing Toggle */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm inline-flex flex-col w-full">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-bold text-gray-500">Način plaćanja</span>
                             {billingPeriod === 'yearly' && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                                    Štedite {pricingData.discountPercent}%
                                </span>
                             )}
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}>
                            <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${billingPeriod === 'yearly' ? 'bg-primary' : 'bg-gray-300'}`}>
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${billingPeriod === 'yearly' ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="font-medium text-portal-dark">
                                {billingPeriod === 'yearly' ? 'Godišnja pretplata' : 'Mesečna pretplata'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: CARDS */}
                <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    
                    {/* Free Plan */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col hover:border-gray-300 transition-colors">
                        <h3 className="text-xl font-bold text-portal-dark mb-2">Besplatno</h3>
                        <div className="text-4xl font-bold mb-1">0€ <span className="text-lg font-normal text-gray-500">/ zauvek</span></div>
                        <p className="text-sm text-gray-500 mb-6">Za one koji tek počinju i žele osnovno prisustvo.</p>
                        
                        <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

                        <ul className="space-y-4 text-sm mb-8 flex-1">
                            <li className="flex gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500 shrink-0" /> Osnovni profil u pretrazi</li>
                            <li className="flex gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500 shrink-0" /> Do 5 fotografija</li>
                            <li className="flex gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500 shrink-0" /> Prikaz kontakt telefona</li>
                            <li className="flex gap-3 text-gray-400 opacity-50"><X size={18} className="shrink-0" /> Bez linka ka sajtu/Instagramu</li>
                            <li className="flex gap-3 text-gray-400 opacity-50"><X size={18} className="shrink-0" /> Ograničena vidljivost</li>
                        </ul>
                        <button onClick={handleRegisterClick} className="w-full py-3 border-2 border-gray-200 text-portal-dark font-bold rounded-xl hover:border-portal-dark hover:bg-gray-50 transition-all">
                            Počnite besplatno
                        </button>
                    </div>

                    {/* Premium Plan (Dynamic) */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-primary relative flex flex-col">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide shadow-md whitespace-nowrap">
                            Preporuka za {pricingData.title}
                        </div>
                        <h3 className="text-xl font-bold text-portal-dark mb-2">Premium Partner</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-4xl font-bold text-primary">{currentPrice}€</span>
                            <span className="text-lg font-normal text-gray-500">/ mes</span>
                        </div>
                        
                        {/* Savings Badge */}
                        <div className="h-6 mb-6">
                            {billingPeriod === 'yearly' ? (
                                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                                    Plaćate {pricingData.plan.yearlyTotal}€ godišnje
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400">Plaćanje na mesečnom nivou</span>
                            )}
                        </div>

                        <div className="w-full h-[1px] bg-gray-100 mb-6"></div>

                        <ul className="space-y-4 text-sm mb-8 flex-1">
                            <li className="flex gap-3 text-gray-700 font-medium"><CheckCircle size={18} className="text-primary shrink-0" /> <strong>Sve iz Besplatnog</strong></li>
                            <li className="flex gap-3 text-gray-700"><CheckCircle size={18} className="text-primary shrink-0" /> Neograničene slike i video</li>
                            <li className="flex gap-3 text-gray-700"><CheckCircle size={18} className="text-primary shrink-0" /> Linkovi ka sajtu i mrežama</li>
                            <li className="flex gap-3 text-gray-700"><CheckCircle size={18} className="text-primary shrink-0" /> <span className="font-bold text-portal-dark">TOP pozicije</span> u pretrazi</li>
                            <li className="flex gap-3 text-gray-700"><CheckCircle size={18} className="text-primary shrink-0" /> Oznaka "Verified Partner"</li>
                            <li className="flex gap-3 text-gray-700"><CheckCircle size={18} className="text-primary shrink-0" /> Odgovaranje na recenzije</li>
                        </ul>
                        <button onClick={handleRegisterClick} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-rose-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Postanite Premium Partner
                        </button>
                    </div>
                </div>

            </div>
         </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section className="partner-faq py-20 bg-white" itemScope itemType="https://schema.org/FAQPage">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <h2 className="text-3xl font-bold text-center text-portal-dark mb-12">Često postavljana pitanja</h2>
            <div className="space-y-4">
                {faqs.map((faq, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                        <button 
                            className="w-full flex justify-between items-center p-5 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                            onClick={() => toggleFaq(idx)}
                        >
                            <span className="font-bold text-portal-dark" itemProp="name">{faq.q}</span>
                            {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                        {activeFaq === idx && (
                            <div className="p-5 bg-white text-gray-600 border-t border-gray-100" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                                <div itemProp="text">{faq.a}</div>
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
            <button onClick={handleRegisterClick} className="bg-white text-primary font-bold text-lg px-10 py-5 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                Registrujte se besplatno <ArrowRight size={20} />
            </button>
        </div>
      </section>
    </div>
  );
};
