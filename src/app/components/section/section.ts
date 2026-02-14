import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonAccordion } from '../../helpers/common-accordion/common-accordion';
import { SectionModel } from '../../helpers/interfaces';
import { Question } from '../question/question';

@Component({
  selector: 'app-section',
  imports: [CommonAccordion, Question],
  templateUrl: './section.html',
  styleUrl: './section.css',
})
export class Section implements OnChanges {
  @Input() sections!: any[];
  @Output() sectionChange = new EventEmitter<SectionModel>();

  ngOnChanges(changes: SimpleChanges): void {
    console.log('sec', this.sections);
  }

  onSectionChange() {
    this.sectionChange.emit();
  }
}
