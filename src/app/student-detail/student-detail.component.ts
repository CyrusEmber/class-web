import {Component, Input, OnInit} from '@angular/core';
import { Student } from '../student';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { StudentService} from "../student.service";
import { ClassDetail } from "../student";
import {CalendarService} from "../calendar.service";
import {CalendarEvent} from "angular-calendar";

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

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private calendarService: CalendarService,
    private location: Location) {}

  ngOnInit(): void {
    this.getStudent();
    this.getEvent();
  }

  getStudent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getStudent(id)
      .subscribe(student => this.student = student);
  }

  getEvent() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.getEvent(id)
      .subscribe(event => this.event = this.calendarService.classDetailsToEvents(event))
  }

  goBack(): void {
    this.location.back();
  }

  modify(): void {
    this.showModifyCom = !this.showModifyCom;
  }

  expand(): void {
    this.showExpansion = !this.showExpansion;
  }

  calendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  save(name: string, grade: string, payment: any, paymentPerClass: any, date: string): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const student: Student = {id: id, name: name, grade: grade, payment: payment, paymentPerClass: paymentPerClass, date: date};
    this.showModifyCom = false;
    this.studentService.updateStudent(student)
      .subscribe(student => this.student = student);
  }

  delete(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.studentService.deleteStudent(id).subscribe();
  } //TODO confirm window popup

  @Input() student?: Student;
  @Input() event!: CalendarEvent[];
}
