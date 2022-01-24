import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
  // type LogLevelStrings = keyof typeof LogLevel;
  @Input() view: CalendarView = CalendarView.Month ;

  @Input() viewDate: Date = new Date();

  @Input() locale: string = 'en';

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  CalendarView = CalendarView;

}
