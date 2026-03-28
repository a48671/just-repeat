export type SourceSetListItem = {
  id: string;
  title: string;
  description: string;
  phraseCount: number;
  file: string;
};

export type SourceSetList = SourceSetListItem[];

export type SourcePhrase = {
  id: string;
  text: string;
  ru?: string;
  audio: string;
};

export type SourceSetDetails = {
  id: string;
  title: string;
  description: string;
  phrases: SourcePhrase[];
};
