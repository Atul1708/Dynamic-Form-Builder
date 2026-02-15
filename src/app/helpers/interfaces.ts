export type ResponseType = 'text' | 'checkbox' | 'radio';

export interface QuestionModel {
  id: string;
  text: string;
  isEditing: boolean;
  responseType: ResponseType;
  selected?: boolean;
}

export interface SectionModel {
  id: string;
  text: string;
  questions: QuestionModel[];
  sections?: SectionModel[];
}

export interface PageModel {
  id: string;
  questions: QuestionModel[];
  sections: SectionModel[];
}
