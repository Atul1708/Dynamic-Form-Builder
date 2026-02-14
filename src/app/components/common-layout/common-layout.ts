import { Component, OnInit, Output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Pages } from '../pages/pages';
import { QuestionModel, SectionModel } from '../../helpers/interfaces';

@Component({
  selector: 'app-common-layout',
  imports: [MatIconModule, Pages],
  templateUrl: './common-layout.html',
  styleUrl: './common-layout.css',
})
export class CommonLayout implements OnInit {
  pages = signal<any[]>([]);
  activePageIndex = signal(0);

  ngOnInit(): void {}

  addPage(addSection: boolean = false) {
    this.pages.update((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        questions: !addSection ? [this.createEmptyQuestion()] : [],
        sections: addSection ? [this.createEmptySection()] : [],
      },
    ]);
  }

  addSection() {
    if (this.pages()?.length) {
      this.pages.update((pages) => {
        pages[this.activePageIndex()].sections.push(this.createEmptySection());
        return [...pages];
      });
    } else {
      this.addPage(true);
    }
  }

  addQuestion() {
    if (this.pages()?.length) {
      this.pages.update((pages) => {
        pages[this.activePageIndex()].questions.push(this.createEmptyQuestion());
        return [...pages];
      });
    } else {
      this.addPage();
    }
  }

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
      isEditing: true,
      questions: [this.createEmptyQuestion()],
    };
  }

  getUpdatedPage(updatedQuestions: QuestionModel[]) {
    this.pages.update((pages) => {
      const index = this.activePageIndex();
      pages[index] = {
        ...pages[index],
        questions: updatedQuestions,
      };
      return [...pages];
    });
  }
}
