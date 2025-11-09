
export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export enum EmailTone {
  Formal = "Formal",
  Friendly = "Friendly",
  Direct = "Direct",
  Casual = "Casual",
  Professional = "Professional",
}
