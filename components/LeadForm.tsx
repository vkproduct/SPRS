
import React, { useState } from 'react';
import { submitPartnerLead } from '../services/vendorService';

export const LeadForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const success = await submitPartnerLead(email);
    setLoading(false);

    if (success) {
        setSubmitted(true);
        setEmail('');
    } else {
        alert("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  return (
    <section className="lead-form py-20 bg-portal-dark text-white" id="biznis">
      <div className="lead-form__container container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        <div className="lead-form__info md:w-1/2">
          <h2 className="lead-form__title text-4xl md:text-5xl font-bold mb-6">
            Partnerstvo za ugostitelje i agencije
          </h2>
          <h3 className="text-xl font-medium text-gray-200 mb-4">
            Ponudite svoje usluge na najvećem portalu za proslave u Srbiji
          </h3>
          <p className="lead-form__text text-lg font-light text-gray-300 mb-8 max-w-lg">
            Imate restoran, salu za proslave, bend, fotografsku agenciju ili poslastičarnicu? Pridružite se zajednici najboljih i popunite svoje termine tokom cele godine.
          </p>
          <div className="lead-form__divider h-1 w-20 bg-white rounded-full"></div>
        </div>

        <div className="lead-form__card md:w-1/2 w-full bg-white text-portal-dark rounded-2xl p-8 shadow-2xl">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="lead-form__form flex flex-col gap-4">
              <div className="lead-form__form-title text-xl font-bold mb-2">Prijavite se za rani pristup</div>
              <div className="lead-form__input-group flex flex-col gap-1">
                <label className="lead-form__label text-xs font-bold text-gray-500 uppercase">Email adresa</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ime@kompanija.com"
                  disabled={loading}
                  className="lead-form__input p-4 border border-gray-300 rounded-lg outline-none focus:border-portal-dark focus:ring-1 focus:ring-portal-dark transition-all disabled:bg-gray-100"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="lead-form__submit bg-gradient-to-r from-[#E61E4D] to-[#D80565] text-white py-4 rounded-lg font-bold text-lg hover:opacity-95 transition-opacity mt-2 flex items-center justify-center"
              >
                {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Počnite besplatno'}
              </button>
            </form>
          ) : (
            <div className="lead-form__success py-10 text-center animate-fade-in">
              <div className="lead-form__success-icon text-primary text-5xl mb-4">✓</div>
              <h3 className="lead-form__success-title text-2xl font-bold mb-2">Hvala vam!</h3>
              <p className="lead-form__success-text text-gray-500 mb-4">Vaša prijava je primljena. Naš tim će vas kontaktirati uskoro.</p>
              <button onClick={() => setSubmitted(false)} className="text-sm text-primary font-bold hover:underline">Pošalji još jedan</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
