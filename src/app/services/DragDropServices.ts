import { Injectable, signal } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  questionListIds = signal<string[]>([]);
  sectionListIds = signal<string[]>([]);

  registerQuestionList(id: string) {
    if (!this.questionListIds().includes(id)) {
      this.questionListIds.update((ids) => [...ids, id]);
    }
  }

  unregisterQuestionList(id: string) {
    this.questionListIds.update((ids) => ids.filter((i) => i !== id));
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const newItem = { ...item, id: crypto.randomUUID() };
      event.previousContainer.data.splice(event.previousIndex, 1);
      event.container.data.splice(event.currentIndex, 0, newItem);
    }
  }
}
