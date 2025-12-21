import React, { useState } from 'react';

export const LeadForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="py-20 bg-airbnb-dark text-white" id="biznis">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ponudite svoje usluge na portalu
          </h2>
          <p className="text-lg font-light text-gray-300 mb-8 max-w-lg">
            Pridružite se zajednici najboljih fotografa, restorana i dekoratera. Iskoristite priliku za besplatnu promociju tokom lansiranja.
          </p>
          <div className="h-1 w-20 bg-white rounded-full"></div>
        </div>

        <div className="md:w-1/2 w-full bg-white text-airbnb-dark rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h3 className="text-xl font-bold mb-2">Prijavite se za rani pristup</h3>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Email adresa</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ime@kompanija.com"
                  className="p-4 border border-gray-300 rounded-lg outline-none focus:border-airbnb-dark focus:ring-1 focus:ring-airbnb-dark transition-all"
                />
              </div>
              
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#E61E4D] to-[#D80565] text-white py-4 rounded-lg font-bold text-lg hover:opacity-95 transition-opacity mt-2"
              >
                Počnite
              </button>
            </form>
          ) : (
            <div className="py-10 text-center">
              <div className="text-primary text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">Hvala vam!</h3>
              <p className="text-gray-500">Kontaktiraćemo vas uskoro sa detaljima.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};