
export type TabName = 'broll' | 'poses' | 'script' | 'voiceover' | 'video' | 'branding' | 'logo' | 'mentor';

export interface ImageData {
  id: string;
  base64: string;
  mimeType: string;
}

export interface ScriptScene {
  visual: string;
  audio: string;
}

export interface ScriptData {
  title: string;
  scenes: ScriptScene[];
}

export interface BrandingData {
  slogans: string[];
  colors: { hex: string; name: string; usage: string }[];
  visualStyle: string;
  contentPillars: { title: string; idea: string }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Voice {
  name: string;
  gender: 'Pria' | 'Wanita';
  id: string;
}
