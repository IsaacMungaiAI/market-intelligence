const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

export class AIClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "AIClientError";
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${AI_SERVICE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new AIClientError(
      `AI service error (${res.status}): ${body}`,
      res.status
    );
  }

  return res.json();
}

export interface ChatRequest {
  companyId: string;
  question: string;
}

export interface ChatResponse {
  id: string;
  company_id: string;
  question: string;
  answer: string;
  sources: { chunk_index: number; score: number }[];
}

export function chat(body: ChatRequest): Promise<ChatResponse> {
  return request("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface GenerateSummaryRequest {
  companyId: string;
  summaryType: "executive" | "investor" | "beginner" | "sentiment";
}

export interface SummaryItem {
  type: string;
  summary: string;
  created_at: string;
}

export interface SummariesResponse {
  company_id: string;
  summaries: SummaryItem[];
}

export function generateSummary(
  body: GenerateSummaryRequest
): Promise<unknown> {
  return request("/api/v1/summaries/generate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getSummaries(
  companyId: string
): Promise<SummariesResponse> {
  return request(`/api/v1/summaries/${companyId}`);
}

export interface CompareRequest {
  companyIdA: string;
  companyIdB: string;
}

export function compare(body: CompareRequest): Promise<unknown> {
  return request("/api/v1/compare", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface TrainRequest {
  companyId: string;
  target: string;
}

export function trainModel(body: TrainRequest): Promise<unknown> {
  return request("/api/v1/ml/train", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export interface PredictRequest {
  companyId: string;
  target: string;
}

export interface PredictResponse {
  run_id: string;
  model_id: string;
  company_id: string;
  target: string;
  predicted_value: number;
  confidence_interval: { lower: number; upper: number };
}

export function predict(body: PredictRequest): Promise<PredictResponse> {
  return request("/api/v1/ml/predict", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listModels(): Promise<unknown[]> {
  return request("/api/v1/ml/models");
}

export function getModel(modelId: string): Promise<unknown> {
  return request(`/api/v1/ml/models/${modelId}`);
}

export function getPredictionHistory(
  companyId: string
): Promise<unknown[]> {
  return request(`/api/v1/ml/predictions/${companyId}`);
}
