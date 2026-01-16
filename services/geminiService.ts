
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  // In Vite/Vercel, we prioritize import.meta.env
  // We trim() to ensure no spaces from copy-pasting causing errors
  const env = (import.meta as any).env || {};
  const apiKey = env.VITE_API_KEY ? String(env.VITE_API_KEY).trim() : '';

  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. Please check Vercel Environment Variables or .env file.");
    return null;
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateWeddingAdvice = async (userPrompt: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Konfiguracija nije pronađena. Molimo proverite API ključ.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Updated to latest available fast model or keep 'gemini-1.5-flash'
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
