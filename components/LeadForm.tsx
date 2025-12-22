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
    <section className="lead-form py-20 bg-portal-dark text-white" id="biznis">
      <div className="lead-form__container container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="lead-form__info md:w-1/2">
          <h2 className="lead-form__title text-4xl md:text-5xl font-bold mb-6">
            Ponudite svoje usluge na portalu
          </h2>
          <p className="lead-form__text text-lg font-light text-gray-300 mb-8 max-w-lg">
            Imate restoran, salu za proslave, bend, fotografsku agenciju ili poslastičarnicu? Pridružite se zajednici najboljih i popunite svoje termine.
          </p>
          <div className="lead-form__divider h-1 w-20 bg-white rounded-full"></div>
        </div>

        <div className="lead-form__card md:w-1/2 w-full bg-white text-portal-dark rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="lead-form__form flex flex-col gap-4">
              <h3 className="lead-form__form-title text-xl font-bold mb-2">Prijavite se za rani pristup</h3>
              <div className="lead-form__input-group flex flex-col gap-1">
                <label className="lead-form__label text-xs font-bold text-gray-500 uppercase">Email adresa</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ime@kompanija.com"
                  className="lead-form__input p-4 border border-gray-300 rounded-lg outline-none focus:border-portal-dark focus:ring-1 focus:ring-portal-dark transition-all"
                />
              </div>
              
              <button 
                type="submit"
                className="lead-form__submit bg-gradient-to-r from-[#E61E4D] to-[#D80565] text-white py-4 rounded-lg font-bold text-lg hover:opacity-95 transition-opacity mt-2"
              >
                Počnite
              </button>
            </form>
          ) : (
            <div className="lead-form__success py-10 text-center">
              <div className="lead-form__success-icon text-primary text-5xl mb-4">✓</div>
              <h3 className="lead-form__success-title text-2xl font-bold mb-2">Hvala vam!</h3>
              <p className="lead-form__success-text text-gray-500">Kontaktiraćemo vas uskoro sa detaljima.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};