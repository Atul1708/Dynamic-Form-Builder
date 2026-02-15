import { Component, signal, HostListener, inject, effect, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Pages } from '../pages/pages';
import { QuestionModel, SectionModel, PageModel } from '../../helpers/interfaces';
import { CommonServices } from '../../services/commonService';

@Component({
  selector: 'app-common-layout',
  imports: [MatIconModule, Pages, CdkDropListGroup],
  templateUrl: './common-layout.html',
  styleUrl: './common-layout.css',
})
export class CommonLayout implements OnInit {
  private readonly STORAGE_KEY = 'form-builder-pages';

  commonSerive = inject(CommonServices);
  pages = signal<PageModel[]>([]);
  activePageIndex = signal(0);

  constructor() {
    effect(() => {
      const pagesData = this.pages();
      if (pagesData.length > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pagesData));
      }
    });
  }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    const savedData = localStorage.getItem(this.STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        this.pages.set(parsedData);
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  }

  clearLocalStorage() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.pages.set([]);
  }

  addPage(addSection: boolean = false) {
    this.pages.update((pages) => [
      ...pages,
      {
        id: crypto.randomUUID(),
        questions: !addSection ? [this.commonSerive.createEmptyQuestion()] : [],
        sections: addSection ? [this.commonSerive.createEmptySection()] : [],
      },
    ]);
    this.activePageIndex.set(this.pages().length - 1);
  }

  addSection() {
    if (this.pages()?.length) {
      this.pages.update((pages) => {
        const currPageIndex = this.activePageIndex() ?? this.pages().length - 1;
        pages[currPageIndex].sections = [
          ...pages[currPageIndex].sections,
          this.commonSerive.createEmptySection(),
        ];
        return pages;
      });
    } else {
      this.addPage(true);
    }
  }

  deletePage(id: any) {
    this.pages.update((p) => p.filter((x, i) => x.id != id));
    if (this.activePageIndex() >= this.pages().length) {
      this.activePageIndex.set(Math.max(0, this.pages().length - 1));
    }
  }

  addQuestion() {
    if (this.pages()?.length) {
      this.pages.update((pages) => {
        const currPageIndex = this.activePageIndex() ?? this.pages().length - 1;
        pages[currPageIndex].questions = [
          ...(pages[currPageIndex].questions?.length
            ? pages[currPageIndex].questions?.map((x) => ({
                ...x,
                isEditing: false,
                selected: false,
              }))
            : []),
          this.commonSerive.createEmptyQuestion(),
        ];

        return pages;
      });
    } else {
      this.addPage();
    }
  }

  getUpdatedPage(updatedQuestions: QuestionModel[], id: any) {
    this.pages.update((pages) =>
      pages.map((page) => (page.id == id ? { ...page, questions: updatedQuestions } : page)),
    );
  }

  getUpdatedSections(updatedSections: SectionModel[], id: any) {
    this.pages.update((pages) =>
      pages.map((page) => (page.id == id ? { ...page, sections: updatedSections } : page)),
    );
  }
}
