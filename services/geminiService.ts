import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWeddingAdvice = async (userPrompt: string): Promise<string> => {
  const client = getClient();
  if (!client) return "Izvinite, AI servis trenutno nije dostupan. Proverite API ključ.";

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
