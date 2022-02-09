import { Component, OnInit } from '@angular/core';
import { StudentService } from "../student.service";
import { MessageService } from "../message.service";
import { Student, ClassDetail } from "../student";

//TODO add a event edit part
@Component({
  selector: 'app-student-modify',
  templateUrl: './student-modify.component.html',
  styleUrls: ['../login/login.component.css']
})
export class StudentModifyComponent implements OnInit {

  constructor(private studentService:StudentService,
              private messageService: MessageService) { }

  ngOnInit(): void {
  }

  add(name: string, grade: string, payment: any, paymentPerClass: any): void {
    const classDetails: ClassDetail[] = [{name: name,  _end: '0'}]
    name = name.trim();
    grade = grade.trim();
    const student: Student = {name: name, grade: grade, payment: payment, paymentPerClass: paymentPerClass, classDetail: classDetails};
    if (!name) {
      this.messageService.add(`You must input name`);
      return;
    }
    if( (payment && isNaN(payment)) || (paymentPerClass && isNaN(paymentPerClass))) {
      this.messageService.add('payment must be number')
      return;
    }
    this.studentService.addStudent1(student).subscribe();
  }

}
