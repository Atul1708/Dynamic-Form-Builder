import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonAccordion } from '../../helpers/common-accordion/common-accordion';
import { SectionModel, QuestionModel, PageModel } from '../../helpers/interfaces';
import { Question } from '../question/question';
import { CommonServices } from '../../services/commonService';

@Component({
  selector: 'app-section',
  imports: [CommonAccordion, Question],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class Section {
  commonSerive = inject(CommonServices);

  @Input() sections!: SectionModel[];
  @Input() pageIndex!: number;
  @Input() page!: PageModel;
  @Output() sectionsChange = new EventEmitter<SectionModel[]>();

  updateQuestions(id: any, updatedQuestions: QuestionModel[]) {
    this.sections = this.sections.map((x) =>
      x.id == id ? { ...x, questions: updatedQuestions } : x,
    );
    this.sectionsChange.emit(this.sections);
  }

  updateNestedSections(id: any, updatedSections: SectionModel[]) {
    this.sections = this.sections.map((x, i) =>
      x.id == id ? { ...x, sections: updatedSections } : x,
    );
    this.sectionsChange.emit(this.sections);
  }

  updateSectionHeader(id: any, header: string) {
    this.sections = this.sections.map((x) => (x.id == id ? { ...x, text: header } : x));
    this.sectionsChange.emit(this.sections);
  }

  deleteSection(id: any) {
    this.sections = this.sections.filter((x) => x.id !== id);
    this.sectionsChange.emit(this.sections);
  }

  addSectionAfter(sectionId: string, questionId: string) {
    const section = this.sections.find((s) => s.id === sectionId);
    if (!section || !section.questions) return;

    const qIndex = section.questions.findIndex((q) => q.id === questionId);
    if (qIndex === -1) return;
    const newSection = this.commonSerive.createEmptySection();
    section.sections = section.sections ?? [];
    section.sections.splice(qIndex + 1, 0, newSection);
    this.sectionsChange.emit([...this.sections]);
  }
}
