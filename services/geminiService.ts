import { GoogleGenAI, Type } from "@google/genai";
import { VerificationResult, VerificationStatus, EducationalArticle, DrugDetails, CounterfeitInfo, VerificationMethod } from '../types';

// API Key for openFDA
const FDA_API_KEY = 'HAYCXdq4d44Ez1cKxFcyWo6mVnG2khguvO6zNlhA';
const FDA_API_URL = 'https://api.fda.gov/drug/label.json';

// Ensure the Gemini API key is available from environment variables
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set for Gemini.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const commonNigerianDrugs = [
  'paracetamol', 'ibuprofen', 'diclofenac', 'aspirin', 'metronidazole', 'flagyl', 'ampiclox', 
  'amoxicillin', 'ciprofloxacin', 'azithromycin', 'erythromycin', 'cefuroxime', 'ceftriaxone', 
  'tetracycline', 'doxycycline', 'cotrimoxazole', 'chloroquine', 'artemether-lumefantrine',
  'artesunate', 'sulfadoxine-pyrimethamine', 'quinine', 'amlodipine', 'lisinopril', 
  'hydrochlorothiazide', 'losartan', 'atenolol', 'nifedipine', 'methyldopa', 'dexamethasone',
  'prednisolone', 'glibenclamide', 'metformin', 'insulin', 'omeprazole', 'ranitidine',
  'albendazole', 'mebendazole', 'ivermectin', 'folic acid', 'ferrous sulfate', 'vitamin c',
  'multivitamins', 'tramadol', 'codeine', 'sildenafil', 'postinor', 'salbutamol',
  'aminophylline', 'chlorpheniramine', 'alabukun'
];

const drugDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        drugName: { type: Type.STRING },
        genericName: { type: Type.STRING },
        manufacturer: { type: Type.STRING },
        nafdacNumber: { type: Type.STRING, description: "A plausible NAFDAC registration number. For Alabukun, use 04-0489." },
        manufacturingDate: { type: Type.STRING },
        expiryDate: { type: Type.STRING },
        uses: { type: Type.ARRAY, items: { type: Type.STRING } },
        dosage: { type: Type.STRING },
        sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
        storage: { type: Type.STRING }
    },
    required: ["drugName", "genericName", "manufacturer", "nafdacNumber", "manufacturingDate", "expiryDate", "uses", "dosage", "sideEffects", "storage"]
};

const generalKnowledgeDrugSchema = {
    type: Type.OBJECT,
    properties: {
        drugName: { type: Type.STRING },
        genericName: { type: Type.STRING },
        manufacturer: { type: Type.STRING },
        uses: { type: Type.ARRAY, items: { type: Type.STRING } },
        dosage: { type: Type.STRING },
        sideEffects: { type: Type.ARRAY, items: { type: Type.STRING } },
        storage: { type: Type.STRING }
    },
     required: ["drugName", "genericName", "manufacturer", "uses", "dosage", "sideEffects", "storage"]
}


/**
 * Tier 1 & 3: Uses Gemini to verify drugs either as a NAFDAC simulation or general knowledge lookup.
 */
