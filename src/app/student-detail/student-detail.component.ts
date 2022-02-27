import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { Student } from '../student';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StudentService} from "../service/student.service";
import { ClassDetail } from "../student";
import {CalendarService} from "../service/calendar.service";
import {CalendarEvent, CalendarEventAction} from "angular-calendar";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {MessageService} from "../service/message.service";

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})
export class StudentDetailComponent implements OnInit {
  showModifyCom: boolean = false;
  showExpansion: boolean = false;
  showCalendar: boolean = false;
  classDetails: ClassDetail[] = [];
  id: number = 0;
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-trash-alt" ></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleDelete(event);
      },
    },
  ];
  event!: CalendarEvent;
  @Input() student?: Student;
  @Input() events!: CalendarEvent[];
  @ViewChild('modalContent1', { static: true }) modalContent1?: TemplateRef<any>;
  @ViewChild('modalContentEvent', { static: true }) modalContentEvent?: TemplateRef<any>;


  constructor(
    private modal: NgbModal,
    private route: ActivatedRoute,
    private studentService: StudentService,
    private calendarService: CalendarService,
    private ms: MessageService,
    private location: Location) {}

  ngOnInit(): void {
    this.getStudent();
    // this.getEvent();
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.getEvent();
    this.ms.add(JSON.stringify(this.events));
  }

  getStudent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);
  }

  getEvent() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.calendarService.getEvent(id)
      .subscribe(event => this.events = this.calendarService.classDetailsToEvents(event).map(
        event => {
          event = {...event, actions: this.actions}
          return event;
        }
      ))
  }

  goBack(): void {
    this.location.back();
  }

  modify(): void {
    this.showExpansion = false;
    this.showCalendar = false;
    this.showModifyCom = !this.showModifyCom;
  }

  expand(): void {
    this.showModifyCom = false;
    this.showCalendar = false;
    this.showExpansion = !this.showExpansion;
  }

  calendar(): void {
    this.showModifyCom = false;
    this.showExpansion = false;
    this.showCalendar = !this.showCalendar;
  }

  save(name: string, grade: string, payment: any, paymentPerClass: any): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const student: Student = {id: id, name: name, grade: grade, payment: payment, paymentPerClass: paymentPerClass};
    this.showModifyCom = false;
    this.events = [];
    this.getEvent(); // FIXME

    this.studentService.updateStudent(student)
      .subscribe();
  }

  delete(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.deleteStudent(id).subscribe();
  }

  handleDeleteStudent(): void {
    this.modal.open(this.modalContent1, { size: 'lg' });
  }

  handleDelete(event: CalendarEvent): void {
    this.event = event;
    this.modal.open(this.modalContentEvent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    eventToDelete.id
    this.events = this.events.filter((event) => event !== eventToDelete);
    if (eventToDelete.classId) {
      this.calendarService.deleteEvent(eventToDelete).subscribe();
    }
  }


}
