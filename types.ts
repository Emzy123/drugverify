
export enum VerificationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  AUTHENTIC = 'AUTHENTIC',
  COUNTERFEIT = 'COUNTERFEIT',
  ERROR = 'ERROR',
}

export interface DrugDetails {
  drugName: string;
  genericName: string;
  manufacturer: string;
  manufacturingDate: string;
  expiryDate: string;
  uses: string[];
  dosage: string;
  sideEffects: string[];
  storage: string;
  nafdacNumber?: string; // For Nigerian drugs
  dataSource?: string; // To indicate the source of data (e.g., FDA, NAFDAC simulation)
}

export interface CounterfeitInfo {
  message: string;
  nextSteps: string[];
}

export type VerificationResult =
  | { status: VerificationStatus.IDLE }
  | { status: VerificationStatus.LOADING }
  | { status: VerificationStatus.AUTHENTIC; data: DrugDetails }
  | { status: VerificationStatus.COUNTERFEIT; data: CounterfeitInfo }
  | { status: VerificationStatus.ERROR; message: string };

export type VerificationMethod = 'code' | 'name';

export interface EducationalArticle {
  title: string;
  summary: string;
}

export interface HistoryItem {
  term: string;
  method: VerificationMethod;
}
