export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface ICreateFaq {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}
