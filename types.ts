export enum Platform {
  YouTube = 'youtube',
  Instagram = 'instagram',
}

export interface YouTubeIdea {
  title: string;
  description: string;
  keywords: string[];
  script: string;
}

export interface InstagramIdea {
  format: string;
  caption: string;
  hashtags: string[];
  script: string;
}

export type ContentIdea = YouTubeIdea | InstagramIdea;
