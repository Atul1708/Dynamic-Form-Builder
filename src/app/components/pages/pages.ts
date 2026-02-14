import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonAccordion } from '../../helpers/common-accordion/common-accordion';
import { Question } from '../question/question';
import { QuestionModel } from '../../helpers/interfaces';
import { Section } from '../section/section';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [CommonAccordion, Question, Section],
  templateUrl: './pages.html',
  styleUrls: ['./pages.css'],
})
export class Pages implements OnChanges {
  @Input({ required: true }) page!: any;
  @Input({ required: true }) pageIndex!: number;
  @Output() updatedPage = new EventEmitter<QuestionModel[]>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.page);
  }

  updateQuestions(updated: QuestionModel[]) {
    this.updatedPage.emit(updated);
  }

  updateSections(event: any) {}
}
