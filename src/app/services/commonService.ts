import { Injectable } from '@angular/core';
import { QuestionModel, SectionModel } from '../helpers/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CommonServices {
  createEmptyQuestion(): QuestionModel {
    return {
      id: crypto.randomUUID(),
      text: '',
      isEditing: true,
      responseType: 'text',
      selected: false,
    };
  }

  createEmptySection(): SectionModel {
    return {
      id: crypto.randomUUID(),
      text: '',
      questions: [this.createEmptyQuestion()],
      sections: [],
    };
  }
}
