export enum Sources {
  Ollama = '/chat',
  Mycroft = '/tts',
}

export interface ISession {
  id: string;
  name: string;
  model: string;
  speak?: boolean;
  history: IChatRecord[];
}

export interface ISessions {
  [index: string]: ISession;
}

export interface IOllamaChatRequest {
  model: string;
  prompt: string;
  format?: string;
  options?: object;
  context?: number[];
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string | number;
}

export interface IOllamaChatResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface IOllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: null;
    parameter_size: string;
    quantization_level: string;
  };
}

export interface IOllamaPullRequest {
  name: string;
  stream?: boolean;
}

export interface IOllamaPullResponse {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}

export interface IChatRecord {
  query: string;
  answer: IOllamaChatResponse;
}
