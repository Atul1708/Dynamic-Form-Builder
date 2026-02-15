import {
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  OnInit,
  OnDestroy,
  Input,
  Output,
  QueryList,
  ViewChildren,
  inject,
  signal,
  HostListener,
  ViewChild,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { PageModel, QuestionModel } from '../../helpers/interfaces';
import { DragDropService } from '../../services/DragDropServices';
import { CommonServices } from '../../services/commonService';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CdkDrag, CdkDropList, MatIconModule],
  templateUrl: './question.html',
  styleUrl: './question.css',
})
export class Question implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('questionInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChild('cdkDropdown', { static: true }) cdkDropdownElement!: ElementRef<HTMLElement>;
  @Input({ required: true }) questions!: QuestionModel[];
  @Input() pageIndex!: number;
  @Input() page!: PageModel;
  @Output() addSectionAfterQuestion = new EventEmitter<string>();
  @Output() addSectionPage = new EventEmitter<string>();
  @Output() questionsChange = new EventEmitter<QuestionModel[]>();

  currQIndex: number | null = null;
  hoveredQuestionIndex: number | null = null;
  dragGroup: QuestionModel[] = [];
  shouldFocusLast = false;
  dropListId = signal<string>('');
  dragDropService = inject(DragDropService);
  commonSerive = inject(CommonServices);
  clipboard = inject(Clipboard);

  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (document.activeElement !== this.cdkDropdownElement.nativeElement) {
      return;
    }

    const tag = (event.target as HTMLElement)?.tagName;
    const isTyping = tag == 'input' || tag == 'textarea';

    if ((event.ctrlKey || event.metaKey) && event.key == 'c' && !isTyping) {
      this.copyQuestions();
      event.preventDefault();
    }

    if ((event.ctrlKey || event.metaKey) && event.key == 'v' && !isTyping) {
      this.pasteQuestions();
      event.preventDefault();
    }
  }

  ngOnInit() {
    // Create unique drop list ID - use pageIndex and a random component ID
    const componentId = crypto.randomUUID().substring(0, 8);
    const listId =
      this.pageIndex !== undefined
        ? `question-list-${this.pageIndex}-${componentId}`
        : `question-list-${componentId}`;
    this.dropListId.set(listId);
    this.dragDropService.registerQuestionList(listId);
  }

  ngOnDestroy() {
    this.dragDropService.unregisterQuestionList(this.dropListId());
  }

  ngAfterViewInit() {
    this.inputs.changes.subscribe(() => {
      if (this.shouldFocusLast) {
        this.addFocusOnLast();
        this.shouldFocusLast = false;
      }
    });
  }

  copyQuestions() {
    const selectedQuestions = this.questions?.length
      ? this.questions.filter((q) => q.selected)
      : [];

    if (!selectedQuestions.length) return;
    const copiedQuestions = selectedQuestions.map(({ selected, isEditing, ...x }) => x);
    this.clipboard.copy(JSON.stringify(copiedQuestions));
  }

  pasteQuestions() {
    navigator.clipboard.readText().then((text) => {
      try {
        const copiedQuestion = JSON.parse(text);
        const pastedQuestions = copiedQuestion.map((q: any) => ({
          ...q,
          id: crypto.randomUUID(),
          selected: false,
          isEditing: false,
        }));

        const lastSelectedIndex = Math.max(...this.questions.map((q, i) => (q.selected ? i : -1)));
        if (lastSelectedIndex >= 0) {
          this.questions.splice(lastSelectedIndex + 1, 0, ...pastedQuestions);
        } else {
          this.questions.push(...pastedQuestions);
        }
        this.emitUpdate();
        this.clearSelection();
      } catch (error) {
        console.error(error);
      }
    });
  }

  drop(event: CdkDragDrop<any, any, QuestionModel>) {
    // Delegate to service for "proper" CDK handling
    this.dragDropService.drop(event);

    // Notify parents of changes
    // Since the service mutates the arrays in place (which are the same references as 'this.questions'),
    // we just need to emit the updated array to trigger any parent side-effects (like signal updates in CommonLayout).
    this.questionsChange.emit(this.questions);
  }

  onDragStarted(q: QuestionModel) {
    if (!q.selected) {
      this.clearSelection();
      q.selected = true;
    }

    this.dragGroup = this.questions.filter((item) => item.selected);
  }

  addFocusOnLast() {
    if (this.currQIndex !== null) {
      const lastInput = this.inputs.get(this.currQIndex);
      lastInput?.nativeElement.focus();
      this.currQIndex = null;
    }
  }

  onEnterClick(id: any, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.addQuestion(id);
    this.shouldFocusLast = true;
  }

  addQuestion(id: any) {
    const i = this.questions.findIndex((q) => q.id == id);
    if (i > -1) {
      this.questions.splice(i + 1, 0, this.commonSerive.createEmptyQuestion());
      this.currQIndex = i + 1;
    } else {
      this.questions.push(this.commonSerive.createEmptyQuestion());
      this.currQIndex = this.questions.length - 1;
    }
    this.emitUpdate();
    this.questions.forEach((q) => (q.isEditing = false));
    this.questions[this.questions?.length - 1].isEditing = true;
  }

  emitAddSection(questionId: string) {
    if (this.page?.sections?.length) {
      this.addSectionAfterQuestion.emit(questionId);
    } else {
      this.addSectionPage.emit();
    }
  }

  editQuestion(id: any) {
    this.questions = this.questions.map((x) => (x.id == id ? { ...x, isEditing: true } : x));
    this.emitUpdate();
  }

  updateQuestion(id: any, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.questions = this.questions.map((x) => (x.id == id ? { ...x, text: value } : x));
    this.emitUpdate();
  }

  saveQuestion(id: any) {
    this.questions = this.questions.map((x) => (x.id == id ? { ...x, isEditing: false } : x));
    this.emitUpdate();
  }

  changeResponseType(id: any, event: Event) {
    const value = (event.target as HTMLSelectElement).value as QuestionModel['responseType'];
    this.questions = this.questions.map((x) => (x.id == id ? { ...x, responseType: value } : x));
    this.emitUpdate();
  }

  deleteQuestion(id: any) {
    this.questions = this.questions.filter((x) => x.id !== id);
    this.emitUpdate();
  }

  toggleSelection(q: QuestionModel, event: MouseEvent) {
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      q.selected = !q.selected;
    } else {
      this.clearSelection();
      q.selected = true;
    }
  }

  clearSelection() {
    this.questions.forEach((qs) => (qs.selected = false));
  }

  emitUpdate() {
    this.questionsChange.emit([...this.questions]);
  }
}
