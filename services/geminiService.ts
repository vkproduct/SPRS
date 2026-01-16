
import { GoogleGenAI } from "@google/genai";

export const generateWeddingAdvice = async (userPrompt: string): Promise<string> => {
  // We use process.env.API_KEY as required by strict SDK guidelines.
  // This is polyfilled in vite.config.ts using VITE_API_KEY.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. Please ensure VITE_API_KEY is added to Vercel Environment Variables.");
    return "Sistem za savete trenutno nije dostupan (nedostaje konfiguracija). Molimo pokušajte kasnije.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Using the recommended model for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: userPrompt,
      config: {
        systemInstruction: `Vi ste SveZaProslavu AI, stručni konsultant za organizaciju događaja u Srbiji. 
        Vaš cilj je da pomognete korisnicima sa savetima o organizaciji raznih proslava: venčanja, rođendana (dečijih i odraslih), krštenja, krsnih slava i korporativnih događaja.
        
        Teme o kojima savetujete:
        1. Odabir lokacija (restorani, sale, igraonice) u Srbiji (Beograd, Novi Sad, Niš, Kragujevac...).
        2. Običaji i tradicija (posebno za svadbe, krštenja i slave).
        3. Budžetiranje i cene (dajte okvirne procene u evrima za tržište Srbije).
        4. Muzika, dekoracija, torta i fotograf.
        
        Odgovarajte na srpskom jeziku, ljubazno, kratko i korisno. 
        Formatirajte odgovor koristeći Markdown (bold, liste).`,
        temperature: 0.7,
      }
    });

    return response.text || "Nisam uspeo da generišem odgovor. Molim vas pokušajte ponovo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Došlo je do greške prilikom komunikacije sa AI asistentom.";
  }
};
