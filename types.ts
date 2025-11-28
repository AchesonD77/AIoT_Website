export interface ParsedTime {
  dates: string[];
  hour_window: [number, number] | null;
  cleaned_query: string;
}

export interface EvidenceChunk {
  id: string;
  date: string;
  hour: number;
  source: string;
  snippet: string;
  metrics?: {
    co2?: number;
    pm25?: number;
    ieq?: number;
  };
  isAnomaly?: boolean;
}

export interface LlmResponse {
  parsed_data: ParsedTime;
  evidence: EvidenceChunk[];
  llm_answer: string; // Markdown formatted string
  processing_time: number;
}

export interface QueryState {
  isLoading: boolean;
  error: string | null;
  data: LlmResponse | null;
}