export enum Sources {
  Ollama = '/chat',
  Mycroft = '/tts',
}

export interface IOllamaChatResponse {
  model: string;
  created_at: Date;
  response: string;
  done: boolean;
  context: number[];
  total_duration: number;
  load_duration: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

export interface IChatRecord {
  query: string;
  response: string;
}
