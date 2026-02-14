import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { QuestionModel } from '../../helpers/interfaces';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CdkDrag, CdkDropList, MatIconModule],
  templateUrl: './question.html',
  styleUrl: './question.css',
})
export class Question {
  @ViewChildren('questionInput') inputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input({ required: true }) questions!: QuestionModel[];
  @Output() questionsChange = new EventEmitter<QuestionModel[]>();

  dragGroup: QuestionModel[] = [];

  drop(event: CdkDragDrop<QuestionModel[]>) {
    const updated = [...this.questions];
    const selectedItems = this.dragGroup.length ? this.dragGroup : [updated[event.previousIndex]];

    if (selectedItems.length === 1) {
      moveItemInArray(updated, event.previousIndex, event.currentIndex);
    } else {
      const indices = selectedItems.map((item) => updated.indexOf(item)).sort((a, b) => b - a);

      indices.forEach((i) => updated.splice(i, 1));
      updated.splice(event.currentIndex, 0, ...selectedItems);
    }

    this.clearSelection();
    this.dragGroup = [];

    this.questionsChange.emit(updated);
  }

  onDragStarted(q: QuestionModel) {
    if (!q.selected) {
      this.clearSelection();
      q.selected = true;
    }

    this.dragGroup = this.questions.filter((item) => item.selected);
  }

  addFocusOnLast() {
    const lastInput = this.inputs.last;

    if (lastInput) {
      lastInput.nativeElement.focus();
    }
  }

  onEnterClick(index: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.saveQuestion(index);
    this.addQuestion();
    queueMicrotask(() => this.addFocusOnLast());
  }

  addQuestion() {
    this.emitUpdate((q) => [...q, this.createEmptyQuestion()]);
  }

  createEmptyQuestion(): QuestionModel {
    return {
      id: crypto.randomUUID(),
      text: '',
      isEditing: true,
      responseType: 'text',
    };
  }

  editQuestion(index: number) {
    this.emitUpdate((q) => q.map((x, i) => (i === index ? { ...x, isEditing: true } : x)));
  }

  updateQuestion(index: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.emitUpdate((q) => q.map((x, i) => (i === index ? { ...x, text: value } : x)));
  }

  saveQuestion(index: number) {
    this.emitUpdate((q) => q.map((x, i) => (i === index ? { ...x, isEditing: false } : x)));
  }

  changeResponseType(index: number, event: Event) {
    const value = (event.target as HTMLSelectElement).value as QuestionModel['responseType'];
    this.emitUpdate((q) => q.map((x, i) => (i === index ? { ...x, responseType: value } : x)));
  }

  deleteQuestion(index: number) {
    this.emitUpdate((q) => q.filter((_, i) => i !== index));
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
    this.questions.forEach((qs) => {
      qs.selected = false;
    });
  }

  // helper
  private emitUpdate(fn: (q: QuestionModel[]) => QuestionModel[]) {
    this.questionsChange.emit(fn([...this.questions]));
  }
}
