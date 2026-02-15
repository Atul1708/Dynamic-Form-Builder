import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-common-accordion',
  imports: [CdkAccordionModule, MatIconModule, FormsModule],
  templateUrl: './common-accordion.html',
  styleUrl: './common-accordion.css',
})
export class CommonAccordion implements OnChanges {
  @ViewChild('pageHeader') pageHeader!: ElementRef;

  @Input({ required: true }) index: number | null = null;
  @Input() header: string = '';
  @Input() type: string = 'Page';
  @Input() canDelete: boolean = false;
  @Output() headerChangeEvent = new EventEmitter<string>();
  @Output() deleteEvent = new EventEmitter<void>();

  isEditingHeader = signal<boolean>(false);
  isExpanded = signal<boolean>(true);

  editedHeader: string = '';

  expandedIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['index']?.currentValue || changes['type']) {
      if (changes['index']?.currentValue) {
        this.index = changes['index'].currentValue;
      }
      this.header = `${this.index}-${this.type === 'Page' ? 'Page' : this.type === 'sub_section' ? 'Sub-Section' : 'Section'}`;
    }
  }

  startEditingHeader(event: Event) {
    event.stopPropagation();
    this.isEditingHeader.set(true);
    this.editedHeader = this.header;
    setTimeout(() => {
      const input = this.pageHeader.nativeElement as HTMLInputElement;
      input?.focus();
      input?.select();
    }, 0);
  }

  saveHeaderEdit() {
    const newHeading = this.editedHeader.trim();
    if (newHeading) {
      this.header = newHeading;
      this.headerChangeEvent.emit(this.header);
    }

    this.isEditingHeader.set(false);
  }

  deleteItem(event: Event) {
    event.stopPropagation();
    this.deleteEvent.emit();
  }

  onHeaderKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      this.saveHeaderEdit();
    }
  }

  onInputClick(event: Event) {
    event.stopPropagation();
  }

  toggleExpanded() {
    if (this.isEditingHeader()) return;
    this.isExpanded.update((v) => !v);
  }
}
