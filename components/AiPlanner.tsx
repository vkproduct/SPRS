import React from 'react';
import { Calculator, Users, CheckSquare, Clock, PieChart, Armchair, ChevronRight } from 'lucide-react';

export const AiPlanner: React.FC = () => {
  const tools = [
    {
      icon: <Calculator size={28} />,
      title: "Online kalkulator troškova",
      desc: "Kontrolišite budžet venčanja i pratite svaku uplatu."
    },
    {
      icon: <Armchair size={28} />,
      title: "Plan rasporeda sedenja",
      desc: "Rasporedite goste za stolove jednostavno prevlačenjem."
    },
    {
      icon: <CheckSquare size={28} />,
      title: "Lista svadbenih obaveza",
      desc: "Ne propustite nijednu sitnicu uz detaljan vodič."
    },
    {
      icon: <Clock size={28} />,
      title: "Satnica (Tajming)",
      desc: "Isplanirajte scenario venčanja minut po minut."
    },
    {
      icon: <Users size={28} />,
      title: "Lista gostiju",
      desc: "Jednostavni filteri, statusi pozivnica i statistika."
    }
  ];

  return (
    <section className="planner py-24 bg-portal-bg border-t border-gray-100" id="planer">
      <div className="planner__container container mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="planner__header text-center max-w-3xl mx-auto mb-16">
          <h2 className="planner__title text-3xl md:text-5xl font-bold text-portal-dark mb-6 tracking-tight">
            Vaš lični <span className="text-primary">Planer</span>
          </h2>
          <p className="planner__description text-lg text-portal-gray leading-relaxed">
            Sve što vam je potrebno za organizaciju savršenog dana na jednom mestu. 
            Potpuno besplatni alati za mladence.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="planner__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {tools.map((tool, index) => (
            <div 
              key={index} 
              className="tool-card bg-white p-8 rounded-2xl shadow-card hover:shadow-floating transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-100 relative overflow-hidden"
            >
              <div className="tool-card__icon mb-6 inline-flex p-4 rounded-full bg-portal-bg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                {tool.icon}
              </div>
              <h3 className="tool-card__title text-xl font-bold text-portal-dark mb-3 group-hover:text-primary transition-colors">
                {tool.title}
              </h3>
              <p className="tool-card__desc text-portal-gray leading-relaxed font-light text-[15px]">
                {tool.desc}
              </p>
            </div>
          ))}

          {/* Call to Action Card */}
          <div className="cta-card bg-gradient-to-br from-primary to-[#D80565] p-8 rounded-2xl shadow-card flex flex-col justify-center items-start text-white relative overflow-hidden group cursor-pointer">
            <div className="cta-card__content relative z-10">
              <h3 className="cta-card__title text-2xl font-bold mb-3">Započnite odmah</h3>
              <p className="cta-card__text text-white/90 mb-8 font-light">Kreirajte nalog i pristupite svim alatima besplatno.</p>
              <button className="cta-card__button bg-white text-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                Registracija <ChevronRight size={16} />
              </button>
            </div>
            
            {/* Decorative background circle */}
            <div className="cta-card__bg-circle absolute -right-6 -bottom-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

        </div>
      </div>
    </section>
  );
};