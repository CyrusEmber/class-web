import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef, Input,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {Observable, Subject} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { StudentService } from "../student.service";
import { MessageService } from "../message.service";
import { CalendarService } from "../calendar.service";
import {ClassDetail, Student} from "../student";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'calendar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css',],
})
export class CalendarComponent {
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  clickedDate?: Date;

  clickedColumn?: number;

  @ViewChild('modalContent', { static: true }) modalContent?: TemplateRef<any>;

  CalendarView = CalendarView;

  modalData?: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-p' +
        'encil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  @Input()
  events: CalendarEvent[] = [];
/*    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },*/

  activeDayIsOpen: boolean = true;

  // search
  students$!: Observable<Student[]>;
  private searchTerms = new Subject<string>();

  constructor(private modal: NgbModal,
              private messageService: MessageService,
              private studentService: StudentService,
              private calendarService: CalendarService
              ) {}

  ngOnInit(): void {
    this.getEvents();
    this.students$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.studentService.searchStudents(term)),
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    // this.handleEvent('Dropped or resized', event); TODO debug
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if(event == undefined) event = {title: '', start: new Date()}
    if(event.id == undefined) event.id = "1";
    if(event.title == undefined) event.title = "";
    if(event.description == undefined) event.description = "";
    if(event.homework == undefined) event.homework = "";
    if(event.recursive == undefined) event.recursive = false;

    this.modalData = { event, action };

    this.messageService.add("event changed")
      this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red.primary,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    eventToDelete.id
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  saveEvent() {
    for (let i = 0; i < this.events.length; i++) {
      let classDetail = this.calendarService.eventToClassDetail(this.events[i]);
      // this.messageService.add(JSON.stringify(classDetail))
      // this.messageService.add(JSON.stringify(this.events[i]))
      this.studentService.updateEvent(classDetail).subscribe(event => this.events[i] = event);
    }
    this.events = [];
    this.getEvents();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  // search
  search(term: string): void {
    this.searchTerms.next(term);
  }

  deleteSearch():void {
    this.searchTerms.next('');
  } // TODO name bind

  getEvents(): void { // TODO why it is lagging?
    this.calendarService.getEvents()
      .subscribe(events => this.events = this.calendarService.classDetailsToEvents(events))
  }

  modify(event: CalendarEvent): void {
    // I made sure that all those attributes are defined by giving default empty string, recursive is by default false

    // recursive passed test
    let classDetail = this.calendarService.eventToClassDetail(event);

    this.calendarService.updateEvent(classDetail).subscribe();
  }

  delete(event: CalendarEvent) {
    if (event.classId) {
      this.studentService.deleteEvent(event).subscribe();
    }
  }
}
