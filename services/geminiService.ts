import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  let apiKey;
  
  // Safe check for process.env (Node/Webpack)
  if (typeof process !== 'undefined' && process.env) {
      apiKey = process.env.API_KEY || process.env.REACT_APP_API_KEY || process.env.VITE_API_KEY;
  }
  
  // Safe check for import.meta.env (Vite)
  if (!apiKey && (import.meta as any).env) {
      apiKey = (import.meta as any).env.VITE_API_KEY;
  }

  if (!apiKey) {
    console.error("CRITICAL: API_KEY is missing. Please create a .env file based on .env.example");
    return null;
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateWeddingAdvice = async (userPrompt: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Konfiguracija nije pronađena. Molimo proverite API ključ u .env fajlu.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Vi ste SvadbeniPortal AI, stručni konsultant za venčanja u Srbiji. 
        Vaš cilj je da pomognete mladencima sa savetima o organizaciji, običajima, budžetu i odabiru lokacija (Beograd, Novi Sad, Niš, itd.).
        Odgovarajte na srpskom jeziku, ljubazno, kratko i korisno. 
        Ako vas pitaju za konkretne cene, dajte okvirne procene u evrima za tržište Srbije.
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