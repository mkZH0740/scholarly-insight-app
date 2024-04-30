export const queryParams = {
  title: "ti",
  author: "au",
  abstract: "abs",
  comment: "co",
  "journal reference": "jr",
  "subject category": "cat",
  "report number": "rn",
} as const;

export const queryParamOperator = ["AND", "OR", "ANDNOT", "NONE"] as const;

export interface IQueryParam {
  key: string;
  value: string;
  operator: string;
}
