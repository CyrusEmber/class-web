import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',

})
export class CalendarComponent {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  clickedDate?: Date;

  clickedColumn?: number;

}
