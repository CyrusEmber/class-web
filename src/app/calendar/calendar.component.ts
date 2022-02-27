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
import { StudentService } from "../service/student.service";
import { MessageService } from "../service/message.service";
import { CalendarService } from "../service/calendar.service";
import {ClassDetail, Student} from "../student";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {LoginService} from "../service/login.service";

// import RRule from 'rrule';

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
  @ViewChild('modalContent1', { static: true }) modalContent1?: TemplateRef<any>;

  CalendarView = CalendarView;

  modalData?: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
/*    {
      label: '<i class="fas fa-fw fa-p' +
        'encil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },*/
    {
      label: '<i class="fas fa-fw fa-trash-alt" ></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleDelete(event);
      },
    },
  ];

  refresh = new Subject<void>();

  @Input()
  events: CalendarEvent[] = [];
  @Input()
  name: string ="";
  @Input()
  id!: number;

  event!: CalendarEvent;

  activeDayIsOpen: boolean = true;

  // search
  students$!: Observable<Student[]>;
  private searchTerms = new Subject<string>();

  constructor(private modal: NgbModal,
              private messageService: MessageService,
              private studentService: StudentService,
              private calendarService: CalendarService,
              private ls: LoginService,
              private route: ActivatedRoute
              ) {}

  ngOnInit(): void {
    if (this.name=="") {
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
    if(this.authenticated())
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
          modified: true,
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
    if(event.finished == undefined) event.finished = false;

    this.modalData = { event, action };

    this.messageService.add("event changed")
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  handleDelete(event: CalendarEvent): void {
    this.event = event;
    this.modal.open(this.modalContent1, { size: 'lg' });
  }

  addEvent(): void {
    let color1;
    // set event color the same as the first event when there is at least one event for a student
    if (this.name == "") {
      color1 = colors.red.primary;
    } else {
      if (this.events.length > 0 && this.events[0].color!.primary != undefined) {
        color1 = this.events[0].color!.primary;
      }
      else {
        color1 = colors.red.primary;
      }
    }


    this.events = [
      ...this.events,
      {
        id: this.name,
        title: 'New event',
        start: startOfDay(new Date()),
        end: addHours(startOfDay(new Date()), 2),
        color: {
          primary: color1,
          secondary: color1
        },
        actions: this.actions,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
        finished: false,
        modified: true,
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
      if (this.events[i].modified) {
        this.events[i].modified = false;
        let classDetail = this.calendarService.eventToClassDetail(this.events[i]);
        this.calendarService.updateEvent(classDetail).subscribe(responseData => {
          if (Number(responseData) != 0) {
            this.events[i].classId = Number(responseData);
          }
        });
      }
    }
    // this.events = [];
    // if (this.name=="") { //FIXME and preload, whenever I save events, should reload the router
    //   this.getEvents();
    //
    //   this.messageService.add(String(this.events.length));
    //
    // } else {
    //   this.studentService.getEvent(this.id)
    //     .subscribe(event => this.events = this.calendarService.classDetailsToEvents(event));
    // }


  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  // search
  search(term: string): void {
    this.searchTerms.next(term);
  }

  deleteSearch(): void {
    this.searchTerms.next('');
  } // TODO name bind

  disableInput(): boolean {
    return this.name != "";
  }

  getEvents(): void { // TODO why it is lagging?
    // this.calendarService.getEvents()
    //   .subscribe(events => this.events = this.calendarService.classDetailsToEvents(events))
    this.route.data
      .subscribe(data => {
        const classDetails: ClassDetail[] = data['events'];
        this.events = this.calendarService.classDetailsToEvents(classDetails).map(event => {
          event = {...event, actions: this.actions}
          return event;
        });
      });
  }

  modify(event: CalendarEvent): void {
    // I made sure that all those attributes are defined by giving default empty string, recursive is by default false
    // recursive passed test
    // FIXME bug: repeat class id (fixed by adding subscribe)
    let classDetail = this.calendarService.eventToClassDetail(event);
    event.modified = false;
    this.calendarService.updateEvent(classDetail).subscribe(responseData => {
      if (Number(responseData) != 0 && !event.classId) {
        event.classId = Number(responseData);
      }
    });
  }

  delete(event: CalendarEvent) {
    if (event.classId) {
      this.calendarService.deleteEvent(event).subscribe();
    }
  }

  authenticated(): boolean {
    return this.ls.authenticated;
  }
}
