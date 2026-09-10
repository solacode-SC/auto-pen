export type WritingType =
  | "email"
  | "message"
  | "comment"
  | "post"
  | "tweet"
  | "professional"
  | "casual";

export const VALID_WRITING_TYPES: WritingType[] = [
  "email",
  "message",
  "comment",
  "post",
  "tweet",
  "professional",
  "casual",
];

export interface WritingTypeInfo {
  value: WritingType;
  label: string;
  hint: string;
}

export const WRITING_TYPES: WritingTypeInfo[] = [
  { value: "email", label: "Email", hint: "Clear and professional" },
  { value: "message", label: "Message", hint: "Natural and conversational" },
  { value: "comment", label: "Comment", hint: "Clear and authentic" },
  { value: "post", label: "Post", hint: "Engaging and readable" },
  { value: "tweet", label: "Tweet", hint: "Short and punchy" },
  { value: "professional", label: "Professional", hint: "Polished and precise" },
  { value: "casual", label: "Casual", hint: "Relaxed and natural" },
];

export const DEFAULT_WRITING_TYPE: WritingType = "message";

export const MAX_INPUT_LENGTH = 20000;

export interface ImproveRequest {
  text: string;
  type: WritingType;
  apiKey?: string;
}

export interface ImproveResponse {
  success: true;
  text: string;
}

export interface ImproveErrorResponse {
  success: false;
  error: string;
}
