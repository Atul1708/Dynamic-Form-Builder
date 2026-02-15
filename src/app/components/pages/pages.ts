import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonAccordion } from '../../helpers/common-accordion/common-accordion';
import { Question } from '../question/question';
import { QuestionModel, SectionModel, PageModel } from '../../helpers/interfaces';
import { Section } from '../section/section';
import { CommonServices } from '../../services/commonService';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonAccordion, Question, Section],
  templateUrl: './pages.html',
  styleUrls: ['./pages.css'],
})
export class Pages {
  @Input({ required: true }) page!: PageModel;
  @Input({ required: true }) pageIndex!: number;
  @Input({ required: true }) pageArrayIndex!: number;
  @Output() updatedQuestions = new EventEmitter<QuestionModel[]>();
  @Output() updatedSections = new EventEmitter<SectionModel[]>();
  @Output() deletePage = new EventEmitter<void>();

  commonSerive = inject(CommonServices);

  updateQuestions(updated: QuestionModel[]) {
    this.updatedQuestions.emit(updated);
  }

  updateSections(updated: SectionModel[]) {
    this.updatedSections.emit(updated);
  }

  addSectionPage() {
    this.page.sections.push(this.commonSerive.createEmptySection());
  }
}
