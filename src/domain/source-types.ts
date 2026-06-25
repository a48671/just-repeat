export type SourceSetListItem = {
  id: string;
  title: string;
  titleRu?: string;
  titleEs?: string;
  titleDe?: string;
  description: string;
  descriptionRu?: string;
  descriptionEs?: string;
  descriptionDe?: string;
  phraseCount: number;
  file: string;
};

export type SourceSetList = SourceSetListItem[];

export type SourcePhrase = {
  id: string;
  text: string;
  ru?: string;
  es?: string;
  de?: string;
  person?: 'female' | 'male';
  audio: string;
  image?: string;
};

export type SourceSetDetails = {
  id: string;
  title: string;
  titleRu?: string;
  titleEs?: string;
  titleDe?: string;
  description: string;
  descriptionRu?: string;
  descriptionEs?: string;
  descriptionDe?: string;
  phrases: SourcePhrase[];
};
