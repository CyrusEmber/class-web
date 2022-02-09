import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import {ClassDetail, Student} from './student';
import { MessageService } from "./message.service";
import { format } from "date-fns";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  // TODO error handler
  getUrl = 'http://127.0.0.1:8080/students/events';
  addUrl = 'http://127.0.0.1:8080/addJson';
  updateEventUrl = 'http://127.0.0.1:8080/event';
  getSelectedUrl = 'http://127.0.0.1:8080/studentsSelect';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  constructor(private messageService: MessageService,
              private http: HttpClient) { }

  private log(message: string) {
    let now: Date = new Date();
    this.messageService.add(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      + ` CalendarService: ${message}`);
  }

  getToday() {
    let today = new Date();
    return today.getDate();
  }

  eventToClassDetail(event: CalendarEvent) : ClassDetail {
    let classDetail: ClassDetail = {name: "default name"}; // TODO why need construct name
    // TODO recursive
    // TODO check validation of id
    if (event.id === null) this.messageService.add("no name input");
    else classDetail.name = String(event.id);

    classDetail.title = event.title;
    classDetail.start = event.start.toISOString(); // toString format
    classDetail._end = event.end?.toISOString();
    classDetail.color = event.color?.primary;
    classDetail.recursive = event.recursive;
    classDetail.description = event.description;
    classDetail.homework = event.homework;
    return classDetail;
  }

  classDetailToEvent(classDetail: ClassDetail) : CalendarEvent {
    let event : CalendarEvent = { start: new Date(), title: "default title"};
    if (classDetail.start != null && classDetail.title != null)
      event = {start: new Date(classDetail.start), title: classDetail.title};
    else {
      this.log("no title or start date");
      event = {start: new Date(), title: "default title"}
    }

    if (classDetail._end != null) event.end = new Date(classDetail._end);
    if (classDetail.color != null && event.color != null)
    event.color.primary = classDetail.color;

    event.id = classDetail.name;
    event.classId = classDetail.classId;
    // property
    // TODO other property set not here
    event.draggable = true;
    event.homework = classDetail.homework;
    event.description = classDetail.description;
    event.recursive = classDetail.recursive;

    if (event.resizable != null) {
      event.resizable.beforeStart = true;
      event.resizable.afterEnd = true;
    }
    return event;
  }

  classDetailsToEvents(classDetails: ClassDetail[]) : CalendarEvent[] {
    let events: CalendarEvent[] = [];
    for (let i = 0; i < classDetails.length; i++) {
      events.push(this.classDetailToEvent(classDetails[i]))
    }
    return events;
  }

  getEvents(): Observable<ClassDetail[]> {
    this.log('fetching students');
    return this.http.get<Student[]>(this.getUrl).pipe( //FIXME tap does not work, only work when there is no error
      tap(() => this.log('fetched events')),
      catchError(this.handleError<Student[]>('getEvents', [])),
    );
  }

  updateEvent(event: ClassDetail): Observable<any> {
    // check if the class exist by checking the classId and update or delete
    // TODO delete bind with delete button
    const url = `${this.updateEventUrl}`;
    this.log("test")
    return this.http.put(url, JSON.stringify(event), this.httpOptions).pipe(
      tap(_ => this.log(`updated event`)),
      catchError(this.handleError<any>('updateEvent'))
    );
  }

  deleteStudent(id: number): Observable<Student> {
    const url = `${this.updateEventUrl}/${id}`;
    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