async function verifyWithGemini(input: string, isNigerianDrug: boolean): Promise<DrugDetails | null> {
    const prompt = isNigerianDrug
    ? `You are a simulated NAFDAC drug database expert for a Nigerian university's app. The user is verifying a common Nigerian drug: "${input}". Based on your knowledge, including information about drugs commonly found in Nigeria, provide a detailed verification response as a JSON object. For "Alabukun", you MUST use NAFDAC number 04-0489. For other drugs, generate plausible but fictional NAFDAC numbers and batch details. The drug should be presented as authentic.`
    : `A user is searching for a drug named "${input}". It was not found in the US FDA database. Search your general knowledge, including information from medical sources like ajtmh.org, pmc.ncbi.nlm.nih.gov, and regulatory bodies worldwide. If you can identify this as a legitimate medication, provide its details in a JSON object. If you cannot find any information, return an empty JSON object {}.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: isNigerianDrug ? drugDetailsSchema : generalKnowledgeDrugSchema,
            },
        });
        
        const textResponse = response.text.trim();
        if (textResponse && textResponse !== "{}") {
            const data = JSON.parse(textResponse);
            return {
                ...data,
                manufacturingDate: data.manufacturingDate || 'Not available from this source',
                expiryDate: data.expiryDate || 'Not available from this source',
                dataSource: isNigerianDrug ? 'Simulated NAFDAC Database' : 'AI Knowledge Base'
            };
        }
        return null;
    } catch (error) {
        console.error(`Gemini verification for "${input}" failed:`, error);
        return null;
    }
}


/**
 * Main verification function with a 3-tier fallback system.
 */
export const verifyDrug = async (input: string, method: VerificationMethod): Promise<VerificationResult> => {
    const normalizedInput = input.trim().toLowerCase();

    // Tier 1: Check if it's a known common Nigerian drug
    if (method === 'name' && commonNigerianDrugs.includes(normalizedInput)) {
        const geminiResult = await verifyWithGemini(input, true);
        if (geminiResult) {
            return { status: VerificationStatus.AUTHENTIC, data: geminiResult };
        }
    }

    // Tier 2: Query openFDA
    const searchField = method === 'code' ? 'openfda.ndc.exact' : `openfda.brand_name.exact`;
    const url = `${FDA_API_URL}?api_key=${FDA_API_KEY}&search=${searchField}:"${encodeURIComponent(input)}"&limit=1`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                const openfda = result.openfda || {};
                const drugDetails: DrugDetails = {
                    drugName: openfda.brand_name?.[0] || 'Not available',
                    genericName: openfda.generic_name?.[0] || 'Not available',
                    manufacturer: openfda.manufacturer_name?.[0] || 'Not available',
                    manufacturingDate: 'Batch-specific, not available in this database',
                    expiryDate: 'Batch-specific, not available in this database',
                    uses: result.indications_and_usage || ['Not available'],
                    dosage: result.dosage_and_administration?.[0] || 'Not available',
                    sideEffects: result.adverse_reactions?.[0] || 'Not available',
                    storage: result.storage_and_handling?.[0] || 'Not available',
                    dataSource: 'U.S. FDA Database'
                };
                return { status: VerificationStatus.AUTHENTIC, data: drugDetails };
            }
        }
    } catch (error) {
        console.error("openFDA API call failed:", error);
        // Don't return error yet, proceed to tier 3
    }
    
    // Tier 3: If FDA fails or returns no results, try general AI knowledge (for names only)
    if (method === 'name') {
        const geminiResult = await verifyWithGemini(input, false);
        if (geminiResult) {
            return { status: VerificationStatus.AUTHENTIC, data: geminiResult };
        }
    }

    // If all tiers fail, return "not found"
    return {
        status: VerificationStatus.COUNTERFEIT,
        data: {
            message: `The drug "${input}" could not be verified in our available data sources.`,
            nextSteps: [
                "Double-check the spelling and format.",
                "If you have the product, compare the name/code with the packaging.",
                "Consult a pharmacist or healthcare provider with your concerns.",
                "Do not use any medication you cannot verify.",
            ]
        }
    };
};


// --- Educational Content Generation (remains the same) ---
const educationalContentSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "A compelling title for an article on drug safety." },
            summary: { type: Type.STRING, description: "A short, one or two sentence summary of the article." }
        },
        required: ["title", "summary"]
    }
};

export const getEducationalContent = async (): Promise<EducationalArticle[]> => {
    try {
        const prompt = "Generate 3 short educational article summaries about drug safety. The topics should be: 1. The Dangers of Counterfeit Medication. 2. How to Properly Store Your Medicines. 3. Understanding and Reporting Drug Side Effects. Provide only the JSON array.";

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: educationalContentSchema,
            },
        });
        
        return JSON.parse(response.text) as EducationalArticle[];
    } catch (error) {
        console.error("Failed to fetch educational content:", error);
        return [
            { title: "The Dangers of Counterfeit Medication", summary: "Learn how to identify and avoid fake drugs that can pose serious health risks." },
            { title: "How to Properly Store Your Medicines", summary: "Ensure your medications remain effective and safe by following correct storage guidelines." },
            { title: "Understanding and Reporting Drug Side Effects", summary: "Know the common side effects and how to report adverse reactions to protect yourself and others." }
        ];
    }
};