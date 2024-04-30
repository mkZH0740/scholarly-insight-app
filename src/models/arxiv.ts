export interface IArxivAuthor {
  name: string;

  affiliation?: string;
}

export interface IArxivArticle {
  id: string;
  title: string;
  publishedAt: Date;
  updatedAt: Date;
  summary: string;
  authors: IArxivAuthor[];

  categories: string[];
  primaryCategory?: string;

  abstractLink: string;
  pdfLink: string;

  comment?: string;
  journalReference?: string;

  doi?: string;
  doiLink?: string;
}

export interface IArxivError {
  id: string;
  summary: string;
}
